// AuthContext.tsx
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import Server from "@/server/Server";
import {
  startConversation,
  sendMessage as sendMessageApi,
  getConversationMessages as getConversationMessagesApi,
  getUserConversations as getUserConversationsApi
} from "@/server/api";

// Types for Auth
export interface User {
  id: number;
  username: string;
  email: string;
  name: string;
  avatar?: string;
  is_verified?: boolean;
  isVerified?: boolean; // For backward compatibility
}

interface AuthState {
  user: User | null;
  access: string | null;
  refresh: string | null;
  isAuthenticated: boolean;
}

// Types for Messaging
type Message = {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  status?: 'sending' | 'sent' | 'failed';
};

type Conversation = {
  id: string;
  product_id: string;
  product_name: string;
  product_image: string;
  other_user: {
    id: string;
    name: string;
    avatar: string;
  };
  last_message?: Message;
  unread_count: number;
  created_at: string;
};

interface MessagingState {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  messages: Message[];
  loading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  // Auth methods
  setAuth: React.Dispatch<React.SetStateAction<AuthState>>;
  login: (access: string, refresh: string) => void;
  logout: () => void;
  refreshToken: () => Promise<boolean>;

  // Messaging methods
  startNewConversation: (productId: string, recipientId: string) => Promise<Conversation>;
  sendMessage: (conversationId: string, content: string) => Promise<void>;
  loadConversation: (conversationId: string) => Promise<void>;
  loadConversations: () => Promise<void>;

  // Messaging state
  messaging: MessagingState;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Store the current refresh timeout ID
let refreshTimeoutId: NodeJS.Timeout | null = null;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Auth state
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    access: typeof window !== 'undefined' ? localStorage.getItem("access_token") : null,
    refresh: typeof window !== 'undefined' ? localStorage.getItem("refresh_token") : null,
    isAuthenticated: false,
  });

  // Messaging state
  const [messaging, setMessaging] = useState<MessagingState>({
    conversations: [],
    currentConversation: null,
    messages: [],
    loading: false,
    error: null,
  });

  // Function to fetch user data
  const fetchUser = useCallback(async () => {
    if (auth.access) {
      try {
        const userData = await Server.getMe();
        setAuth(prev => ({
          ...prev,
          user: userData,
          isAuthenticated: true
        }));
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        if (error.response?.status === 401) {
          logout();
        }
      }
    }
  }, [auth.access]);

  // On mount → fetch user if token exists
  useEffect(() => {
    if (auth.access && !auth.user) {
      fetchUser();
    }
  }, [auth.access, auth.user, fetchUser]);

  // Login function
  const login = (access: string, refresh: string) => {
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    setAuth(prev => ({
      ...prev,
      access,
      refresh,
      isAuthenticated: true
    }));
  };

  // Logout function
  const logout = () => {
    if (refreshTimeoutId) {
      clearTimeout(refreshTimeoutId);
      refreshTimeoutId = null;
    }

    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setAuth({
      user: null,
      access: null,
      refresh: null,
      isAuthenticated: false
    });
  };

  // Schedule token refresh
  const scheduleTokenRefresh = useCallback((expiresIn: number = 25 * 60 * 1000) => {
    if (refreshTimeoutId) {
      clearTimeout(refreshTimeoutId);
    }

    refreshTimeoutId = setTimeout(async () => {
      try {
        await refreshToken();
      } catch (error) {
        console.error('Failed to refresh token:', error);
        logout();
      }
    }, expiresIn - (5 * 60 * 1000));
  }, [auth.refresh]);

  // Refresh token function
  const refreshToken = useCallback(async (): Promise<boolean> => {
    if (!auth.refresh) return false;

    try {
      const response = await Server.refreshToken(auth.refresh);
      if (response.data.access) {
        const { access, refresh, expires_in } = response.data;

        localStorage.setItem('access_token', access);
        if (refresh) {
          localStorage.setItem('refresh_token', refresh);
        }

        setAuth(prev => ({
          ...prev,
          access,
          refresh: refresh || prev.refresh,
          isAuthenticated: true
        }));

        if (expires_in) {
          scheduleTokenRefresh(expires_in * 1000);
        }

        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      logout();
      return false;
    }
  }, [auth.refresh]);

  // Set up token refresh when tokens change
  useEffect(() => {
    if (!auth.access || !auth.refresh) {
      return;
    }

    const getTokenExpiration = (token: string): number | null => {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(window.atob(base64));
        return payload.exp * 1000;
      } catch (e) {
        console.error('Error decoding token:', e);
        return null;
      }
    };

    const tokenExp = getTokenExpiration(auth.access);
    const now = Date.now();
    const shouldRefresh = tokenExp && (tokenExp - now) < (5 * 60 * 1000);

    if (shouldRefresh) {
      const refreshTokenIfNeeded = async () => {
        try {
          await refreshToken();
        } catch (error) {
          console.error('Token refresh failed:', error);
        }
      };

      refreshTokenIfNeeded();
    } else if (tokenExp) {
      const timeUntilRefresh = tokenExp - now - (5 * 60 * 1000);

      if (timeUntilRefresh > 0) {
        refreshTimeoutId = setTimeout(() => {
          refreshToken().catch(console.error);
        }, timeUntilRefresh);
      }
    }

    return () => {
      if (refreshTimeoutId) {
        clearTimeout(refreshTimeoutId);
        refreshTimeoutId = null;
      }
    };
  }, [auth.access, auth.refresh, refreshToken]);

  // Messaging functions
  const loadConversations = useCallback(async () => {
    try {
      setMessaging(prev => ({ ...prev, loading: true, error: null }));
      const data = await getUserConversationsApi();
      setMessaging(prev => ({
        ...prev,
        conversations: Array.isArray(data) ? data : [], // Ensure it's an array
        loading: false
      }));
    } catch (err) {
      console.error('Error loading conversations:', err);
      const errorMessage = err.response?.data?.message || 'Failed to load conversations';
      setMessaging(prev => ({
        ...prev,
        error: errorMessage,
        conversations: [], // Reset to empty array on error
        loading: false
      }));
    }
  }, []);

  const loadConversation = useCallback(async (conversationId: string) => {
    if (!conversationId) {
      console.error('No conversation ID provided');
      return;
    }
  
    try {
      setMessaging(prev => ({ ...prev, loading: true, error: null }));
      const messages = await getConversationMessagesApi(conversationId);
      const conversation = messaging.conversations.find(c => c.id === conversationId);
      
      if (!conversation) {
        console.error('Conversation not found in local state');
        return;
      }
  
      setMessaging(prev => ({
        ...prev,
        messages,
        currentConversation: conversation,
        loading: false
      }));
    } catch (err) {
      console.error('Error loading conversation:', err);
      const errorMessage = err.response?.data?.message || 'Failed to load conversation';
      setMessaging(prev => ({ 
        ...prev, 
        error: errorMessage,
        loading: false 
      }));
    }
  }, [messaging.conversations]);

  const startNewConversation = useCallback(async (productId: string, recipientId: string): Promise<Conversation> => {
    try {
      setMessaging(prev => ({ ...prev, loading: true, error: null }));
  
      const response = await startConversation(productId, recipientId);
  
      // The backend wraps the conversation object
      const raw = response.conversation;
  
      if (!raw?.id) {
        throw new Error('Invalid conversation data received from server');
      }
  
      // Map backend shape → frontend shape
      const newConversation: Conversation = {
        id: String(raw.id),
        product_id: "", // backend doesn’t provide yet
        product_name: raw.title || "",
        product_image: "", // backend doesn’t provide yet
        other_user: raw.other_participant
          ? {
              id: String(raw.other_participant.id),
              name: raw.other_participant.first_name || raw.other_participant.username,
              avatar: raw.other_participant.avatar || "",
            }
          : {
              id: "",
              name: "Unknown",
              avatar: "",
            },
        last_message: raw.last_message || undefined,
        unread_count: raw.unread_count ?? 0,
        created_at: raw.created_at,
      };
  
      // Update conversations list
      setMessaging(prev => ({
        ...prev,
        conversations: [newConversation, ...prev.conversations],
        currentConversation: newConversation,
      }));
  
      return newConversation;
    } catch (err: any) {
      console.error('Error in startNewConversation:', err);
      const errorMessage = err.response?.data?.message || 'Failed to start conversation';
      setMessaging(prev => ({ ...prev, error: errorMessage }));
      throw new Error(errorMessage);
    } finally {
      setMessaging(prev => ({ ...prev, loading: false }));
    }
  }, []);
  



  const sendMessage = useCallback(async (conversationId: string, content: string) => {
    try {
      const newMessage = await sendMessageApi(conversationId, content);

      setMessaging(prev => ({
        ...prev,
        messages: [...prev.messages, newMessage],
        conversations: prev.conversations.map(conv =>
          conv.id === conversationId
            ? { ...conv, last_message: newMessage }
            : conv
        )
      }));
    } catch (err) {
      setMessaging(prev => ({ ...prev, error: 'Failed to send message' }));
      console.error(err);
      throw err;
    }
  }, []);

  // Load conversations when user is authenticated
  useEffect(() => {
    if (auth.isAuthenticated) {
      loadConversations();
    }
  }, [auth.isAuthenticated, loadConversations]);

  const value = {
    // Auth state
    ...auth,
    // Auth methods
    setAuth,
    login,
    logout,
    refreshToken,
    // Messaging methods
    startNewConversation,
    sendMessage,
    loadConversation,
    loadConversations,
    // Messaging state
    messaging: {
      conversations: [],
      currentConversation: null,
      messages: [],
      loading: false,
      error: null
    },
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};