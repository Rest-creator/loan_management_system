import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Server from '../server/Server';
import { useAuth } from '@/server/AuthContext';

// Define a comprehensive User interface that handles all possible user data
interface User {
  id: string | number;
  username: string;
  email: string;
  name: string;
  avatar: string;
  is_verified?: boolean;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  date_joined?: string;
  location?: string;
  phone_number?: string;
}

import { toast } from 'sonner';
import { CommentCard } from './CommentCard';

interface Comment {
  id: string | number;
  user: User;
  content: string;
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

interface ExtendedComment extends Omit<Comment, 'replies' | 'id'> {
  id: string | number;
  user: User;
  replies: ExtendedComment[];
  replies_count: number;
  isEdited: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

interface CommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productTitle: string;
}

export const CommentsModal: React.FC<CommentsModalProps> = ({
  isOpen,
  onClose,
  productId,
  productTitle = 'this product',
}) => {
  const { user, isAuthenticated, login } = useAuth();
  const [comments, setComments] = useState<ExtendedComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tempComments, setTempComments] = useState<{ [key: string]: boolean }>({});
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  // Function to update a comment in the comments tree
  const updateCommentInTree = (
    comments: ExtendedComment[],
    commentId: string | number,
    updater: (comment: ExtendedComment) => ExtendedComment
  ): ExtendedComment[] => {
    return comments.map(comment => {
      if (comment.id === commentId) {
        return updater(comment);
      }
      if (comment.replies && comment.replies.length > 0) {
        return {
          ...comment,
          replies: updateCommentInTree(comment.replies, commentId, updater)
        };
      }
      return comment;
    });
  };

  // Function to check if current user can edit a comment
  const canEditComment = (commentUserId: number | string): boolean => {
    if (!user) return false;
    return user.id.toString() === commentUserId.toString();
  };

  // Function to check if current user can delete a comment
  const canDeleteComment = (commentUserId: number | string): boolean => {
    if (!user) return false;
    // For now, only allow users to delete their own comments
    // You can add admin check later if needed
    return user.id.toString() === commentUserId.toString();
  };

