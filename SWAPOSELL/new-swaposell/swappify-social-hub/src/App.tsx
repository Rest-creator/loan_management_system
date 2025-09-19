import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { ComingSoonModal } from "./components/ComingSoonModal";
import { Home } from "./pages/Home";
import { Feed } from "./pages/Feed";
import { ProductDetail } from "./pages/ProductDetail";
import { Profile } from "./pages/Profile";
import { Messages } from "./pages/Messages";
import { Notifications } from "./pages/Notifications";
import { Search } from "./pages/Search";
import NotFound from "./pages/NotFound";
import { Login } from "./components/auth/Login";
import { AuthProvider } from "./server/AuthContext";
import { InstallPrompt } from "./components/InstallPrompt";
import "./App.css";

const queryClient = new QueryClient();

const App = () => {
  // 

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen bg-background">
              <Navbar />
              <Routes>
                <Route path="/" element={<Feed />} />
                <Route path="/login" element={<Login />} />
                <Route path="/feed" element={<Feed />} />
                <Route path="/search" element={<Search />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/profile/:id?" element={<Profile />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/saved" element={<Profile />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </BrowserRouter>

          {/* Coming Soon Modal */}
          {/* <ComingSoonModal
          isOpen={showComingSoon}
          onClose={() => setShowComingSoon(false)}
        /> */}
          
          {/* PWA Install Prompt */}
          <InstallPrompt />
        </TooltipProvider>
      </QueryClientProvider>
    </AuthProvider>
  );
};

export default App;
