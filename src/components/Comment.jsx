import React, { useState } from "react";
import { MessageCircle, Send, Sparkles } from "lucide-react";

const initialComments = [
 /*  {
    id: 1,
    name: "Eyob",
    avatar: "E",
    time: "2 hours ago",
    text: "Can't wait for this tournament 🔥",
    replies: [
      {
        id: 11,
        name: "Hana",
        avatar: "H",
        time: "1 hour ago",
        text: "Same here 🙌",
      },
    ],
  },
  {
    id: 2,
    name: "Samuel",
    avatar: "S",
    time: "20 minutes ago",
    text: "Who else is supporting Team Ethiopia? 🇪🇹",
    replies: [],
  }, */
];

const Comment = () => {
  const [comments, setComments] = useState(initialComments);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");

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

  const handleAddReply = (commentId) => {
    if (!replyText.trim()) return;

    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? {
              ...c,
              replies: [
                ...c.replies,
                {
                  id: Date.now(),
                  name: "You",
                  avatar: "Y",
                  time: "Just now",
                  text: replyText,
                },
              ],
            }
          : c
      )
    );

    setReplyText("");
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
                  <div key={c.id} className="pt-5 first:pt-0">
                    <div className="flex gap-3 sm:gap-4">

                      {/* AVATAR */}
                      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center flex-shrink-0 text-slate-200 font-bold text-sm shadow-inner border border-white/5">
                        {c.avatar}
                      </div>

                      {/* COMMENT CONTENT */}
                      <div className="flex-1 min-w-0">
                        {/* HEADER */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                          <span className="font-bold text-sm sm:text-base text-white">
                            {c.name}
                          </span>
                          <span className="text-xs text-slate-500">
                            {c.time}
                          </span>
                        </div>

                        {/* TEXT */}
                        <p className="text-sm sm:text-base text-slate-300 mt-2 leading-relaxed break-words">
                          {c.text}
                        </p>

                        {/* REPLY BUTTON */}
                        <button
                          onClick={() =>
                            setReplyingTo(
                              replyingTo === c.id ? null : c.id
                            )
                          }
                          className="text-xs sm:text-sm text-slate-400 hover:text-cyan-400 transition-colors mt-3 font-medium flex items-center gap-1"
                        >
                          <MessageCircle size={14} />
                          {replyingTo === c.id ? 'Cancel' : 'Reply'}
                        </button>

                        {/* REPLY INPUT */}
                        {replyingTo === c.id && (
                          <div className="flex gap-2 mt-3 bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/10">
                            <input
                              value={replyText}
                              onChange={(e) =>
                                setReplyText(e.target.value)
                              }
                              onKeyPress={(e) => e.key === 'Enter' && handleAddReply(c.id)}
                              className="flex-1 bg-transparent outline-none text-sm text-white placeholder-slate-400"
                              placeholder="Write a reply..."
                              autoFocus
                            />

                            <button
                              onClick={() => handleAddReply(c.id)}
                              disabled={!replyText.trim()}
                              className="bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-600 text-white px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 shadow-md"
                            >
                              <Send size={14} />
                            </button>
                          </div>
                        )}

                        {/* REPLIES */}
                        {c.replies.length > 0 && (
                          <div className="mt-4 ml-0 sm:ml-2 border-l-2 border-cyan-500/30 pl-4 space-y-4">
                            {c.replies.map((r) => (
                              <div key={r.id} className="flex gap-3">
                                <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center flex-shrink-0 text-white text-xs font-bold border border-white/5">
                                  {r.avatar}
                                </div>

                                <div className="flex-1 min-w-0">
                                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                    <p className="text-sm font-bold text-white">
                                      {r.name}
                                    </p>
                                    <span className="text-xs text-slate-500">
                                      {r.time}
                                    </span>
                                  </div>
                                  <p className="text-sm text-slate-300 mt-1 break-words">
                                    {r.text}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                      </div>
                    </div>
                  </div>
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