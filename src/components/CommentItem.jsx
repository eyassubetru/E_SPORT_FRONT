import React, { useState } from 'react';
import { Send, ChevronDown, ChevronUp } from 'lucide-react'; // Assuming you use lucide-react for Send
import { auth, db, storage } from "../config/firebaseConfig";

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
   const currentUser = auth.currentUser;

  return (
  <div className="flex gap-3 mt-5 group">
    {/* Avatar */}
    <div className="flex-shrink-0">
      <img 
        src={item.user.profileUrl} 
        alt={`${item.user.username}'s avatar`}
        className="w-10 h-10 rounded-full bg-slate-800 object-cover ring-2 ring-transparent group-hover:ring-slate-700/50 transition-all" 
      />
    </div>

    {/* Main Content Area - min-w-0 prevents long text from breaking the flex layout */}
    <div className="flex-1 min-w-0">
      
      {/* Header */}
      <div className="flex items-baseline gap-2 mb-1">
        <span className="font-semibold text-slate-100 text-sm truncate">
          {currentUser.id === item.user.user_id ? "You" : item.user.username}
        </span>
        <span className="text-xs text-slate-500 font-medium">
          {item.time}
        </span>
      </div>

      {/* Comment Text */}
      <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap break-words">
        {item.text}
      </p>

      {/* Actions Bar */}
      <div className="flex items-center gap-5 mt-2.5">
        <button
          onClick={() => setReplyingTo(replyingTo === item.id ? null : item.id)}
          className="text-xs font-medium text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-1.5"
        >
          {replyingTo === item.id ? "Cancel" : "Reply"}
        </button>

        {/* Show/Hide Replies Toggle Button */}
        {hasReplies && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-xs font-medium text-cyan-500 hover:text-cyan-400 flex items-center gap-1 transition-colors"
          >
            {isCollapsed ? (
              <>
                <ChevronDown size={14} className="stroke-[2.5]" />
                <span>View {item.replies.length} {item.replies.length === 1 ? 'reply' : 'replies'}</span>
              </>
            ) : (
              <>
                <ChevronUp size={14} className="stroke-[2.5]" />
                <span>Hide replies</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Reply Input Box */}
      {replyingTo === item.id && (
        <div className="flex items-start gap-2 mt-3">
          <textarea
            value={replyTexts[item.id] || ""}
            onChange={(e) =>
              setReplyTexts((prev) => ({
                ...prev,
                [item.id]: e.target.value,
              }))
            }
            className="flex-1 bg-slate-800/40 border border-slate-700/50 p-2.5 rounded-xl text-sm text-slate-100 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all resize-none min-h-[42px]"
            placeholder={`Replying to ${item.user.username}...`}
            rows={1}
          />
          <button
            onClick={() => handleAddReply(item.id)}
            disabled={!replyTexts[item.id]?.trim()}
            className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:hover:bg-cyan-500 text-slate-950 p-2.5 rounded-xl font-medium transition-all flex items-center justify-center flex-shrink-0"
            aria-label="Send reply"
          >
            <Send size={16} className="stroke-[2.5]" />
          </button>
        </div>
      )}

      {/* Nested Replies */}
      {hasReplies && !isCollapsed && (
        <div className="mt-4 border-l-2 border-slate-700/50 pl-4 space-y-4">
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