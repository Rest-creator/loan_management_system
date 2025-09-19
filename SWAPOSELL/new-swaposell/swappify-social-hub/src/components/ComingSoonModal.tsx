import React, { useState } from "react";
import { X, Rocket } from "lucide-react";
import full_logo from "../assets/full_logo.png";

interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ComingSoonModal: React.FC<ComingSoonModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Calculate next Monday launch date
  const getNextMonday = () => {
    const today = new Date();
    const nextMonday = new Date(today);
    nextMonday.setDate(
      today.getDate() + ((8 - today.getDay()) % 7 || 7)
    );
    return nextMonday.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  const launchDate = getNextMonday();

  const handlePreRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    console.log("Pre-register email:", email); // 👉 Hook into backend/Google Sheet/API
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-scale-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-100 transition-colors"
        >
          <X className="w-5 h-5 text-neutral-500" />
        </button>

        {/* Content */}
        <div className="text-center">
          {/* Logo */}
          <span className="block mb-4">
            <img
              src={full_logo}
              alt="Swaposell Full Logo"
              className="h-16 mx-auto"
            />
          </span>

          {/* Title */}
          <h2 className="text-2xl font-bold text-neutral-800 mb-2 flex items-center justify-center gap-2">
            {/* <Rocket className="w-6 h-6 text-brand-primary" /> */}
            Swap-O-Sell launches {launchDate} @ UZ 
          </h2>

          {/* Message */}
          <p className="text-neutral-600 mb-6 leading-relaxed">
            Swap-O-Sell is kicking off <b>first at the University of Zimbabwe</b>.  
            Be among the pioneering students to buy, sell, and connect on campus.  
            Secure your spot today and shape the UZ marketplace community.
          </p>

          {!submitted ? (
            <form onSubmit={handlePreRegister} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-brand-primary outline-none"
              />
              <button
                type="submit"
                className="btn-brand w-full py-3 text-base font-semibold"
              >
                Pre-Register Now
              </button>
            </form>
          ) : (
            <div className="text-green-600 font-medium">
              Thanks! You’re officially on the UZ early access list.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
