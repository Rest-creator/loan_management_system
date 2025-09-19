import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  Bookmark,
  Eye,
  MessageCircle,
  MapPin,
  Star,
  Share2,
  Clock,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CommentsModal } from "./CommentsModal";
import { sampleComments, sampleUsers } from "../data/dummyData";
import type { Product, Comment } from "../data/dummyData";
import { MessageModal } from "./messaging/MessageModal";

interface ProductCardProps {
  product: Product;
  onLike?: (productId: string) => void;
  onSave?: (productId: string) => void;
  onMessage?: (sellerId: string) => void;
  onShare?: (productId: string) => void;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onLike,
  onSave,
  onMessage,
  onShare,
  className = "",
}) => {
  const { toast } = useToast();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(product.is_liked);
  const [isSaved, setIsSaved] = useState(product.is_saved);
  const [likes, setLikes] = useState(product.likes_count);
  const [saves, setSaves] = useState(product.saves_count);
  const [commentCount, setCommentCount] = useState(product.comments_count || 0);

  const [showComments, setShowComments] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [comments, setComments] = useState<Comment[]>(
    sampleComments.slice(0, 2)
  ); // Sample comments for demo

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);
    setLikes((prev) => (newIsLiked ? prev + 1 : prev - 1));
    onLike?.(product.id);
  };
  console.log(product);

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newIsSaved = !isSaved;
    setIsSaved(newIsSaved);
    setSaves((prev) => (newIsSaved ? prev + 1 : prev - 1));
    onSave?.(product.id);
  };

  const handleMessage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMessageModal(true);
    // onMessage?.(product.user.id);
  };

  const handleComments = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowComments(true);
  };

  const handleAddComment = (content: string) => {
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      user: sampleUsers[0], // Current user
      content,
      timestamp: new Date().toISOString(),
      likes: 0,
      isLiked: false,
    };
    setComments((prev) => [newComment, ...prev]);
  };

  const handleLikeComment = (commentId: string) => {
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === commentId
          ? {
            ...comment,
            isLiked: !comment.isLiked,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
          }
          : comment
      )
    );
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const shareData = {
      title: product.title,
      text: `Check out this ${product.condition
        } ${product.category.toLowerCase()} for ${formatPrice(product.price)}`,
      url: `${window.location.origin}/product/${product.id}`,
    };

    // Check if navigator.share is available (mobile browsers)
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        onShare?.(product.id);
      } catch (error) {
        console.log("Share cancelled or failed:", error);
      }
    } else {
      // Fallback: copy to clipboard for desktop
      try {
        await navigator.clipboard.writeText(
          `${window.location.origin}/product/${product.id}`
        );
        toast({
          title: "Link copied!",
          description: "Product link has been copied to your clipboard.",
          duration: 3000,
        });
        onShare?.(product.id);
      } catch (error) {
        console.error("Failed to copy link:", error);
        toast({
          title: "Share failed",
          description: "Unable to copy link. Please try again.",
          variant: "destructive",
          duration: 3000,
        });
      }
    }
  };

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  console.log(product);

  return (
    <Link
      // to={`/product/${product.id}`}
      className={`block card-interactive animate-fade-in ${className}`}
    >
      {/* Image Carousel */}
      <div className="relative aspect-square bg-neutral-100 rounded-t-xl overflow-hidden group">
        {product.images.length > 0 && product.images.map((image) => (
        <img
          src={image.image_url}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        ))}
        {/* Image Navigation */}
        {product.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-black/20 hover:bg-black/40 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200"
            >
              ←
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-black/20 hover:bg-black/40 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200"
            >
              →
            </button>

            {/* Image Dots */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2 overflow-x-auto max-w-[90%] py-1 px-2">
              {product.images.map((image, index) => (
                <div
                  key={index}
                  className={`w-8 h-8 rounded-full overflow-hidden border-2 flex-shrink-0 transition-all duration-200 cursor-pointer ${index === currentImageIndex ? 'border-white' : 'border-transparent'
                    }`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <img
                    src={image.image_url}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/default-image.png';
                    }}
                  />
                </div>
              ))}
            </div>
          </>
        )}

        {/* Condition Badge */}
        <div className="absolute top-2 left-2">
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${product.condition === "new"
              ? "bg-success text-white"
              : product.condition === "like-new"
                ? "bg-brand-primary text-white"
                : product.condition === "good"
                  ? "bg-warning text-white"
                  : "bg-neutral-500 text-white"
              }`}
          >
            {product.condition === "like-new"
              ? "Like New"
              : product.condition
                ? product.condition.charAt(0).toUpperCase() + product.condition.slice(1)
                : "New"}
          </span>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${isSaved
            ? "bg-save text-white"
            : "bg-black/20 hover:bg-black/40 text-white"
            }`}
        >
          <Bookmark className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
        </button>
      </div>

      {/* Product Info */}
      <div className="p-2">
        {/* Title and Price */}
        <div className="mb-2">
          <h3 className="font-semibold text-neutral-800 line-clamp-2 text-sm md:text-base">
            {product.name}
          </h3>
          <div className="flex items-center gap-2 ">
            <span className="text-lg font-bold text-neutral-800">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-neutral-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </div>

        {/* Seller Info */}
        <div className="flex items-center gap-2 mb-3">
          <img
            src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
              product?.user?.full_name
            )}`}
            alt={product.user?.full_name}
            className="w-6 h-6 rounded-full"
          />

          <span className="text-sm text-neutral-600 font-medium">
            {product.user?.full_name}
          </span>
          {product.user?.isVerified && (
            <div className="w-4 h-4 bg-brand-primary rounded-full flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
          )}
          {/* <div className="flex items-center gap-1 text-xs text-neutral-500">
            <Star className="w-3 h-3 fill-current text-warning" />
            {product.user?.trustScore}
          </div> */}
        </div>

        {/* Location and Time */}
        <div className="flex items-center justify-between text-xs text-neutral-500 mb-3">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {product.location}
          </div>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {new Date(product.created_at).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>

        {/* Social Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 text-xs ${isLiked
                ? "text-like"
                : "text-neutral-500 hover:text-neutral-700"
                }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
              {likes}
            </button>

            <div className="flex items-center gap-1 text-xs text-neutral-500">
              <Eye className="w-4 h-4" />
              {product.analytics?.views_count}
            </div>

            <button
              onClick={handleComments}
              className="flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-700"
            >
              <MessageCircle className="w-4 h-4" />
              {commentCount}
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-700"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleMessage}
            className="btn-brand text-xs px-3 py-1.5"
          >
            Message
          </button>
        </div>
      </div>

      {/* Comments Modal */}
      <CommentsModal
        isOpen={showComments}
        onClose={() => setShowComments(false)}
        productId={product.id.toString()}
        productTitle={product.name}
        onCommentAdded={() => {
          setCommentCount(prev => prev + 1);
        }}
      />

      {showMessageModal && (
        <MessageModal
          isOpen={showMessageModal}
          onClose={() => setShowMessageModal(false)}
          productId={product.id.toString()}
          recipientId={product.user.id}
          recipientName={product.user.full_name}
          productName={product.name}
        />
      )}
    </Link>
  );
};
