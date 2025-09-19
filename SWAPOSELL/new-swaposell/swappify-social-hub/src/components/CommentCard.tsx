// CommentCard.tsx
import React, { useState } from 'react';
import { Heart, Reply } from 'lucide-react';
import { toast } from 'sonner';

export interface User {
  id: string | number;
  name: string;
  username: string;
  avatar?: string;
  email?: string;
  is_verified?: boolean;
  isVerified?: boolean; // For backward compatibility
  [key: string]: any; // Allow additional properties
}

export interface Comment {
  id: string | number;
  content: string;
  user: User;
  timestamp: string;
  likes: number;
  isLiked?: boolean;
  isLoading?: boolean;
  isLiking?: boolean;
  isEdited?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  parent_id?: number | null;
  replies?: Comment[];
  replies_count?: number;
}

interface CommentCardProps {
  comment: Comment;
  onLike?: (commentId: string, isLiked: boolean) => void;
  onReply?: (commentId: string, content: string) => void;
  className?: string;
  currentUser?: User | null;
  isReply?: boolean;
}

export const CommentCard: React.FC<CommentCardProps> = ({
  comment,
  onLike,
  onReply,
  className = '',
  currentUser = null,
  isReply = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyContent, setReplyContent] = useState('');

  // Process user data with proper fallbacks
  const user: User = {
    id: typeof comment.user?.id === 'number' ? comment.user.id : 0,
    name: comment.user?.name || 'Anonymous',
    username: comment.user?.username || 'anonymous',
    avatar: comment.user?.avatar || '/default-avatar.png',
    email: comment.user?.email || '',
    is_verified: comment.user?.is_verified || false
  };

  const handleLike = () => {
    if (onLike && comment.id) {
      onLike(comment.id.toString(), !comment.isLiked);
    }
  };

  const handleReply = () => {
    if (onReply && replyContent.trim() && comment.id) {
      onReply(comment.id.toString(), replyContent);
      setReplyContent('');
      setShowReplyInput(false);
    }
  };

  const handleReplyClick = () => {
    if (!currentUser) {
      toast.error('Please sign in to reply to comments');
      return;
    }
    setShowReplyInput(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleReply();
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className={`animate-fade-in ${className}`}>
      <div className="flex gap-3">
        {/* User Avatar */}
        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
          {user.avatar ? (
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/default-avatar.png';
              }}
            />
          ) : (
            <span className="text-gray-600 text-sm">
              {user.name?.[0]?.toUpperCase() || 'A'}
            </span>
          )}
        </div>
        
        {/* Comment Content */}
        <div className="flex-1">
          {/* User Info */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-neutral-800">
              {user.name || 'Anonymous'}
            </span>
            {(user.is_verified || user.isVerified) && (
              <span className="text-blue-500" title="Verified">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </span>
            )}
            {user.username && user.username !== 'anonymous' && (
              <span className="text-xs text-neutral-500">
                @{user.username}
              </span>
            )}
            <span className="text-xs text-neutral-400">
              {formatTimeAgo(comment.timestamp)}
            </span>
          </div>
          
          {/* Comment Text */}
          <p className="text-sm text-neutral-800 mt-1">{comment.content}</p>
          
          {/* Actions */}
          <div className="flex items-center gap-4 text-xs text-neutral-500 mt-2">
            <button 
              onClick={handleLike}
              className={`flex items-center gap-1 ${comment.isLiked ? 'text-red-500' : ''}`}
              disabled={comment.isLiking}
            >
              <Heart 
                size={14} 
                fill={comment.isLiked ? 'currentColor' : 'none'} 
              />
              {comment.likes || 0}
            </button>
            
            {onReply && (
              <button 
                onClick={handleReplyClick}
                className="flex items-center gap-1 hover:text-brand-primary"
                disabled={!currentUser || comment.isLiking}
                title={!currentUser ? 'Sign in to reply' : 'Reply'}
              >
                <Reply size={14} />
                <span>Reply</span>
              </button>
            )}
          </div>
          
          {/* Reply Input */}
          {showReplyInput && (
            <div className={`mt-3 ${isReply ? 'pl-6' : 'pl-10'}`}>
              <div className="flex gap-2">
                <div className="flex-1">
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Write a reply..."
                    className="w-full text-sm px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary resize-none"
                    rows={2}
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <button
                      onClick={() => setShowReplyInput(false)}
                      className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleReply}
                      disabled={!replyContent.trim()}
                      className={`px-3 py-1 text-sm rounded-lg text-white ${
                        !replyContent.trim() 
                          ? 'bg-gray-300 cursor-not-allowed' 
                          : 'bg-brand-primary hover:bg-brand-primary/90'
                      }`}
                    >
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Nested Replies */}
          {isExpanded && comment.replies && comment.replies.length > 0 && (
            <div className="mt-3 pl-6 border-l-2 border-neutral-100">
              {comment.replies.map((reply) => (
                <CommentCard
                  key={reply.id}
                  comment={reply}
                  onLike={onLike}
                  onReply={onReply}
                  className="mt-3"
                  isReply={true}
                  currentUser={currentUser}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};