  // Fetch comments when modal opens or when state changes
  useEffect(() => {
    if (isOpen && productId) {
      fetchComments();
    }
  }, [isOpen, productId, isAuthenticated]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await Server.fetchComments('product', parseInt(productId));

      if (response.data?.results?.comments) {
        // Process comments to ensure they have all required fields
        const processComment = (comment: {
          id: number | string;
          user: User | ServerUser;
          content: string;
          created_at: string;
          likes_count: number;
          is_liked: boolean;
          replies?: any[];
          parent?: number | null;
          replies_count?: number;
          can_edit?: boolean;
          can_delete?: boolean;
          is_edited?: boolean;
        }): ExtendedComment => {
          const userData = comment.user;

          // Process user data with proper type safety
          const processUserData = (data: User): User => {
            const username = data.username ||
              (data.email ? data.email.split('@')[0] : 'anonymous');

            const name = data.name ||
              (data.full_name ||
                (data.first_name || data.last_name ?
                  `${data.first_name || ''} ${data.last_name || ''}`.trim() : 'User'));

            return {
              ...data,
              id: data.id.toString(),
              username,
              email: data.email || '',
              name,
              avatar: data.avatar || '/default-avatar.png',
              is_verified: data.is_verified || false
            };
          };

          const processedUser = processUserData(userData as User);
          const isVerified = processedUser.is_verified || false;

          const processedComment: ExtendedComment = {
            id: comment.id,
            content: comment.content,
            user: processedUser,
            timestamp: comment.created_at,
            likes: comment.likes_count || 0,
            isLiked: comment.is_liked || false,
            isLoading: false,
            isLiking: false,
            isEdited: comment.is_edited || false,
            canEdit: canEditComment(comment.user.id),
            canDelete: canDeleteComment(comment.user.id),
            replies: [], // Initialize empty array, will be populated with processed replies
            parent_id: comment.parent || null,
            replies_count: comment.replies_count || 0
          };

          // Process replies if they exist
          if (comment.replies && comment.replies.length > 0) {
            processedComment.replies = comment.replies.map(reply => processComment(reply));
          }

          return processedComment;
        };

        // Sort comments by creation date (newest first)
        const sortedComments = [...response.data.results.comments]
          .sort((a, b) => {
            const dateA = new Date(a.created_at).getTime();
            const dateB = new Date(b.created_at).getTime();
            return dateB - dateA;
          })
          .map(processComment);

        setComments(sortedComments);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (content: string, parentId?: string) => {
    if (!isAuthenticated || !user) {
      // Redirect to login or show login modal
      // This will depend on your auth flow
      window.location.href = '/login';
      return;
    }

    const tempId = `temp-${Date.now()}`;
    const userData = {
      id: user.id,
      username: 'user', // Default username if not provided
      email: user.email || '',
      name: user.name || 'Anonymous User',
      avatar: user.avatar || '/default-avatar.png'
    };

    const newComment: ExtendedComment = {
      id: tempId,
      user: {
        id: userData.id.toString(),
        username: userData.username,
        name: userData.name,
        email: userData.email,
        avatar: userData.avatar
      },
      content: content,
      timestamp: new Date().toISOString(),
      likes: 0,
      isLiked: false,
      isLoading: true,
      isLiking: false,
      isEdited: false,
      canEdit: true,
      canDelete: true,
      replies: [],
      parent_id: parentId ? parseInt(parentId) : null,
      replies_count: 0
    };

    // Optimistically add the comment to the UI
    if (parentId) {
      // Add as a reply
      setComments(prev =>
        updateCommentInTree(prev, parentId, comment => ({
          ...comment,
          replies: [newComment, ...(comment.replies || [])],
          replies_count: (comment.replies_count || 0) + 1
        }))
      );
    } else {
      // Add as a top-level comment
      setComments(prev => [newComment, ...prev]);
    }

    try {
      setIsSubmitting(true);
      const commentRequest = {
        content_type: 'product',
        object_id: parseInt(productId),
        content: content,
        parent_id: parentId ? parseInt(parentId) : undefined
      };

      // Make the API call
      const response = await Server.addComment(commentRequest);

      if (response.data) {
        toast.success(parentId ? 'Reply posted successfully' : 'Comment posted successfully');

        // Process the server response to create a properly typed comment
        const serverComment = response.data;
        const serverUser: ServerUser = serverComment.user || {} as ServerUser;

        const processedComment: ExtendedComment = {
          id: serverComment.id,
          user: {
            id: serverUser.id || userData.id,
            username: serverUser.username || userData.username,
            name: serverUser.name || userData.name,
            email: serverUser.email || userData.email,
            is_verified: serverUser.is_verified ?? userData.is_verified ?? false,
            avatar: serverUser.avatar || userData.avatar || '/default-avatar.png'
          },
          content: serverComment.content,
          timestamp: serverComment.created_at || new Date().toISOString(),
          likes: serverComment.likes_count || 0,
          isLiked: serverComment.is_liked || false,
          isLoading: false,
          isLiking: false,
          isEdited: serverComment.is_edited || false,
          canEdit: canEditComment(serverComment.user.id),
          canDelete: canDeleteComment(serverComment.user.id),
          replies: [],
          parent_id: serverComment.parent || null,
          replies_count: serverComment.replies_count || 0
        };

        // Replace the temporary comment with the actual one from the server
        setComments(prev => {
          if (parentId) {
            // For replies
            return prev.map(comment => {
              if (comment.id === parentId) {
                return {
                  ...comment,
                  replies: (comment.replies || []).map(reply =>
                    reply.id === tempId ? { ...response.data, isLoading: false } : reply
                  )
                };
              }
              return comment;
            });
          } else {
            // For top-level comments
            return prev.map(comment =>
              comment.id === tempId ? { ...response.data, isLoading: false } : comment
            );
          }
        });
      }
    } catch (error: any) {
      console.error('Error adding comment:', error);

      // Remove the optimistic update on error
      const tempIdToRemove = tempId; // Store in a local constant to avoid closure issues
      setComments(prev => {
        if (parentId) {
          // For replies
          return prev.map(comment => ({
            ...comment,
            replies: (comment.replies || []).filter(reply => reply.id !== tempIdToRemove)
          }));
        } else {
          // For top-level comments
          return prev.filter(comment => comment.id !== tempIdToRemove);
        }
      });

      // Remove from temp comments tracking
      setTempComments(prev => {
        const newTemp = { ...prev };
        delete newTemp[tempIdToRemove];
        return newTemp;
      });

      if (error.response?.status === 401) {
        toast.error('Your session has expired. Please log in again.');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      } else {
        toast.error(error.response?.data?.message || 'Failed to post comment. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async (commentId: string, currentIsLiked: boolean) => {
    if (!isAuthenticated) {
      toast.error('Please sign in to like comments');
      const returnUrl = encodeURIComponent(window.location.pathname);
      window.location.href = `/login?returnUrl=${returnUrl}`;
      return;
    }

    // Optimistically update the UI
    setComments(prev =>
      prev.map(comment => {
        // Check if this is the comment that was liked
        if (comment.id === commentId) {
          return {
            ...comment,
            isLiked: !comment.isLiked,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
            isLiking: true
          };
        }
        // Check if any replies were liked
        if (comment.replies && comment.replies.length > 0) {
          return {
            ...comment,
            replies: comment.replies.map(reply => {
              if (reply.id === commentId) {
                return {
                  ...reply,
                  isLiked: !reply.isLiked,
                  likes: reply.isLiked ? reply.likes - 1 : reply.likes + 1,
                  isLiking: true
                };
              }
              return reply;
            })
          };
        }
        return comment;
      })
    );

    try {
      const response = await Server.likeComment(parseInt(commentId));

      if (response.data) {
        // Update with server data to ensure consistency
        setComments(prev =>
          prev.map(comment => {
            if (comment.id === commentId) {
              return {
                ...comment,
                ...response.data,
                isLiking: false
              };
            }
            if (comment.replies && comment.replies.length > 0) {
              return {
                ...comment,
                replies: comment.replies.map(reply =>
                  reply.id === commentId
                    ? { ...reply, ...response.data, isLiking: false }
                    : reply
                )
              };
            }
            return comment;
          })
        );
      }
    } catch (error) {
      console.error('Error liking comment:', error);

      // Revert optimistic update on error
      setComments(prev =>
        prev.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              isLiked: currentIsLiked,
              likes: currentIsLiked ? comment.likes : comment.likes - 1,
              isLiking: false
            };
          }
          if (comment.replies && comment.replies.length > 0) {
            return {
              ...comment,
              replies: comment.replies.map(reply =>
                reply.id === commentId
                  ? {
                    ...reply,
                    isLiked: currentIsLiked,
                    likes: currentIsLiked ? reply.likes : reply.likes - 1,
                    isLiking: false
                  }
                  : reply
              )
            };
          }
          return comment;
        })
      );

      toast.error('Failed to like comment. Please try again.');
    }
  };

  const handleDelete = async (commentId: string) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        const response = await Server.deleteComment(parseInt(commentId));
        if (response.status === 204) { // 204 No Content on successful deletion
          // Remove the comment from the local state
          setComments(prevComments =>
            prevComments.filter(comment => comment.id !== commentId)
          );
        }
      } catch (error) {
        console.error('Error deleting comment:', error);
      }
    }
  };

  if (!isOpen) return null;


  console.log(comments);


  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Comments for {productTitle}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={24} />
              </button>
            </div>
            <div className="mt-4 h-96 overflow-y-auto">
              {loading ? (
                <div className="flex justify-center items-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {comments.length > 0 ? (
                    comments.map((comment) => (
                      <CommentCard
                        key={comment.id}
                        comment={{
                          ...comment,
                          user: {
                            ...comment.user,
                            is_verified: comment.user?.is_verified || false,
                            name: comment.user?.name || comment.user?.username || 'Anonymous',
                            username: comment.user?.username || 'anonymous',
                            avatar: comment.user?.avatar || '/default-avatar.png'
                          }
                        }}
                        onLike={() => handleLike(comment.id.toString(), comment.isLiked)}
                        onReply={(commentId, content) => handleAddComment(content, commentId)}
                        currentUser={user || null}
                      />
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      No comments yet. Be the first to comment!
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="mt-4">
              <div className="flex items-start space-x-2">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name || 'User'}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/default-avatar.png';
                        }}
                      />
                    ) : (
                      <span className="text-gray-600 font-medium">
                        {user?.name?.[0]?.toUpperCase() || 'U'}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <textarea
                    rows={2}
                    className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      type="button"
                      onClick={() => handleAddComment(newComment)}
                      disabled={!newComment.trim() || isSubmitting}
                      className={`px-4 py-2 rounded-lg text-white ${!newComment.trim() || isSubmitting ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-600'}`}
                    >
                      {isSubmitting ? 'Posting...' : 'Post'}
                    </button>
                  </div>
                </div>
              </div>

              {replyingTo && (
                <div className="mt-4 ml-12">
                  <div className="flex items-start space-x-2">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-sm">
                        {(user?.username?.[0] || 'U').toUpperCase()}
                      </div>
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        className="w-full border rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Write a reply..."
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleAddComment(replyContent, replyingTo);
                          }
                        }}
                      />
                      <div className="flex justify-end space-x-2 mt-2">
                        <button
                          type="button"
                          onClick={() => setReplyingTo(null)}
                          className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAddComment(replyContent, replyingTo)}
                          disabled={!replyContent.trim() || isSubmitting}
                          className={`px-3 py-1 text-sm rounded-lg text-white ${!replyContent.trim() || isSubmitting ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-600'}`}
                        >
                          {isSubmitting ? 'Replying...' : 'Reply'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};