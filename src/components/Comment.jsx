import React, { useState } from "react";
import { MessageCircle, Send, Sparkles } from "lucide-react";
import CommentItem from "./CommentItem";

const initialComments = [
  {
    id: 1,
    name: "Alex Morgan",
    avatar: "AM",
    time: "2 min ago",
    text: "This is an absolutely fantastic breakdown. Thanks for sharing!",
    replies: [
      {
        id: 51,
        name: "bruce_wayne",
        avatar: "BW",
        time: "1 hr ago",
        text: "Can someone explain how this scales with larger datasets?",
        replies: [
          {
            id: 142,
            name: "Yuki Tanaka",
            avatar: "YT",
            time: "10 min ago",
            text: "Does this support concurrent requests out of the box?",
            replies: []
          }
        ]
      },
      {
        id: 89,
        name: "Sarah Connor",
        avatar: "SC",
        time: "3 hr ago",
        text: "Ran into this exact issue yesterday. This fix worked like a charm.",
        replies: []
      }
    ]
  },
  {
    id: 2,
    name: "Elena Rostova",
    avatar: "ER",
    time: "1 day ago",
    text: "Brilliant write-up. Extremely clear and concise.",
    replies: [
      {
        id: 64,
        name: "Jane Doe",
        avatar: "JD",
        time: "2 days ago",
        text: "Wow, I never looked at it from this perspective before.",
        replies: []
      }
    ]
  }
  // ... structurally scales up to id: 500 across deep nested reply chains
];

const Comment = () => {
  const [comments, setComments] = useState(initialComments);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyTexts, setReplyTexts] = useState({});



  const handleAddComment = () => {
    if (!newComment.trim()) return;

    setComments((prev) => [
      {
        id: Date.now(),
        name: "You",
        avatar: "Y",
        time: "Just now",
        text: newComment,
        replies: [],
      },
      ...prev,
    ]);

    setNewComment("");
  };

  const addReply = (items, targetId, newReply) => {
    return items.map((item) => {
      if (item.id === targetId) {
        return {
          ...item,
          replies: [...item.replies, newReply],
        };
      }

      return {
        ...item,
        replies: addReply(
          item.replies,
          targetId,
          newReply
        ),
      };
    });
  };

const handleAddReply = (targetId) => {
  const text = replyTexts[targetId]?.trim();

  if (!text) return;

  const newReply = {
    id: Date.now(),
    name: "You",
    avatar: "Y",
    time: "Just now",
    text,
    replies: [],
  };

  setComments((prev) =>
    addReply(prev, targetId, newReply)
  );

  setReplyTexts((prev) => ({
    ...prev,
    [targetId]: "",
  }));

  setReplyingTo(null);
};

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
              {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
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
              Comments ({comments.length})
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
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0 text-white font-bold shadow-md">
                Y
              </div>

              <div className="flex-1 space-y-3">
                <div className="relative">
                  <input
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                    placeholder="Add a comment..."
                    className="w-full bg-white/10 border border-white/10 focus:border-cyan-500 outline-none px-5 py-3 rounded-xl text-sm text-white placeholder-slate-400 transition-all focus:ring-2 focus:ring-cyan-500/20 backdrop-blur-sm"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    className="flex items-center gap-2 px-5 sm:px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:from-slate-600 disabled:to-slate-700 text-white font-semibold rounded-xl text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/20 active:scale-95"
                  >
                    <Send size={16} />
                    <span className="hidden sm:inline">Comment</span>
                    <span className="sm:hidden">Post</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* COMMENTS LIST - CUSTOM SCROLLBAR */}
          <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent" style={{ maxHeight: "calc(100vh - 400px)", minHeight: "300px" }}>
            <div className="space-y-5 sm:space-y-6 p-4 sm:p-6 divide-y divide-white/5">

              {comments.length === 0 ? (
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