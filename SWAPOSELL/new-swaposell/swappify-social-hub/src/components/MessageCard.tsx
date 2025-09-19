import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Check, CheckCheck } from 'lucide-react';
import type { Message, Product } from '../data/dummyData';

interface MessageCardProps {
  message: Message;
  product?: Product;
  isOwn?: boolean;
  showAvatar?: boolean;
  className?: string;
}

export const MessageCard: React.FC<MessageCardProps> = ({
  message,
  product,
  isOwn = false,
  showAvatar = true,
  className = '',
}) => {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } else if (diffInDays < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className={`flex gap-3 animate-fade-in ${isOwn ? 'flex-row-reverse' : ''} ${className}`}>
      {/* Avatar */}
      {showAvatar && (
        <img
          src={message.sender.avatar}
          alt={message.sender.name}
          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
        />
      )}
      
      {/* Message Content */}
      <div className={`flex flex-col max-w-xs sm:max-w-sm md:max-w-md ${isOwn ? 'items-end' : 'items-start'}`}>
        {/* Message Bubble */}
        <div
          className={`rounded-2xl px-4 py-2 ${
            isOwn
              ? 'bg-brand-primary text-white'
              : 'bg-neutral-100 text-neutral-800'
          }`}
        >
          {/* Product Preview (if attached) */}
          {message.type === 'product' && product && (
            <Link 
              to={`/product/${product.id}`}
              className={`block mb-2 p-2 rounded-lg border transition-colors ${
                isOwn 
                  ? 'border-white/20 hover:border-white/40 bg-white/10' 
                  : 'border-neutral-200 hover:border-neutral-300 bg-white'
              }`}
            >
              <div className="flex gap-2">
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h4 className={`font-medium text-xs line-clamp-1 ${isOwn ? 'text-white' : 'text-neutral-800'}`}>
                    {product.title}
                  </h4>
                  <p className={`text-xs ${isOwn ? 'text-white/80' : 'text-neutral-600'}`}>
                    {formatPrice(product.price)}
                  </p>
                </div>
              </div>
            </Link>
          )}
          
          {/* Message Text */}
          <p className="text-sm leading-relaxed">{message.content}</p>
        </div>
        
        {/* Message Info */}
        <div className={`flex items-center gap-1 mt-1 text-xs text-neutral-500 ${isOwn ? 'flex-row-reverse' : ''}`}>
          <span>{formatTime(message.timestamp)}</span>
          {isOwn && (
            <div className="flex items-center">
              {message.isRead ? (
                <CheckCheck className="w-3 h-3 text-brand-primary" />
              ) : (
                <Check className="w-3 h-3" />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface MessageInputProps {
  onSend: (content: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSend,
  placeholder = 'Type a message...',
  disabled = false,
}) => {
  const [message, setMessage] = React.useState('');

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex gap-2 p-4 border-t border-neutral-200 bg-white">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1 input-primary"
      />
      <button
        onClick={handleSend}
        disabled={!message.trim() || disabled}
        className="btn-brand px-4 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Send
      </button>
    </div>
  );
};