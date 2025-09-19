import Server from "@/server/Server";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RefreshCw } from "lucide-react"; // Example of a loading icon
import { toast } from "sonner";
import { useAuth } from "@/server/AuthContext";

export const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-neutral-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-neutral-800">
          {isLogin ? "Welcome Back!" : "Join Swaposell!"}
        </h2>
        {isLogin ? <LoginForm /> : <SignupForm toggleForm={toggleForm} />}
        <p className="mt-4 text-center text-sm text-neutral-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={toggleForm}
            className="text-brand-primary font-medium hover:underline"
          >
            {isLogin ? "Sign up" : "Log in"}
          </button>
        </p>
      </div>
    </div>
  );
};

const LoginForm: React.FC = () => {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await Server.login(emailOrPhone, password);
      const { access, refresh, user } = response.data.data;
      console.log(response.data.data);

      localStorage.removeItem('access_token')

      // ✅ Store only tokens
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);

      // ✅ Put user in context instead of localStorage
      setAuth({
        user,
        access,
        refresh,
      });

      toast.success("Login successful!", {
        description: "You have been redirected to your profile.",
      });

      navigate("/profile");
    } catch (error) {
      console.error("Login failed:", error);

      if (error.response) {
        const errorMessage =
          error.response.data?.message || "Invalid credentials.";
        toast.error("Login failed.", {
          description: errorMessage,
        });
      } else if (error.request) {
        toast.error("Network error.", {
          description: "No response from server. Please try again.",
        });
      } else {
        toast.error("An unexpected error occurred.", {
          description: "Please try again.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="label-primary">Email or Phone</label>
        <input
          type="text"
          className="input-primary"
          placeholder="Enter your email or phone"
          value={emailOrPhone}
          onChange={(e) => setEmailOrPhone(e.target.value)}
          disabled={isLoading}
        />
      </div>
      <div className="mb-6">
        <label className="label-primary">Password</label>
        <input
          type="password"
          className="input-primary"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />
      </div>
      <button
        type="submit"
        className="bg-primary p-2 rounded-lg text-white w-full flex items-center justify-center"
        disabled={isLoading}
        onClick={handleSubmit}
      >
        {isLoading ? (
          <>
            <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
            Submitting...
          </>
        ) : (
          "Log In"
        )}
      </button>
    </form>
  );
};

const SignupForm = ({ toggleForm }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (password !== confirmPassword) {
      toast.error("Password mismatch!", {
        description: "Please make sure your passwords match.",
      });
      setIsLoading(false);
      return;
    }

    // You must send either email or phone, not both in a single field
    const signupData = {
      name: fullName,
      email: email || "", // optional
      phone: phone || "", // optional
      password: password,
      confirm_password: confirmPassword,
      location: location,
    };

    // Add email or phone to the data payload based on which one is filled out
    if (!email && !phone) {
      toast.error("Please enter either an email or a phone number.");
      setIsLoading(false);
      return;
    }

    try {
      // The API call should now use the correct data payload
      const response = await Server.signup(signupData);

      console.log("Signup successful:", response.data);

      toast.success("Signup successful!", {
        description: "You can now log in with your new account.",
      });

      toggleForm();
    } catch (error) {
      console.error("Signup failed:", error);
      if (error.response && error.response.data) {
        const errorData = error.response.data;
        if (errorData.confirm_password) {
          toast.error("Signup failed.", {
            description: `Password confirmation: ${errorData.confirm_password[0]}`,
          });
        } else if (errorData.detail) {
          toast.error("Signup failed.", {
            description: errorData.detail,
          });
        } else {
          // Handle other potential errors like 'name', 'email', 'phone', 'location', or 'password'
          const firstError = Object.values(errorData)[0];
          toast.error("Signup failed.", {
            description:
              firstError || "An unexpected error occurred during signup.",
          });
        }
      } else {
        toast.error("Network error.", {
          description: "No response from server. Please try again.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="label-primary">Full Name</label>
        <input
          type="text"
          className="input-primary"
          placeholder="Enter your name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          disabled={isLoading}
          required
        />
      </div>
      <div className="mb-4">
        <label className="label-primary">Email</label>
        <input
          type="email"
          className="input-primary"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />
      </div>
      <div className="mb-4">
        <label className="label-primary">Phone</label>
        <input
          type="tel"
          className="input-primary"
          placeholder="Enter your phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          disabled={isLoading}
        />
      </div>
      <div className="mb-4">
        <label className="label-primary">Selling Location</label>
        <input
          type="text"
          className="input-primary"
          placeholder="Enter your location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          disabled={isLoading}
          required
        />
      </div>
      <div className="mb-4">
        <label className="label-primary">Password</label>
        <input
          type="password"
          className="input-primary"
          placeholder="Create a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          required
        />
      </div>
      <div className="mb-6">
        <label className="label-primary">Confirm Password</label>
        <input
          type="password"
          className="input-primary"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={isLoading}
          required
        />
      </div>
      <button
        type="submit"
        onClick={handleSubmit}
        className="bg-primary p-2 rounded-lg text-white w-full flex items-center justify-center"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
            Submitting...
          </>
        ) : (
          "Sign Up"
        )}
      </button>
    </form>
  );
};
