import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Package, MessageCircle, Calendar } from 'lucide-react';
import type { User } from '../data/dummyData';

interface SellerCardProps {
  seller: User;
  onMessage?: (sellerId: string) => void;
  showFullDetails?: boolean;
  className?: string;
}

export const SellerCard: React.FC<SellerCardProps> = ({
  seller,
  onMessage,
  showFullDetails = false,
  className = '',
}) => {
  const handleMessage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onMessage?.(seller.id);
  };

  const formatJoinDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });
  };

  return (
    <div className={`card-elevated p-4 ${className}`}>
      {/* Header with Avatar and Basic Info */}
      <div className="flex items-start gap-3 mb-4">
        <div className="relative">
          <img
            src={seller.avatar}
            alt={seller.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          {seller.isOnline && (
            <div className="status-online absolute -bottom-0.5 -right-0.5" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Link
              to={`/profile/${seller.id}`}
              className="font-semibold text-neutral-800 hover:text-brand-primary transition-colors"
            >
              {seller.name}
            </Link>
            {seller.isVerified && (
              <span className="verified-badge">
                ✓ Verified
              </span>
            )}
          </div>
          
          <p className="text-sm text-neutral-600 mb-1">@{seller.username}</p>
          
          {seller.bio && (
            <p className="text-sm text-neutral-600 line-clamp-2">{seller.bio}</p>
          )}
        </div>
      </div>

      {/* Trust Score and Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Star className="w-4 h-4 fill-current text-warning" />
            <span className="font-semibold text-lg">{seller.trustScore}</span>
          </div>
          <p className="text-xs text-neutral-500">Trust Score</p>
        </div>
        
        <div className="text-center">
          <div className="font-semibold text-lg text-neutral-800 mb-1">
            {seller.totalSales}
          </div>
          <p className="text-xs text-neutral-500">Sales</p>
        </div>
      </div>

      {/* Extended Details */}
      {showFullDetails && (
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-neutral-600">
            <Clock className="w-4 h-4" />
            <span>Responds {seller.responseTime}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-neutral-600">
            <Package className="w-4 h-4" />
            <span>{seller.totalReviews} reviews</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-neutral-600">
            <Calendar className="w-4 h-4" />
            <span>Joined {formatJoinDate(seller.joinDate)}</span>
          </div>
        </div>
      )}

      {/* Quick Stats (Compact Mode) */}
      {!showFullDetails && (
        <div className="flex items-center justify-between text-xs text-neutral-500 mb-4">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {seller.responseTime}
          </div>
          <div className="flex items-center gap-1">
            <Package className="w-3 h-3" />
            {seller.totalReviews} reviews
          </div>
        </div>
      )}

      {/* Action Button */}
      <button
        onClick={handleMessage}
        className="btn-brand w-full flex items-center justify-center gap-2"
      >
        <MessageCircle className="w-4 h-4" />
        Message Seller
      </button>
    </div>
  );
};