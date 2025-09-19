import React, { useState } from 'react';
import { Heart, MessageCircle, Bookmark, ShoppingBag, User, CheckCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { sampleNotifications } from '../data/dummyData';
import type { Notification } from '../data/dummyData';

export const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState(sampleNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filteredNotifications = notifications.filter(notification => 
    filter === 'all' || !notification.isRead
  );

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(notification =>
      notification.id === notificationId
        ? { ...notification, isRead: true }
        : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notification => ({ ...notification, isRead: true })));
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'like':
        return <Heart className="w-5 h-5 text-like" />;
      case 'save':
        return <Bookmark className="w-5 h-5 text-save" />;
      case 'message':
        return <MessageCircle className="w-5 h-5 text-message" />;
      case 'comment':
        return <MessageCircle className="w-5 h-5 text-brand-primary" />;
      case 'follow':
        return <User className="w-5 h-5 text-brand-primary" />;
      case 'sale':
        return <ShoppingBag className="w-5 h-5 text-success" />;
      default:
        return <Heart className="w-5 h-5 text-neutral-400" />;
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="card-elevated p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-neutral-800">Notifications</h1>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-2 text-sm font-medium text-brand-primary hover:text-brand-primary-hover transition-colors"
              >
                <CheckCheck className="w-4 h-4" />
                Mark all as read
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                filter === 'all'
                  ? 'text-brand-primary bg-brand-secondary'
                  : 'text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                filter === 'unread'
                  ? 'text-brand-primary bg-brand-secondary'
                  : 'text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100'
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-2">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`card-interactive p-4 transition-all duration-200 ${
                  !notification.isRead ? 'bg-brand-secondary/30 border-brand-primary/20' : ''
                }`}
                onClick={() => {
                  if (!notification.isRead) markAsRead(notification.id);
                  // Navigate to relevant page based on notification type and productId
                }}
              >
                <div className="flex items-start gap-3">
                  {/* Notification Icon */}
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* User Avatar */}
                  <img
                    src={notification.user.avatar}
                    alt={notification.user.name}
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                  />

                  {/* Notification Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm text-neutral-800">
                          <Link
                            to={`/profile/${notification.user.id}`}
                            className="font-semibold hover:underline"
                          >
                            {notification.user.name}
                          </Link>{' '}
                          {notification.content}
                        </p>
                        <p className="text-xs text-neutral-500 mt-1">
                          {formatTimeAgo(notification.timestamp)}
                        </p>
                      </div>
                      
                      {/* Unread Indicator */}
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-brand-primary rounded-full flex-shrink-0 mt-1" />
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 mt-2">
                      {notification.productId && (
                        <Link
                          to={`/product/${notification.productId}`}
                          className="text-xs font-medium text-brand-primary hover:text-brand-primary-hover transition-colors"
                        >
                          View Product
                        </Link>
                      )}
                      {notification.type === 'message' && (
                        <Link
                          to="/messages"
                          className="text-xs font-medium text-brand-primary hover:text-brand-primary-hover transition-colors"
                        >
                          Reply
                        </Link>
                      )}
                      {notification.type === 'follow' && (
                        <Link
                          to={`/profile/${notification.user.id}`}
                          className="text-xs font-medium text-brand-primary hover:text-brand-primary-hover transition-colors"
                        >
                          View Profile
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            /* Empty State */
            <div className="card-elevated p-8 text-center">
              <div className="w-16 h-16 bg-neutral-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                {filter === 'unread' ? (
                  <CheckCheck className="w-6 h-6 text-neutral-400" />
                ) : (
                  <Heart className="w-6 h-6 text-neutral-400" />
                )}
              </div>
              <h3 className="text-lg font-semibold text-neutral-800 mb-2">
                {filter === 'unread' ? 'All caught up!' : 'No notifications yet'}
              </h3>
              <p className="text-neutral-600">
                {filter === 'unread' 
                  ? "You've read all your notifications."
                  : "When someone likes, saves, or messages you, you'll see it here."
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};