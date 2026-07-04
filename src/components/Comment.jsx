import React, { useCallback, useEffect, useState } from "react";
import { MessageCircle, Send, Loader2 } from "lucide-react";
import CommentItem from "./CommentItem";
import axios from "axios";
import { useParams } from "react-router";
import { getOrCreateDeviceId } from "../utility/getOrCreateDeviceId";
import { auth, db, storage } from "../config/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";

// Firestore Timestamps show up either as an SDK Timestamp instance
// (with .toDate()) or as the raw { seconds, nanoseconds } shape you get
// from console.log'ing a snapshot. Handle both.
const formatRelativeTime = (createdAt) => {
  if (!createdAt) return "";
  const date =
    typeof createdAt.toDate === "function"
      ? createdAt.toDate()
      : createdAt.seconds
      ? new Date(createdAt.seconds * 1000)
      : new Date(createdAt);

  const diffSec = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diffSec < 10) return "Just now";
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} hr ago`;
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString();
};

// The comments collection is flat in Firestore. A comment is a root
// comment when it has no parent_comment_id. Everything else nests under
// its parent_comment_id, no matter how deep the reply chain goes.
const buildCommentTree = (flatComments) => {
  const byId = new Map();
  flatComments.forEach((c) => byId.set(c.id, { ...c, replies: [] }));

  const roots = [];
  byId.forEach((comment) => {
    const parent = comment.parent_comment_id && byId.get(comment.parent_comment_id);
    if (parent) {
      parent.replies.push(comment);
    } else {
      // No parent_comment_id, or the parent no longer exists (deleted) -> root
      roots.push(comment);
    }
  });

  const seconds = (c) => c.created_at?.seconds ?? 0;

  const sortTree = (list, newestFirst) => {
    list.sort((a, b) => (newestFirst ? seconds(b) - seconds(a) : seconds(a) - seconds(b)));
    list.forEach((c) => sortTree(c.replies, false));
  };
  sortTree(roots, true); // newest root comments first, oldest replies first within a thread

  return roots;
};

const countAll = (list) => list.reduce((acc, c) => acc + 1 + countAll(c.replies || []), 0);

const Comment = () => {
  const [comments, setComments] = useState([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [showComments, setShowComments] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyTexts, setReplyTexts] = useState({});
  const [sendingComment, setSendingComment] = useState(false);
  const [currentUserProfileUrl, setCurrentUserProfileUrl] = useState("");

  // `auth.currentUser` is a synchronous snapshot that's often still null
  // right after page load, before Firebase resolves the real auth state.
  // Subscribing to onAuthStateChanged gives us the actual signed-in user.
  const [currentUser, setCurrentUser] = useState(() => auth.currentUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => setCurrentUser(user));
    return unsubscribe;
  }, []);

  const apiUrl = import.meta.env.VITE_API_URL;
  const { id } = useParams();
  const deviceId = getOrCreateDeviceId();

  const fetchComments = useCallback(async () => {
    if (!id) return;
    setIsLoadingComments(true);
    try {
      const commentsRef = collection(db, "events", id, "comments");
      const q = query(commentsRef, orderBy("created_at", "desc"));
      const snapshot = await getDocs(q);

      // Comment docs now store `username` directly and `user_profile` as a
      // Storage *path* (e.g. "stream_users_profile/default/avatar.webp"),
      // not a ready-to-use URL. Turning a path into a URL is an extra
      // Storage call, and lots of comments share the same avatar path
      // (e.g. everyone on the default avatar) - so cache by path to avoid
      // resolving the same file over and over.
      const profileUrlCache = new Map();

      const resolveProfileUrl = async (path) => {
        if (!path) return null;
        if (profileUrlCache.has(path)) return profileUrlCache.get(path);

        let url = null;
        try {
          url = await getDownloadURL(ref(storage, path));
        } catch (err) {
          console.error(`Failed to load profile image at ${path}:`, err?.code || err);
        }
        profileUrlCache.set(path, url);
        return url;
      };

      const flatComments = await Promise.all(
        snapshot.docs.map(async (commentDoc) => {
          const comment = { id: commentDoc.id, ...commentDoc.data() };
          const profileUrl = await resolveProfileUrl(comment.user_profile);

          if (currentUser && comment.user_id === currentUser.uid && profileUrl) {
            setCurrentUserProfileUrl(profileUrl);
          }

          return { ...comment, profileUrl };
        })
      );

      setComments(buildCommentTree(flatComments));
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingComments(false);
    }
  }, [id, currentUser]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleAddComment = async () => {
    if (!newComment.trim() || sendingComment || !currentUser) return;

    setSendingComment(true);
    try {
      const token = await currentUser.getIdToken(true);

      // Root comment: no parent, no root - just the text.
      const payload = {
        eventId: id,
        commentText: newComment,
      };

      await axios.post(`${apiUrl}/eStreamApi/postComment`, payload, {
        headers: {
          "x-device-id": deviceId,
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      setNewComment("");
      await fetchComments();
    } catch (err) {
      console.error("Failed to post comment:", err);
    } finally {
      setSendingComment(false);
    }
  };

  // `parentItem` is the full comment/reply object being replied to.
  //
  //  - Replying to a root comment (it has no root_comment_id of its own):
  //      rootCommentId = parentCommentId = parentItem.id
  //  - Replying to a reply, at ANY depth (it already carries a root_comment_id
  //    pointing at the original top-level comment):
  //      rootCommentId   = parentItem.root_comment_id  (propagate the same root down)
  //      parentCommentId = parentItem.id                (the exact reply being answered)
  //
  // This one rule works for infinite nesting - no special-casing per depth.
  const handleAddReply = async (parentItem) => {
    const text = replyTexts[parentItem.id]?.trim();
    if (!text || !currentUser) return;

    const token = await currentUser.getIdToken(true);

    const rootCommentId = parentItem.root_comment_id || parentItem.id;
    const parentCommentId = parentItem.id;

    const payload = {
      eventId: id,
      commentText: text,
      rootCommentId,
      parentCommentId,
    };

    await axios.post(`${apiUrl}/eStreamApi/postComment`, payload, {
      headers: {
        "x-device-id": deviceId,
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });

    setReplyTexts((prev) => ({ ...prev, [parentItem.id]: "" }));
    setReplyingTo(null);
    await fetchComments();
  };

  const totalCommentCount = countAll(comments);

  return (
    <div className="w-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden shadow-xl shadow-cyan-500/5 transition-all duration-300">
      {/* HEADER - SHOW/HIDE COMMENTS */}
      {!showComments ? (
        <button
          onClick={() => setShowComments(true)}
          className="w-full flex items-center gap-4 sm:gap-5 p-5 sm:p-6 hover:bg-white/10 transition-all group"
        >
          <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <MessageCircle size={24} />
          </div>

          <div className="flex-1 text-left">
            <p className="font-bold text-lg sm:text-xl text-white">
              {isLoadingComments ? (
                <span className="animate-pulse">Loading comments...</span>
              ) : (
                <span>
                  {totalCommentCount} {totalCommentCount === 1 ? "Comment" : "Comments"}
                </span>
              )}
            </p>
          </div>

          <div className="text-slate-400 group-hover:text-cyan-400 transition-colors">
            <MessageCircle size={22} />
          </div>
        </button>
      ) : (
        <>
          {/* COMMENTS SECTION HEADER */}
          <div className="bg-white/5 backdrop-blur-sm border-b border-white/10 px-5 sm:px-6 py-4 flex items-center justify-between">
            <h3 className="font-bold text-lg text-white flex items-center gap-2">
              <MessageCircle size={20} className="text-cyan-400" />
              {isLoadingComments ? (
                <span className="animate-pulse">Loading comments...</span>
              ) : (
                <span>Comments ({totalCommentCount})</span>
              )}
            </h3>
            <button
              onClick={() => setShowComments(false)}
              className="text-sm text-slate-400 hover:text-cyan-400 transition-colors font-medium bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg"
            >
              Collapse
            </button>
          </div>

          {/* ADD COMMENT SECTION */}
          <div className="border-b border-white/10 p-4 sm:p-6 bg-white/5">
            <div className="flex gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0 text-white font-bold shadow-md overflow-hidden">
                {currentUserProfileUrl ? (
                  <img
                    src={currentUserProfileUrl}
                    alt="Your avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  "Y"
                )}
              </div>

              <div className="flex-1 space-y-3 ">
                <input
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleAddComment();
                    }
                  }}
                  disabled={sendingComment}
                  placeholder="Add a comment..."
                  className="w-full bg-white/10 border border-white/10 focus:border-cyan-500 outline-none px-5 py-3 rounded-xl text-[20px] text-white placeholder-slate-400 transition-all focus:ring-2 focus:ring-cyan-500/20 backdrop-blur-sm disabled:opacity-60 "
                />

                <div className="flex justify-end">
                  <button
                    onClick={handleAddComment}
                    disabled={!newComment.trim() || sendingComment}
                    className="flex items-center gap-2 px-5 sm:px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold rounded-xl text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/20 active:scale-95 min-w-[110px] justify-center"
                  >
                    {sendingComment ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Posting...</span>
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        <span className="hidden sm:inline">Comment</span>
                        <span className="sm:hidden">Post</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* COMMENTS LIST - CUSTOM SCROLLBAR */}
          <div
            className="overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
            style={{ maxHeight: "calc(100vh - 400px)", minHeight: "300px" }}
          >
            <div className="space-y-5 sm:space-y-6 p-4 sm:p-6 divide-y divide-white/5">
              {isLoadingComments ? (
                <div className="space-y-6 animate-pulse">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex-shrink-0" />
                      <div className="flex-1 space-y-2 pt-1">
                        <div className="h-3 w-24 bg-white/10 rounded" />
                        <div className="h-3 w-3/4 bg-white/10 rounded" />
                        <div className="h-3 w-1/2 bg-white/10 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : comments.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <MessageCircle size={40} className="mx-auto mb-3 opacity-30" />
                  <p className="text-base font-medium">No comments yet.</p>
                  <p className="text-sm mt-1">Be the first to start the conversation!</p>
                </div>
              ) : (
                comments.map((c) => (
                  <CommentItem
                    key={c.id}
                    item={c}
                    currentUser={currentUser}
                    replyingTo={replyingTo}
                    setReplyingTo={setReplyingTo}
                    replyTexts={replyTexts}
                    setReplyTexts={setReplyTexts}
                    handleAddReply={handleAddReply}
                  />
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Comment;
export { formatRelativeTime };