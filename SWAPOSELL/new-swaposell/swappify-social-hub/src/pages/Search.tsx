import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, Filter, X, MapPin, DollarSign, Package } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { sampleProducts, categories } from '../data/dummyData';
import type { Product } from '../data/dummyData';

export const Search: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [selectedCondition, setSelectedCondition] = useState<string>('All');
  const [locationFilter, setLocationFilter] = useState('');
  const [sortBy, setSortBy] = useState<'relevance' | 'price-low' | 'price-high' | 'newest'>('relevance');
  const [showFilters, setShowFilters] = useState(false);

  // Filter and sort products
  const filteredProducts = sampleProducts
    .filter(product => {
      // Search query filter
      if (searchQuery && !product.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !product.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !product.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'All' && product.category !== selectedCategory) {
        return false;
      }

      // Price range filter
      if (product.price < priceRange[0] || product.price > priceRange[1]) {
        return false;
      }

      // Condition filter
      if (selectedCondition !== 'All' && product.condition !== selectedCondition) {
        return false;
      }

      // Location filter
      if (locationFilter && !product.location.toLowerCase().includes(locationFilter.toLowerCase())) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'newest':
          return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime();
        case 'relevance':
        default:
          // Sort by a combination of likes, views, and recency
          const aScore = a.likes + a.views + (new Date(a.postedAt).getTime() / 1000000);
          const bScore = b.likes + b.views + (new Date(b.postedAt).getTime() / 1000000);
          return bScore - aScore;
      }
    });

  const conditions = ['All', 'new', 'like-new', 'good', 'fair'];
  const sortOptions = [
    { value: 'relevance', label: 'Most Relevant' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest First' },
  ];

  const clearFilters = () => {
    setSelectedCategory('All');
    setPriceRange([0, 2000]);
    setSelectedCondition('All');
    setLocationFilter('');
    setSortBy('relevance');
  };

  const hasActiveFilters = selectedCategory !== 'All' || 
                          priceRange[0] !== 0 || 
                          priceRange[1] !== 2000 || 
                          selectedCondition !== 'All' || 
                          locationFilter !== '';

  const handleProductAction = (productId: string, action: 'like' | 'save' | 'message') => {
    console.log(`${action} product ${productId}`);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Search Header */}
      <div className="sticky top-16 z-40 bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Main Search Bar */}
          <div className="flex gap-3 mb-4">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for products, categories, or sellers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-primary pl-11 pr-4 text-lg"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`btn-neutral flex items-center gap-2 ${hasActiveFilters ? 'bg-brand-secondary text-brand-primary' : ''}`}
            >
              <Filter className="w-4 h-4" />
              Filters
              {hasActiveFilters && (
                <span className="w-2 h-2 bg-brand-primary rounded-full" />
              )}
            </button>
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
            <div className="flex gap-2">
              {categories.slice(0, 6).map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`flex-shrink-0 px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-200 ${
                    selectedCategory === category
                      ? 'text-white bg-brand-primary'
                      : 'text-neutral-600 bg-neutral-100 hover:bg-neutral-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            
            <div className="h-6 w-px bg-neutral-200 flex-shrink-0" />
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-sm text-neutral-600 bg-transparent border-none focus:ring-0 cursor-pointer"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <div className="bg-white border-b border-neutral-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  <Package className="w-4 h-4 inline mr-1" />
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="input-primary text-sm"
                >
                  <option value="All">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  <DollarSign className="w-4 h-4 inline mr-1" />
                  Price Range
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    className="input-primary text-sm flex-1"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="input-primary text-sm flex-1"
                  />
                </div>
              </div>

              {/* Condition */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Condition
                </label>
                <select
                  value={selectedCondition}
                  onChange={(e) => setSelectedCondition(e.target.value)}
                  className="input-primary text-sm"
                >
                  {conditions.map((condition) => (
                    <option key={condition} value={condition}>
                      {condition === 'All' ? 'Any Condition' : 
                       condition === 'like-new' ? 'Like New' : 
                       condition.charAt(0).toUpperCase() + condition.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Location
                </label>
                <input
                  type="text"
                  placeholder="City or state..."
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="input-primary text-sm"
                />
              </div>
            </div>

            {/* Filter Actions */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-neutral-100">
              <p className="text-sm text-neutral-600">
                {filteredProducts.length} products found
              </p>
              <div className="flex gap-2">
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="btn-ghost text-sm flex items-center gap-1"
                  >
                    <X className="w-3 h-3" />
                    Clear Filters
                  </button>
                )}
                <button
                  onClick={() => setShowFilters(false)}
                  className="btn-brand text-sm"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-neutral-800">
              {searchQuery ? `Search results for "${searchQuery}"` : 'Browse Products'}
            </h1>
            <p className="text-neutral-600 mt-1">
              {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
            </p>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onLike={(id) => handleProductAction(id, 'like')}
                onSave={(id) => handleProductAction(id, 'save')}
                onMessage={(id) => handleProductAction(id, 'message')}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-neutral-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <SearchIcon className="w-8 h-8 text-neutral-400" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-800 mb-2">
              No products found
            </h3>
            <p className="text-neutral-600 mb-4">
              {searchQuery 
                ? `No results for "${searchQuery}". Try different keywords or adjust your filters.`
                : 'No products match your current filters. Try adjusting them to see more results.'
              }
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="btn-brand"
              >
                Clear All Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};