import React, { useState } from "react";
import { Send, ChevronDown, ChevronUp, Loader2 } from "lucide-react";

// Deterministic fallback avatar color so the same user always gets the same tint
const AVATAR_COLORS = [
  "from-cyan-500 to-blue-600",
  "from-fuchsia-500 to-purple-600",
  "from-amber-500 to-orange-600",
  "from-emerald-500 to-teal-600",
  "from-rose-500 to-pink-600",
];

const colorForName = (name = "") => {
  const sum = name.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return AVATAR_COLORS[sum % AVATAR_COLORS.length];
};

const initialsForName = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "?";

// Firestore Timestamps come back either as an SDK Timestamp (.toDate())
// or the raw { seconds, nanoseconds } shape.
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

const CommentItem = ({
  item,
  currentUser,
  replyingTo,
  setReplyingTo,
  replyTexts,
  setReplyTexts,
  handleAddReply,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [sendingReply, setSendingReply] = useState(false);
  const [replyError, setReplyError] = useState(false);

  const hasReplies = item.replies && item.replies.length > 0;

  // Comment docs now store user info as flat fields directly on the
  // comment - `username`, `user_id`, and `user_profile` (a Storage path).
  // `profileUrl` is the already-resolved download URL that Comment.jsx
  // attaches after fetching (see resolveProfileUrl there). No more nested
  // `user` object to dig into.
  const username = item.username || "Anonymous";
  const isMe = currentUser?.uid === item.user_id;
  const displayName = isMe ? "You" : username;

  const onSendReply = async () => {
    if (!replyTexts[item.id]?.trim() || sendingReply) return;
    setSendingReply(true);
    setReplyError(false);
    try {
      // Pass the whole comment object up - Comment.jsx needs item.id and
      // item.root_comment_id to compute the correct parent/root for the
      // new reply, at whatever depth this comment sits at.
      await handleAddReply(item);
    } catch (err) {
      console.error("Failed to post reply:", err);
      setReplyError(true);
    } finally {
      setSendingReply(false);
    }
  };

  return (
    <div className="flex gap-3 mt-5 group">
      {/* Avatar */}
      <div className="flex-shrink-0">
        {item.profileUrl ? (
          <img
            src={item.profileUrl}
            alt={`${username}'s avatar`}
            className="w-10 h-10 rounded-full bg-slate-800 object-cover ring-2 ring-transparent group-hover:ring-slate-700/50 transition-all"
          />
        ) : (
          <div
            className={`w-10 h-10 rounded-full bg-gradient-to-br ${colorForName(
              username
            )} flex items-center justify-center text-white text-xs font-bold ring-2 ring-transparent group-hover:ring-slate-700/50 transition-all`}
          >
            {initialsForName(username)}
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-baseline gap-2 mb-1">
          <span className="font-semibold text-slate-100 text-sm truncate">
            {displayName}
          </span>
          <span className="text-xs text-slate-500 font-medium">
            {formatRelativeTime(item.created_at)}
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

          {hasReplies && (
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-xs font-medium text-cyan-500 hover:text-cyan-400 flex items-center gap-1 transition-colors"
            >
              {isCollapsed ? (
                <>
                  <ChevronDown size={14} className="stroke-[2.5]" />
                  <span>
                    View {item.replies.length} {item.replies.length === 1 ? "reply" : "replies"}
                  </span>
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
          <div className="mt-3">
            <div className="flex items-start gap-2">
              <textarea
                value={replyTexts[item.id] || ""}
                onChange={(e) => {
                  setReplyError(false);
                  setReplyTexts((prev) => ({
                    ...prev,
                    [item.id]: e.target.value,
                  }));
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    onSendReply();
                  }
                }}
                disabled={sendingReply}
                autoFocus
                className="flex-1 bg-slate-800/40 border border-slate-700/50 p-2.5 rounded-xl text-sm text-slate-100 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all resize-none min-h-[42px] disabled:opacity-60"
                placeholder={`Replying to ${username}...`}
                rows={1}
              />
              <button
                onClick={onSendReply}
                disabled={!replyTexts[item.id]?.trim() || sendingReply}
                className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:hover:bg-cyan-500 text-slate-950 p-2.5 rounded-xl font-medium transition-all flex items-center justify-center flex-shrink-0 w-[42px] h-[42px]"
                aria-label="Send reply"
              >
                {sendingReply ? (
                  <Loader2 size={16} className="stroke-[2.5] animate-spin" />
                ) : (
                  <Send size={16} className="stroke-[2.5]" />
                )}
              </button>
            </div>
            {replyError && (
              <p className="text-xs text-rose-400 mt-1.5">
                Couldn't send that reply. Please try again.
              </p>
            )}
          </div>
        )}

        {/* Nested Replies - recurses to any depth */}
        {hasReplies && !isCollapsed && (
          <div className="mt-4 border-l-2 border-slate-700/50 pl-4 space-y-4">
            {item.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                item={reply}
                currentUser={currentUser}
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