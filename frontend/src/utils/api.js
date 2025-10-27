import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// API Methods
export const authAPI = {
  login: (email, password) => api.post("/auth/login", { email, password }),
  register: (userData) => api.post("/auth/register", userData),
  getMe: () => api.get("/auth/me"),
  updateProfile: (data) => api.put("/auth/update-profile", data),
};

export const gigsAPI = {
  getAll: (params) => api.get("/gigs", { params }),
  getById: (id) => api.get(`/gigs/${id}`),
  create: (data) => api.post("/gigs", data),
  update: (id, data) => api.put(`/gigs/${id}`, data),
  delete: (id) => api.delete(`/gigs/${id}`),
  placeBid: (id, data) => api.post(`/gigs/${id}/bid`, data),
  getBids: (id) => api.get(`/gigs/${id}/bids`),
};

export const projectsAPI = {
  getAll: (params) => api.get("/projects", { params }),
  getById: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post("/projects", data),
  updateMilestone: (id, milestoneId, data) =>
    api.put(`/projects/${id}/milestone/${milestoneId}`, data),
  complete: (id) => api.post(`/projects/${id}/complete`),
  submitReview: (id, data) => api.post(`/projects/${id}/review`, data),
};

export const aiAPI = {
  generateGigIdeas: (data) => api.post("/ai/generate-gig-ideas", data),
  generateProposal: (data) => api.post("/ai/generate-proposal", data),
  generateContent: (data) => api.post("/ai/generate-content", data),
  analyzeRequirements: (data) => api.post("/ai/analyze-requirements", data),
  getUsage: () => api.get("/ai/usage"),
};

export const paymentsAPI = {
  createPaymentIntent: (data) =>
    api.post("/payments/create-payment-intent", data),
  confirmPayment: (data) => api.post("/payments/confirm-payment", data),
  subscribe: (data) => api.post("/payments/subscribe", data),
  cancelSubscription: () => api.post("/payments/cancel-subscription"),
};

export const usersAPI = {
  getProfile: (id) => api.get(`/users/${id}`),
  updatePortfolio: (data) => api.put("/users/portfolio", data),
  getPortfolio: (id) => api.get(`/users/${id}/portfolio`),
};

export default api;
