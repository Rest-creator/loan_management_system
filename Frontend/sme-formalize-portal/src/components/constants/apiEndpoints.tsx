import { api_url } from "./apis";

const API_BASE_URL = api_url

const API_ENDPOINTS = {
  AUTH: {
    REGISTER: `${API_BASE_URL}/register/`,
    // You might add login, logout, password reset here later
    LOGIN: `${API_BASE_URL}/token/`,
    REFRESH_TOKEN: `${API_BASE_URL}/token/refresh/`,
  },
  OFFICES: {
    LIST: `${API_BASE_URL}/offices/`,
  },
  USERS: {
    PENDING_APPROVALS: `${API_BASE_URL}/pending-approvals/`,
    APPROVE_USER: (id) => `${API_BASE_URL}/approve-user/${id}/`,
    REJECT_USER: (id) => `${API_BASE_URL}/reject-user/${id}/`,
  },
  // Add other API categories here as your project grows
  // SME: {
  //   LIST: `${API_BASE_URL}/api/smes/`,
  //   DETAIL: (id) => `${API_BASE_URL}/api/smes/${id}/`,
  // }
};

export default API_ENDPOINTS;