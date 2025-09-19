import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Search,
  Heart,
  MessageCircle,
  Bell,
  User,
  Menu,
  X,
  UserCircleIcon,
  LogOut,
} from "lucide-react";
import full_logo from "../assets/full_logo.png";
import { Button } from "./ui/button";
import logo from "../assets/logo.png";
import { useAuth } from "../server/AuthContext";

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { auth, user, logout } = useAuth();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const isActive = (path) => location.pathname === path;

  // The single handler for navigating to profile or login
  const handleProfileClick = () => {
    if (auth.isAuthenticated) {
      setShowProfileDropdown(!showProfileDropdown);
    } else {
      navigate("/login");
    }
  };

  const handleLogout = () => {
    logout();
    setShowProfileDropdown(false);
    navigate("/");
  };

  const handleProfileNavigation = () => {
    navigate("/profile");
    setShowProfileDropdown(false);
  };

  const navigation = [
    {
      name: "Feed",
      href: "/feed",
      icon: Search,
      active: isActive("/feed") || isActive("/"),
    },
    {
      name: "Messages",
      href: "/messages",
      icon: MessageCircle,
      active: isActive("/messages"),
    },
    { name: "Saved", href: "/saved", icon: Heart, active: isActive("/saved") },
    {
      name: "Notifications",
      href: "/notifications",
      icon: Bell,
      active: isActive("/notifications"),
    },
    // The Profile item is handled by the onClick handler
    {
      name: "Profile",
      href: "#", // Use a placeholder link to avoid a default route
      icon: User,
      active: isActive("/profile") || isActive("/login"), // Check both
    },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="hidden sm:block">
              <img src={full_logo} alt="Swaposell Full Logo" className="h-14" />
            </span>
            <span className="block sm:hidden">
              <img src={full_logo} alt="Swaposell Logo" className="h-14" />
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search products, categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-primary pl-10 pr-4"
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              if (item.name === "Profile") {
                return (
                  <div key={item.name} className="relative">
                    <button
                      onClick={handleProfileClick}
                      className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        item.active
                          ? "text-brand-primary bg-brand-secondary"
                          : "text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100"
                      }`}
                    >
                      <User className="w-4 h-4 mr-2" />
                      {user?.first_name || 'Profile'}
                    </button>
                    
                    {showProfileDropdown && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                        <button
                          onClick={handleProfileNavigation}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          My Profile
                        </button>
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                );
              } else {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.name}
                    onClick={() => navigate(item.href)}
                    className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      item.active
                        ? "text-brand-primary bg-brand-secondary"
                        : "text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100"
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </Button>
                );
              }
            })}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              className="p-2 rounded-lg text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100"
              onClick={() => setOpenSearch(!openSearch)}
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              className="p-2 rounded-lg text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100 relative"
              onClick={handleProfileClick}
            >
              <UserCircleIcon className="w-6 h-6" />
              {!user && (
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-green-500 ring-2 ring-white"></span>
              )}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {openSearch && (
          <div className="md:hidden pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-primary pl-10 pr-4"
              />
            </div>
          </div>
        )}
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-neutral-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              // Use conditional rendering for the Profile link
              if (item.name === "Profile") {
                return (
                  <button
                    key={item.name}
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleProfileClick();
                    }}
                    className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      item.active
                        ? "text-brand-primary bg-brand-secondary"
                        : "text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100"
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-3" />
                    {item.name}
                  </button>
                );
              } else {
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      item.active
                        ? "text-brand-primary bg-brand-secondary"
                        : "text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100"
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-3" />
                    {item.name}
                  </Link>
                );
              }
            })}
          </div>
        </div>
      )}
    </nav>
  );
};