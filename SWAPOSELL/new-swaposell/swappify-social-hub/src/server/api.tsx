// api.ts
import axios from "axios";
import { api_url } from "./constants";

const API = axios.create({
  baseURL: api_url
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  console.log("Attaching token to request:", token);
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getProfile = async () => {
  const res = await API.get("profile/");
  return res.data;
};

export const updateProfile = async (updates: { name?: string; location?: string }) => {
  const res = await API.patch("profile/", updates);
  return res.data;
};

export const startConversation = async (productId: string, recipientId: string) => {
  console.log("Starting conversation with product ID:", productId);
  console.log("Recipient ID:", recipientId);
  const res = await API.post("messaging/conversations/", {
    product_id: productId,
    participant_ids: [recipientId],
  });
  return res.data;
};

export const sendMessage = async (conversation_id: string, content: string) => {
  const res = await API.post(`messaging/conversations/${conversation_id}/messages/`, {
    content,
  });
  return res.data;
};

export const getConversationMessages = async (conversationId: string) => {
  if (!conversationId) {
    console.error('No conversation ID provided');
    return [];
  }
  try {
    const res = await API.get(`messaging/conversations/${conversationId}/messages/`);
    return res.data;
  } catch (error) {
    console.error('Error fetching conversation messages:', {
      error: error.response?.data || error.message,
      status: error.response?.status
    });
    throw error;
  }
};

export const getUserConversations = async () => {
  const res = await API.get("messaging/conversations/");
  return res.data;
};

