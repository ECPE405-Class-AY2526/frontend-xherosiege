import axios from "axios";

// Determine base URL based on environment
const getBaseURL = () => {
  if (import.meta.env.PROD) {
    // Production: use relative URLs (same domain)
    return "/api";
  } else {
    // Development: use localhost
    return "http://localhost:5001/api";
  }
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Enable cookies for production
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
