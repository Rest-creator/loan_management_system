import React from 'react';

interface LoadingSkeletonProps {
  type?: 'card' | 'list' | 'profile' | 'text';
  count?: number;
  className?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  type = 'card',
  count = 1,
  className = '',
}) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className={`card-elevated animate-pulse ${className}`}>
            <div className="aspect-square bg-neutral-200 rounded-t-xl skeleton" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-neutral-200 rounded skeleton" />
              <div className="h-4 bg-neutral-200 rounded skeleton w-3/4" />
              <div className="flex justify-between">
                <div className="h-3 bg-neutral-200 rounded skeleton w-1/4" />
                <div className="h-3 bg-neutral-200 rounded skeleton w-1/4" />
              </div>
            </div>
          </div>
        );

      case 'list':
        return (
          <div className={`flex items-center gap-3 p-4 animate-pulse ${className}`}>
            <div className="w-12 h-12 bg-neutral-200 rounded-full skeleton" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-neutral-200 rounded skeleton w-3/4" />
              <div className="h-3 bg-neutral-200 rounded skeleton w-1/2" />
            </div>
          </div>
        );

      case 'profile':
        return (
          <div className={`card-elevated p-6 animate-pulse ${className}`}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-neutral-200 rounded-full skeleton" />
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-neutral-200 rounded skeleton w-1/2" />
                <div className="h-4 bg-neutral-200 rounded skeleton w-3/4" />
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-4 bg-neutral-200 rounded skeleton" />
              <div className="h-4 bg-neutral-200 rounded skeleton w-5/6" />
              <div className="h-4 bg-neutral-200 rounded skeleton w-2/3" />
            </div>
          </div>
        );

      case 'text':
        return (
          <div className={`space-y-2 animate-pulse ${className}`}>
            <div className="h-4 bg-neutral-200 rounded skeleton" />
            <div className="h-4 bg-neutral-200 rounded skeleton w-4/5" />
            <div className="h-4 bg-neutral-200 rounded skeleton w-3/5" />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <div key={index}>{renderSkeleton()}</div>
      ))}
    </>
  );
};