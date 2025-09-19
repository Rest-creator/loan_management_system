import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, X, Plus, MapPin, DollarSign, Package, Camera } from 'lucide-react';
import { categories } from '../data/dummyData';
import Server from '@/server/Server';

interface UploadProductProps {
  back: () => void;
  editingProduct?: any;
  onProductSaved?: () => void;
}

export const UploadProduct: React.FC<UploadProductProps> = ({ back, editingProduct, onProductSaved }) => {
  const navigate = useNavigate();
  const [images, setImages] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    condition: 'new' as 'new' | 'used' | 'refurbished',
    location: '',
    tags: [] as string[],
    newTag: ''
  });

  // Populate form with editing product data
  useEffect(() => {
    if (editingProduct) {
      setFormData({
        title: editingProduct.name || '',
        description: editingProduct.description || '',
        price: editingProduct.price?.toString() || '',
        category: editingProduct.category || '',
        condition: 'new',
        location: editingProduct.location || '',
        tags: [],
        newTag: ''
      });
      
      // Set images from product images
      if (editingProduct.product_images) {
        setImages(editingProduct.product_images.map((img: any) => img.image_url));
      }
    }
  }, [editingProduct]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = () => {
    // Mock image upload - in real app would handle file upload
    const mockImageUrls = [
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop'
    ];
    
    if (images.length < 5) {
      const randomImage = mockImageUrls[Math.floor(Math.random() * mockImageUrls.length)];
      setImages(prev => [...prev, randomImage]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (formData.newTag.trim() && !formData.tags.includes(formData.newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, prev.newTag.trim()],
        newTag: ''
      }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Map frontend formData to backend payload
    const payload = {
      name: formData.title,                // frontend title → backend name
      description: formData.description,
      price: parseFloat(formData.price),   // ensure numeric
      category: formData.category,
      location: formData.location,
      listing_type: "product",             // always product
      unit: "unit",                         // or get from another input if needed
      images_urls: images                   // include image URLs
    };

    try {
      let response;
      if (editingProduct) {
        // Update existing product
        response = await Server.updateProduct(editingProduct.id, payload);
        console.log("Product updated:", response);
      } else {
        // Create new product
        response = await Server.addProduct(payload, images); 
        console.log("Product uploaded:", response);
      }
      
      // Call the callback to refresh products list
      if (onProductSaved) {
        await onProductSaved();
      }
      
      // Go back to profile
      back();
    } catch (err) {
      console.error("Failed to save product:", err);
    }
  };


  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-1 sm:px-6 lg:px-2 py-2">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => back()}
            className="btn-neutral p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-foreground">
            {editingProduct ? 'Edit Product' : 'Upload Product'}
          </h1>
        </div>

        {/* Upload Form */}
        <div className="card-elevated p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Images Upload */}
            <div>
              <label className="text-sm font-medium text-foreground mb-3 block">
                Product Images (Max 5)
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {images.map((image, index) => (
                  <div key={index} className="relative aspect-square">
                    <img
                      src={image}
                      alt={`Product ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center hover:bg-destructive/80"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {images.length < 5 && (
                  <button
                    type="button"
                    onClick={handleImageUpload}
                    className="aspect-square border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-primary/5 transition-colors"
                  >
                    <Camera className="w-6 h-6 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Add Photo</span>
                  </button>
                )}
              </div>
            </div>

            {/* Basic Information */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Product Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="What are you selling?"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                placeholder="Describe your product, its condition, and any important details..."
                required
              />
            </div>

            {/* Price and Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                  <DollarSign className="w-4 h-4" />
                  Price *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                  <Package className="w-4 h-4" />
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category} value={category.toLowerCase()}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Condition and Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Condition *
                </label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                >
                  <option value="new">New</option>
                  <option value="used">Used</option>
                  <option value="refurbished">Refurbished</option>
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                  <MapPin className="w-4 h-4" />
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="City, Country"
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Tags (Optional)
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:bg-primary/20 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.newTag}
                  onChange={(e) => setFormData(prev => ({ ...prev, newTag: e.target.value }))}
                  className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Add a tag..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="btn-neutral p-2"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn-neutral flex-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-brand flex-1"
                onClick={(e) => handleSubmit(e)}
              >
                Upload Product
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};