import React, { createContext, useContext, useState, useEffect } from "react";
import Server from "./server";

interface User {
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
}

// ✅ Create the AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchMe = async () => {
    setLoading(true);
    try {
      const res = await Server.fetchMe();
      if (res.data && res.data.role) {
        setUser(res.data);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error("fetchMe error:", err);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await Server.login(email, password);
      if (response.data) {
        await fetchMe();
        return true;
      }
      return false;
    } catch (err) {
      console.error("login error:", err);
      return false;
    }
  };

  const logout = async () => {
    await Server.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    fetchMe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout, fetchMe }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Hook to use AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
