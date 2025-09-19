import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Heart, Bookmark, Share2, Flag, Eye, MessageCircle, MapPin, Calendar, Package, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ProductCard } from '../components/ProductCard';
import { SellerCard } from '../components/SellerCard';
import { CommentCard } from '../components/CommentCard';
import { sampleProducts, sampleComments, sampleUsers } from '../data/dummyData';
import type { Comment } from '../data/dummyData';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState(sampleComments);

  // Find the product (in a real app, this would be an API call)
  const product = sampleProducts.find(p => p.id === id);
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-800 mb-2">Product not found</h2>
          <Link to="/feed" className="text-brand-primary hover:underline">
            Back to feed
          </Link>
        </div>
      </div>
    );
  }

  // Related products (products from same seller or category)
  const relatedProducts = sampleProducts
    .filter(p => p.id !== product.id && (p.seller.id === product.seller.id || p.category === product.category))
    .slice(0, 4);

  const [isLiked, setIsLiked] = useState(product.isLiked);
  const [isSaved, setIsSaved] = useState(product.isSaved);
  const [likes, setLikes] = useState(product.likes);
  const [saves, setSaves] = useState(product.saves);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return date.toLocaleDateString();
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    setSaves(prev => isSaved ? prev - 1 : prev + 1);
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: `comment-${Date.now()}`,
        user: sampleUsers[0], // Current user
        content: newComment.trim(),
        timestamp: new Date().toISOString(),
        likes: 0,
        isLiked: false,
      };
      setComments(prev => [comment, ...prev]);
      setNewComment('');
    }
  };

  const handleCommentLike = (commentId: string) => {
    setComments(prev => prev.map(comment =>
      comment.id === commentId
        ? { ...comment, isLiked: !comment.isLiked, likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1 }
        : comment
    ));
  };

  const handleShare = async () => {
    const shareData = {
      title: product.title,
      text: `Check out this ${product.condition} ${product.category.toLowerCase()} for ${formatPrice(product.price)}`,
      url: window.location.href,
    };

    // Check if navigator.share is available (mobile browsers)
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Share cancelled or failed:', error);
      }
    } else {
      // Fallback: copy to clipboard for desktop
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied!",
          description: "Product link has been copied to your clipboard.",
          duration: 3000,
        });
      } catch (error) {
        console.error('Failed to copy link:', error);
        toast({
          title: "Share failed",
          description: "Unable to copy link. Please try again.",
          variant: "destructive",
          duration: 3000,
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-16 z-40 bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <Link
              to="/feed"
              className="flex items-center gap-2 text-neutral-600 hover:text-neutral-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </Link>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={handleShare}
                className="p-2 text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100 rounded-lg transition-all"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <button className="p-2 text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100 rounded-lg transition-all">
                <Flag className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="card-elevated overflow-hidden">
              <div className="aspect-square bg-neutral-100 relative">
                <img
                  src={product.images[currentImageIndex]}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
                
                {/* Image Navigation */}
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImageIndex(prev => 
                        prev === 0 ? product.images.length - 1 : prev - 1
                      )}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/20 hover:bg-black/40 text-white rounded-full flex items-center justify-center transition-all"
                    >
                      ←
                    </button>
                    <button
                      onClick={() => setCurrentImageIndex(prev => 
                        prev === product.images.length - 1 ? 0 : prev + 1
                      )}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/20 hover:bg-black/40 text-white rounded-full flex items-center justify-center transition-all"
                    >
                      →
                    </button>
                    
                    {/* Thumbnail Navigation */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                      {product.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                            index === currentImageIndex ? 'border-white' : 'border-white/50'
                          }`}
                        >
                          <img src={image} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="card-elevated p-6">
              {/* Title and Price */}
              <div className="mb-4">
                <h1 className="text-2xl font-bold text-neutral-800 mb-2">
                  {product.title}
                </h1>
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-brand-primary">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-lg text-neutral-500 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                    product.condition === 'new' ? 'bg-success text-white' :
                    product.condition === 'like-new' ? 'bg-brand-primary text-white' :
                    product.condition === 'good' ? 'bg-warning text-white' :
                    'bg-neutral-500 text-white'
                  }`}>
                    {product.condition === 'like-new' ? 'Like New' : 
                     product.condition.charAt(0).toUpperCase() + product.condition.slice(1)}
                  </span>
                </div>
              </div>

              {/* Meta Info */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-neutral-200 mb-4">
                <div className="flex items-center gap-2 text-sm text-neutral-600">
                  <Eye className="w-4 h-4" />
                  {product.views} views
                </div>
                <div className="flex items-center gap-2 text-sm text-neutral-600">
                  <MapPin className="w-4 h-4" />
                  {product.location}
                </div>
                <div className="flex items-center gap-2 text-sm text-neutral-600">
                  <Calendar className="w-4 h-4" />
                  {formatTimeAgo(product.postedAt)}
                </div>
                <div className="flex items-center gap-2 text-sm text-neutral-600">
                  <Package className="w-4 h-4" />
                  {product.category}
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="font-semibold text-neutral-800 mb-2">Description</h3>
                <p className="text-neutral-700 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Specifications */}
              {product.specifications && (
                <div className="mb-6">
                  <h3 className="font-semibold text-neutral-800 mb-2">Specifications</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between p-3 bg-neutral-50 rounded-lg">
                        <span className="text-neutral-600 font-medium">{key}</span>
                        <span className="text-neutral-800">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {product.tags && (
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-sm font-medium bg-neutral-100 text-neutral-700 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-6 border-t border-neutral-200">
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleLike}
                    className={`social-btn ${isLiked ? 'active' : ''}`}
                  >
                    <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                    {likes}
                  </button>
                  
                  <button
                    onClick={handleSave}
                    className={`social-btn ${isSaved ? 'active' : ''}`}
                  >
                    <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                    {saves}
                  </button>
                </div>

                <button className="btn-brand flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Message Seller
                </button>
              </div>
            </div>

            {/* Comments Section */}
            <div className="card-elevated p-6">
              <h3 className="font-semibold text-neutral-800 mb-4">
                Comments ({comments.length})
              </h3>

              {/* Add Comment */}
              <div className="mb-6">
                <div className="flex gap-3">
                  <img
                    src={sampleUsers[0].avatar}
                    alt="Your avatar"
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleAddComment();
                        }
                      }}
                      className="input-primary mb-2"
                    />
                    <button
                      onClick={handleAddComment}
                      disabled={!newComment.trim()}
                      className="btn-brand text-sm disabled:opacity-50"
                    >
                      Post Comment
                    </button>
                  </div>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-6">
                {comments.map((comment) => (
                  <CommentCard
                    key={comment.id}
                    comment={comment}
                    onLike={handleCommentLike}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Seller Card */}
            <SellerCard
              seller={product.seller}
              showFullDetails
              onMessage={() => console.log('Message seller')}
            />

            {/* Related Products */}
            {relatedProducts.length > 0 && (
              <div className="card-elevated p-6">
                <h3 className="font-semibold text-neutral-800 mb-4">
                  Related Products
                </h3>
                <div className="space-y-4">
                  {relatedProducts.map((relatedProduct) => (
                    <Link
                      key={relatedProduct.id}
                      to={`/product/${relatedProduct.id}`}
                      className="flex gap-3 p-3 rounded-lg hover:bg-neutral-50 transition-colors"
                    >
                      <img
                        src={relatedProduct.images[0]}
                        alt={relatedProduct.title}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-neutral-800 line-clamp-2 mb-1">
                          {relatedProduct.title}
                        </h4>
                        <p className="text-sm text-brand-primary font-semibold">
                          {formatPrice(relatedProduct.price)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};