import { api_url } from "./apis";

const API_BASE_URL = api_url;

const API_ENDPOINTS = {
  BASE_URL: { URL: API_BASE_URL },
  AUTH: {
    REGISTER: `${API_BASE_URL}/register/`,
    // You might add login, logout, password reset here later
    LOGIN: `${API_BASE_URL}/token/`,
    REFRESH_TOKEN: `${API_BASE_URL}/token/refresh/`,
  },
  OFFICES: {
    LIST: `${API_BASE_URL}/offices/`,
      DETAIL: (id) => `/office-details/${id}/`,
  },
  OFFICERS: {
    LIST: "/all-officers/", // New endpoint for listing officers
  },
  USERS: {
    CURRENT_USER: `${API_BASE_URL}/user-profile/`,
    PENDING_APPROVALS: `${API_BASE_URL}/pending-approvals/`,
    APPROVE_USER: (id) => `${API_BASE_URL}/approve-user/${id}/`,
    REJECT_USER: (id) => `${API_BASE_URL}/reject-user/${id}/`,
    UPDATE_PROFILE: '/users/me/',
    UPDATE_NOTIFICATIONS: '/users/me/notifications/', // Example if notifications are separate
 
  },
   APPLICATIONS: {
        LIST: '/applications/', // Endpoint to list applications, will filter by office_id
        DETAIL: (id) => `/applications/${id}/`,
        // ... other application endpoints
    },
  // Add other API categories here as your project grows
  // SME: {
  //   LIST: `${API_BASE_URL}/api/smes/`,
  //   DETAIL: (id) => `${API_BASE_URL}/api/smes/${id}/`,
  // }
};

export default API_ENDPOINTS;
