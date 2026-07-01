import React, { useState } from 'react';
import { Send, ChevronDown, ChevronUp } from 'lucide-react'; // Assuming you use lucide-react for Send

const CommentItem = ({
  item,
  replyingTo,
  setReplyingTo,
  replyTexts,
  setReplyTexts,
  handleAddReply,
}) => {
  // Local state to track whether this specific comment's replies are hidden
  const [isCollapsed, setIsCollapsed] = useState(true);
  const hasReplies = item.replies && item.replies.length > 0;

  return (
    <div className="flex gap-3 mt-4 ">
      {/* Avatar */}
      <div className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center text-white font-bold flex-shrink-0">
        {item.avatar}
      </div>

      <div className="flex-1">
        {/* Header */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-white">{item.name}</span>
          <span className="text-xs text-slate-500">{item.time}</span>
        </div>

        {/* Comment Text */}
        <p className="text-slate-300 mt-2">{item.text}</p>

        {/* Actions Bar */}
        <div className="flex items-center gap-4 mt-2">
          <button
            onClick={() =>
              setReplyingTo(replyingTo === item.id ? null : item.id)
            }
            className="text-sm text-slate-400 hover:text-white transition-colors"
          >
            {replyingTo === item.id ? "Cancel" : "Reply"}
          </button>

          {/* Show/Hide Replies Toggle Button */}
          {hasReplies && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
            >
              {isCollapsed ? (
                <>
                  <ChevronDown size={14} />
                  <span>Show replies ({item.replies.length})</span>
                </>
              ) : (
                <>
                  <ChevronUp size={14} />
                  <span>Hide replies</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Reply Input Box */}
        {replyingTo === item.id && (
          <div className="flex gap-2 mt-3">
            <input
              value={replyTexts[item.id] || ""}
              onChange={(e) =>
                setReplyTexts((prev) => ({
                  ...prev,
                  [item.id]: e.target.value,
                }))
              }
              className="flex-1 bg-white/10 p-2 rounded text-white outline-none focus:ring-1 focus:ring-cyan-500"
              placeholder="Write a reply..."
            />
            <button
              onClick={() => handleAddReply(item.id)}
              className="bg-cyan-500 hover:bg-cyan-600 px-3 rounded text-slate-900 font-medium transition-colors flex items-center justify-center"
            >
              <Send size={14} />
            </button>
          </div>
        )}

        {/* Nested Replies - Rendered conditionally based on isCollapsed */}
        {hasReplies && !isCollapsed && (
          <div className="ml-6 border-l border-cyan-500/30 pl-4 separation-line">
            {item.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                item={reply}
                replyingTo={replyingTo}
                setReplyingTo={setReplyingTo}
                replyTexts={replyTexts}
                setReplyTexts={setReplyTexts}
                handleAddReply={handleAddReply}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentItem;