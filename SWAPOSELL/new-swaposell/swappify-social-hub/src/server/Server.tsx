import axios from "axios";

import { api_url } from "./constants";

const getAuthHeaders = () => {
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

interface UserProfile {
  id: number;
  username: string;
  email: string;
  avatar?: string;
}

interface ProductData {
  id?: number;
  title: string;
  description: string;
  price: number;
  image?: string;
}

interface MessageData {
  receiver_id: number;
  content: string;
}

// Create an axios instance with default config
const api = axios.create({
  baseURL: api_url,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Don't retry if it's a login request or already retried
    if (originalRequest.url?.includes('token/refresh') || 
        originalRequest.url?.includes('signin') || 
        originalRequest.url?.includes('signup') ||
        originalRequest._retry) {
      return Promise.reject(error);
    }
    
    // If the error status is 401 and this isn't a retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          // No refresh token available, redirect to login
          window.location.href = '/login';
          return Promise.reject(error);
        }
        
        // Try to refresh the token
        const response = await axios.post(`${api_url}token/refresh/`, {
          refresh: refreshToken
        });
        
        const { access } = response.data;
        localStorage.setItem('access_token', access);
        
        // Update the Authorization header for the original request
        originalRequest.headers.Authorization = `Bearer ${access}`;
        
        // Retry the original request with new token
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh token failed, clear auth and redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);


class Server {
  // ---------------- Auth ----------------
  static login = (email: string, password: string) => {
    return api.post('signin/', {
      identifier: email,
      password: password,
    });
  };

  static signup = (data: any) => {
    console.log(data);
    return api.post('signup/', data);
  };

  static refreshToken = (refresh_token: string) => {
    return api.post('token/refresh/', { refresh: refresh_token });
  };

  static getMe = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      return null; // Return null if no token is present
    }

    // Check if token is expired
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(window.atob(base64));
      const isExpired = payload.exp * 1000 < Date.now();
      
      if (isExpired) {
        // Don't make the request if token is expired
        // The interceptor will handle the refresh
        throw new Error('Token expired');
      }

      const res = await api.get('me/');
      return res.data.user;
    } catch (error) {
      if (error.response?.status === 401 || error.message === 'Token expired') {
        // Clear invalid tokens
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        // Let the interceptor handle the redirect
        throw error;
      }
      console.error('Error fetching user data:', error);
      return null;
    }
  };
  

  // ---------------- Users ----------------
  static fetchAllUsers = () => {
    return api.get('users/');
  };

  static fetchUserProfile = (id: number) => {
    return api.get(`users/${id}/`);
  };

  static updateUserProfile = (id: number, data: Partial<UserProfile>) => {
    return api.put(`users/${id}/`, data);
  };

  // ---------------- Products ----------------
  static fetchProducts = () => {
    // Use axios directly since this endpoint doesn't require authentication
    return axios.get(`${api_url}listings/`);
  };

  static fetchProductDetails = (id: number) => {
    return axios.get(`${api_url}listings/${id}/`);
  };

  static addProduct = (data: any, images: string[] | File[]) => {
    const formData = new FormData();

    // Append all data fields
    for (const key in data) {
      formData.append(key, data[key]);
    }

    // Append images if any
    images.forEach((img, index) => {
      // If img is a File object (from file input)
      if (img instanceof File) {
        formData.append("images", img);
      } else if (typeof img === "string") {
        // If img is a URL string
        formData.append("images_urls", img); // backend should handle this
      }
    });

    return api.post('listings/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  };

  static updateProduct = (id: number, data: Partial<ProductData>) => {
    return api.put(`listings/${id}/`, data);
  };

  static deleteProduct = (id: number) => {
    return api.delete(`listings/${id}/`);
  };

  // ---------------- Likes ----------------
  static likeProduct = (productId: number) => {
    return api.post(`listings/${productId}/like/`, {});
  };

  static saveProduct = (productId: number) => {
    return api.post(`listings/${productId}/save/`, {});
  };

  static fetchUserProducts = (userId?: number) => {
    const endpoint = userId ? `listings/user/${userId}/` : 'listings/my-products/';
    return api.get(endpoint);
  };

  static fetchSavedProducts = () => {
    return api.get('listings/saved/');
  };

  static fetchTrendingProducts = () => {
    return api.get('listings/trending/');
  };

  static fetchRecommendedProducts = () => {
    return api.get('listings/recommended/');
  };

  // ---------------- Comments ----------------
  static fetchComments = async (contentType: string, objectId: number) => {
    try {
      const response = await api.get(`comments/?content_type=${contentType}&object_id=${objectId}`);
      return response;
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  };

  static addComment = async (data: {
    content: string;
    content_type: string;
    object_id: number;
    parent_id?: number;
  }) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await api.post('comments/', data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  };

  static updateComment = async (commentId: number, data: { content: string }) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await api.put(`comments/${commentId}/`, data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response;
    } catch (error) {
      console.error('Error updating comment:', error);
      throw error;
    }
  };

  static deleteComment = async (commentId: number) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await api.delete(`comments/${commentId}/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response;
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  };

  static likeComment = async (commentId: number) => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await api.post(
        `comments/${commentId}/like/`, 
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response;
    } catch (error) {
      console.error('Error liking comment:', error);
      throw error;
    }
  };

  // ---------------- Messaging ----------------
  static sendMessage = (data: MessageData) => {
    return api.post('messages/', data);
  };

  static fetchUserConversations = () => {
    return api.get('conversations/');
  };

  static fetchConversationMessages = (conversationId: number) => {
    return api.get(`conversations/${conversationId}/`);
  };

  static startConversation = (data: any) => {
    return api.post('start-conversation/', data);
  };

  static markMessagesRead = (conversationId: number) => {
    return api.post(`conversations/${conversationId}/read/`, {});
  };

  // ---------------- Analytics ----------------
  static trackProductView = (productId: number, actionType: 'view' | 'share' = 'view') => {
    return api.post(`listings/${productId}/analytics/`, {
      action_type: actionType
    });
  };

  // ---------------- Search ----------------
  static searchProducts = (query: string) => {
    return api.get(`listings/?search=${encodeURIComponent(query)}`);
  };

  static searchUsers = (query: string) => {
    return api.get(`users/?search=${encodeURIComponent(query)}`);
  };
}

export default Server;
