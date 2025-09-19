import React, { useState, useEffect } from 'react';
import { Filter, TrendingUp, Sparkles } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { sampleProducts, categories } from '../data/dummyData';
import type { Product } from '../data/dummyData';
import Server from '@/server/Server';

export const Feed: React.FC = () => {
  const [products, setProducts] = useState([]);
  const [activeFilter, setActiveFilter] = useState<'trending' | 'recent' | 'recommended'>('trending');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isLoading, setIsLoading] = useState(false);

  // Simulate loading more products (infinite scroll)
  const loadMoreProducts = () => {
    setIsLoading(true);
    // Simulate API delay
    setTimeout(() => {
      // In a real app, this would fetch more products
      setProducts(prev => [...prev, ...products?.slice(0, 3)]);
      setIsLoading(false);
    }, 1000);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await Server.fetchProducts();
        console.log(response.data);
        
        if (response.data.count > 0) {
          setProducts(response.data.results.products || []);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        // setError('Failed to load products');
        // Use sample data as fallback
        // setProducts(featuredProducts);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on active filters
  const filteredProducts = products?.filter(product => {
    if (selectedCategory !== 'All' && product.category !== selectedCategory) {
      return false;
    }
    return true;
  }).sort((a, b) => {
    switch (activeFilter) {
      case 'trending':
        return (b.likes + b.views + b.saves) - (a.likes + a.views + a.saves);
      case 'recent':
        return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime();
      case 'recommended':
        return b.likes - a.likes;
      default:
        return 0;
    }
  });

  // Handle product interactions
  const handleLike = async (productId: string) => {
    try {
      const response = await Server.likeProduct(parseInt(productId));
      if (response.data.success) {
        setProducts(prev => prev?.map(product =>
          product.id === productId
            ? { 
                ...product, 
                is_liked: response.data.liked, 
                likes_count: response.data.likes_count 
              }
            : product
        ));
      }
    } catch (error) {
      console.error('Error liking product:', error);
    }
  };

  const handleSave = async (productId: string) => {
    try {
      const response = await Server.saveProduct(parseInt(productId));
      if (response.data.success) {
        setProducts(prev => prev?.map(product =>
          product.id === productId
            ? { 
                ...product, 
                is_saved: response.data.saved, 
                saves_count: response.data.saves_count 
              }
            : product
        ));
      }
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleMessage = (sellerId: string) => {
    // In a real app, this would navigate to messages or open a chat
    console.log('Message seller:', sellerId);
  };

  const handleShare = (productId: string) => {
    console.log('Product shared:', productId);
  };

  // Infinite scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 1000
      ) {
        if (!isLoading) {
          loadMoreProducts();
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoading]);

  const filterOptions = [
    { key: 'trending', label: 'Trending', icon: TrendingUp },
    { key: 'recent', label: 'Recent', icon: Sparkles },
    { key: 'recommended', label: 'For You', icon: Filter },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="sticky top-16 z-40 bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter Tabs */}
          <div className="flex items-center justify-between py-4">
            <div className="flex space-x-1">
              {filterOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.key}
                    onClick={() => setActiveFilter(option.key as any)}
                    className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      activeFilter === option.key
                        ? 'text-brand-primary bg-brand-secondary'
                        : 'text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category Filter */}
          <div className="pb-4">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              <button
                onClick={() => setSelectedCategory('All')}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === 'All'
                    ? 'text-white bg-brand-primary'
                    : 'text-neutral-600 bg-neutral-100 hover:bg-neutral-200'
                }`}
              >
                All
              </button>
              {categories?.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category
                      ? 'text-white bg-brand-primary'
                      : 'text-neutral-600 bg-neutral-100 hover:bg-neutral-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Products Feed */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts?.map((product, index) => (
            <ProductCard
              key={`${product.id}-${index}`}
              product={product}
              onLike={handleLike}
              onSave={handleSave}
              onMessage={handleMessage}
              onShare={handleShare}
              className="animate-fade-in"
            />
          ))}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="card-elevated animate-pulse">
                <div className="aspect-square bg-neutral-200 rounded-t-xl" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-neutral-200 rounded skeleton" />
                  <div className="h-4 bg-neutral-200 rounded skeleton w-3/4" />
                  <div className="flex justify-between">
                    <div className="h-3 bg-neutral-200 rounded skeleton w-1/4" />
                    <div className="h-3 bg-neutral-200 rounded skeleton w-1/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredProducts?.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-neutral-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Filter className="w-8 h-8 text-neutral-400" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-800 mb-2">
              No products found
            </h3>
            <p className="text-neutral-600">
              Try adjusting your filters or check back later for new listings.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};