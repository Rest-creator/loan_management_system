import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  MapPin,
  Calendar,
  Star,
  Package,
  Heart,
  MessageCircle,
  Settings,
  Shield,
  PlusCircle,
  Phone,
  RefreshCw,
  Edit3,
  Trash2,
} from "lucide-react";
import { ProductCard } from "../components/ProductCard";
import { UploadProduct } from "./UploadProduct";
import { useAuth } from "../server/AuthContext";
import Server from "../server/Server";

export const Profile: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const { auth } = useAuth();
  const user = auth.user;

  const [activeTab, setActiveTab] = useState<"listings" | "saved" | "reviews">(
    "listings"
  );
  const [uploadProduct, setUploadProduct] = useState(false);
  const [userProducts, setUserProducts] = useState([]);
  const [savedProducts, setSavedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);

  // Check if this is the current user's profile
  const isOwnProfile = !id || id === user?.id?.toString();

  // Fetch user products and saved products
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        // Fetch user's products
        const userProductsResponse = await Server.fetchUserProducts();
        if (userProductsResponse.data.success) {
          setUserProducts(userProductsResponse.data.products || []);
        }

        // Fetch saved products if it's own profile
        if (isOwnProfile) {
          const savedProductsResponse = await Server.fetchSavedProducts();
          if (savedProductsResponse.data.success) {
            setSavedProducts(savedProductsResponse.data.products || []);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, id, isOwnProfile]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-neutral-600">
        <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
        Loading profile...
      </div>
    );
  }

  const formatJoinDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  const tabs = [
    {
      key: "listings",
      label: `Listings (${userProducts.length})`,
      icon: Package,
    },
    { key: "saved", label: `Saved (${savedProducts.length})`, icon: Heart },
    { key: "reviews", label: `Reviews (${user.totalReviews || 0})`, icon: Star },
  ];

  const handleProductAction = (
    productId: string,
    action: "like" | "save" | "message"
  ) => {
    console.log(`${action} product ${productId}`);
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setUploadProduct(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const response = await Server.deleteProduct(parseInt(productId));
      if (response.data.success) {
        setUserProducts(userProducts.filter(p => p.id !== parseInt(productId)));
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const refreshProducts = async () => {
    try {
      const userProductsResponse = await Server.fetchUserProducts();
      if (userProductsResponse.data.success) {
        setUserProducts(userProductsResponse.data.products || []);
      }
    } catch (error) {
      console.error('Error refreshing products:', error);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Profile Header */}
        <div className="card-elevated p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Avatar and Basic Info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="relative">
                <img
                  src={
                    user.avatar ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user.first_name + " " + user.last_name || "User"
                    )}&background=random&color=fff&size=128`
                  }
                  alt={user.username}
                  className="w-24 h-24 rounded-full object-cover"
                />
                {user.isOnline && (
                  <div className="status-online absolute -bottom-1 -right-1 w-6 h-6 border-4 border-white rounded-full bg-green-500" />
                )}
              </div>
              <div className="text-center sm:text-left">
                <div className="flex items-center gap-2 justify-center sm:justify-start mb-2">
                  <h1 className="text-2xl font-bold text-neutral-800">
                    {user.first_name} {user.last_name}
                  </h1>
                  {user.isVerified && (
                    <div className="flex items-center gap-1 verified-badge">
                      <Shield className="w-3 h-3" />
                      Verified
                    </div>
                  )}
                </div>

                <p className="text-neutral-600 mb-1">@{user.email}</p>
                <p className="text-neutral-600 mb-1">{user.phone_number}</p>

                {user.bio && (
                  <p className="text-neutral-700 mb-3 max-w-md">{user.bio}</p>
                )}

                <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-600">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {user.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Joined {formatJoinDate(user.joinDate)}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex-1 sm:ml-auto">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-neutral-800">
                    {user.totalSales || 0}
                  </div>
                  <div className="text-sm text-neutral-600">Sales</div>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1">
                    <Star className="w-5 h-5 fill-current text-warning" />
                    <span className="text-2xl font-bold text-neutral-800">
                      {user.trustScore || 0}
                    </span>
                  </div>
                  <div className="text-sm text-neutral-600">Rating</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-neutral-800">
                    {user.totalReviews || 0}
                  </div>
                  <div className="text-sm text-neutral-600">Reviews</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-4">
                {user ? (
                  <div>
                    <button className="btn-neutral flex items-center w-full gap-2 flex-1">
                      <Settings className="w-4 h-4" />
                      Edit Profile
                    </button>
                    <button
                      className="btn-neutral flex items-center gap-2 flex-1"
                      onClick={() => setUploadProduct(true)}
                    >
                      <PlusCircle className="w-4 h-4" />
                      Add Product
                    </button>
                  </div>
                ) : (
                  <>
                    <button className="btn-brand flex items-center gap-2 flex-1">
                      <MessageCircle className="w-4 h-4" />
                      Message
                    </button>
                    <button className="btn-neutral px-4">
                      <Heart className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="card-elevated">
          {/* Tab Navigation */}
          <div className="border-b border-neutral-200">
            <div className="flex">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-200 ${
                      activeTab === tab.key
                        ? "text-brand-primary border-b-2 border-brand-primary bg-brand-secondary/50"
                        : "text-neutral-600 hover:text-neutral-800 hover:bg-neutral-50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Listings Tab */}
            {activeTab === "listings" && (
              <div>
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <RefreshCw className="w-6 h-6 animate-spin text-neutral-400" />
                    <span className="ml-2 text-neutral-600">Loading products...</span>
                  </div>
                ) : userProducts && userProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userProducts.map((product) => (
                      <div key={product.id} className="relative">
                        <ProductCard
                          product={product}
                          onLike={(id) => handleProductAction(id, "like")}
                          onSave={(id) => handleProductAction(id, "save")}
                          onMessage={(id) => handleProductAction(id, "message")}
                        />
                        {isOwnProfile && (
                          <div className="absolute top-2 right-2 flex gap-1">
                            <button
                              onClick={() => handleEditProduct(product)}
                              className="p-1.5 bg-white/90 hover:bg-white rounded-full shadow-sm transition-all duration-200"
                              title="Edit product"
                            >
                              <Edit3 className="w-4 h-4 text-neutral-600" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id.toString())}
                              className="p-1.5 bg-white/90 hover:bg-red-50 rounded-full shadow-sm transition-all duration-200"
                              title="Delete product"
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  !uploadProduct && (
                    <div className="text-center py-12">
                      <Package className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-neutral-800 mb-2">
                        {isOwnProfile
                          ? "You haven't listed anything yet"
                          : "No listings yet"}
                      </h3>
                      <p className="text-neutral-600">
                        {isOwnProfile
                          ? "Start selling by creating your first listing!"
                          : `${user.first_name} hasn't posted any products yet.`}
                      </p>
                      {isOwnProfile && (
                        <button
                          className="btn-brand mt-4"
                          onClick={() => setUploadProduct(true)}
                        >
                          Create Listing
                        </button>
                      )}
                    </div>
                  )
                )}
              </div>
            )}

            {/* Saved Tab */}
            {activeTab === "saved" && (
              <div>
                {user ? (
                  savedProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {savedProducts.map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          onLike={(id) => handleProductAction(id, "like")}
                          onSave={(id) => handleProductAction(id, "save")}
                          onMessage={(id) => handleProductAction(id, "message")}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Heart className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-neutral-800 mb-2">
                        No saved products yet
                      </h3>
                      <p className="text-neutral-600">
                        Save products you're interested in to view them here
                        later.
                      </p>
                    </div>
                  )
                ) : (
                  <div className="text-center py-12">
                    <Heart className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-neutral-800 mb-2">
                      Private collection
                    </h3>
                    <p className="text-neutral-600">
                      This user's saved products are private.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === "reviews" && (
              <div className="space-y-4">
                {/* Placeholder reviews */}
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="border border-neutral-200 rounded-lg p-4"
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={`https://images.unsplash.com/photo-${
                          1500000000000 + i * 1000000
                        }?w=40&h=40&fit=crop&crop=face`}
                        alt="Reviewer"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-neutral-800">
                            Reviewer {i}
                          </span>
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className="w-4 h-4 fill-current text-warning"
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-neutral-700 text-sm">
                          Great seller! Fast shipping and exactly as described.
                          Would definitely buy again.
                        </p>
                        <p className="text-neutral-500 text-xs mt-2">
                          2 weeks ago • iPhone 14 Pro Max
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {user.totalReviews === 0 && (
                  <div className="text-center py-12">
                    <Star className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-neutral-800 mb-2">
                      No reviews yet
                    </h3>
                    <p className="text-neutral-600">
                      {isOwnProfile
                        ? "Complete your first sale to start getting reviews!"
                        : `${user.name} hasn't received any reviews yet.`}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Upload product */}
            {uploadProduct && (
              <div className="space-y-2">
                <UploadProduct 
                  back={() => {
                    setUploadProduct(false);
                    setEditingProduct(null);
                  }}
                  editingProduct={editingProduct}
                  onProductSaved={refreshProducts}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
