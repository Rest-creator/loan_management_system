import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  TrendingUp,
  Users,
  Shield,
  Zap,
  Star,
  ArrowRight,
  RefreshCw,
  Share2,
} from "lucide-react";
import { ProductCard } from "../components/ProductCard";
// import { sampleProducts, sampleUsers } from "../data/dummyData";
import Server from "../server/Server";
import { useAuth } from "../server/AuthContext";

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fallback to sample data
  // const featuredProducts = sampleProducts.slice(0, 8);
  // const topSellers = sampleUsers.slice(0, 4);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await Server.fetchProducts();
        console.log(response.data);
        
        if (response.data.count > 0) {
          setProducts(response.data.results.products || []);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products');
        // Use sample data as fallback
        // setProducts(featuredProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleLike = async (productId: string) => {
    if (!auth.user) {
      navigate('/login');
      return;
    }

    try {
      const response = await Server.likeProduct(parseInt(productId));
      if (response.data.success) {
        // Update product in state
        setProducts(products.map(p => 
          p.id === parseInt(productId) 
            ? { ...p, is_liked: !p.is_liked, likes_count: p.is_liked ? p.likes_count - 1 : p.likes_count + 1 }
            : p
        ));
      }
    } catch (error) {
      console.error('Error liking product:', error);
    }
  };

  const handleSave = async (productId: string) => {
    if (!auth.user) {
      navigate('/login');
      return;
    }

    try {
      const response = await Server.saveProduct(parseInt(productId));
      if (response.data.success) {
        // Update product in state
        setProducts(products.map(p => 
          p.id === parseInt(productId) 
            ? { ...p, is_saved: !p.is_saved, saves_count: p.is_saved ? p.saves_count - 1 : p.saves_count + 1 }
            : p
        ));
      }
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleMessage = (sellerId: string) => {
    if (!auth.user) {
      navigate('/login');
      return;
    }
    navigate("/messages");
  };

  const handleShare = async (productId: string) => {
    try {
      const product = products.find(p => p.id === parseInt(productId));
      if (product) {
        const shareData = {
          title: product.name,
          text: `Check out this ${product.name} on SWAPOSELL!`,
          url: `${window.location.origin}/product/${productId}`
        };

        if (navigator.share) {
          await navigator.share(shareData);
        } else {
          // Fallback: copy to clipboard
          await navigator.clipboard.writeText(shareData.url);
          alert('Link copied to clipboard!');
        }

        // Track share
        await Server.trackProductView(parseInt(productId), 'share');
      }
    } catch (error) {
      console.error('Error sharing product:', error);
    }
  };

  const handleProductView = async (productId: string) => {
    try {
      await Server.trackProductView(parseInt(productId), 'view');
      navigate(`/product/${productId}`);
    } catch (error) {
      console.error('Error tracking view:', error);
      navigate(`/product/${productId}`);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Featured Products */}
      <section className="py-6 bg-white">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          {loading ? (
            <div className="col-span-full flex items-center justify-center py-12">
              <RefreshCw className="w-6 h-6 animate-spin text-neutral-400" />
              <span className="ml-2 text-neutral-600">Loading products...</span>
            </div>
          ) : error ? (
            <div className="col-span-full text-center py-12">
              <p className="text-red-500 mb-4">{error}</p>
              <p className="text-neutral-600">Showing sample products instead</p>
            </div>
          ) : null}
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.length > 0 && products.map((product) => (
              <div key={product.id} onClick={() => handleProductView(product.id.toString())}>
                <ProductCard
                  product={product}
                  onLike={handleLike}
                  onSave={handleSave}
                  onMessage={handleMessage}
                  onShare={handleShare}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-neutral-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">S</span>
                </div>
                <span className="text-xl font-bold text-white">Swaposell</span>
              </div>
              <p className="text-neutral-400 mb-4 max-w-md">
                Swaposell is a product of{" "}
                <span className="font-semibold text-white">
                  RESTK Solutions (PVT) Ltd
                </span>
                in partnership with{" "}
                <span className="font-semibold text-white">ZCHPC</span>. The
                social marketplace where community and commerce come together.
                Buy, sell, and discover with confidence. Visit us at:{" "}
                <a
                  href="https://swaposell.zchpc.ac.zw"
                  className="text-white underline"
                >
                  swaposell.zchpc.ac.zw
                </a>
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Press
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Support</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Safety
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-neutral-700 mt-8 pt-8 text-center">
            <p className="text-neutral-400 text-sm">
              © 2025 RESTK Solutions (PVT) Ltd. All rights reserved. Swaposell
              is proudly built in partnership with{" "}
              <span className="font-semibold text-white">ZCHPC</span> ❤️ Visit
              us at:{" "}
              <a
                href="https://swaposell.zchpc.ac.zw"
                className="text-white underline"
              >
                swaposell.zchpc.ac.zw
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
