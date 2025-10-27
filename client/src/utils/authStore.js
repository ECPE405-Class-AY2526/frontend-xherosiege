import { create } from "zustand";
import axios from "axios";

// Set up axios defaults
axios.defaults.baseURL = "http://localhost:5001";

// Add axios interceptor to automatically include token in all requests
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && token !== "") {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const useAuthStore = create((set, get) => ({
  // State
  user: null,
  token: localStorage.getItem("token") || "",
  loading: false,

  // Actions
  login: async (email, password) => {
    set({ loading: true });
    try {
      const res = await axios.post("/api/users/login", { email, password });
      //console.log("Login response:", res.data);

      // Extract token and create user object from response
      const { token, ...userData } = res.data;

      localStorage.setItem("token", token);

      set({
        token,
        user: userData, // This will be { _id, username, email, role }
        loading: false,
      });
      return true;
    } catch (err) {
      console.error("Login error:", err);
      set({ loading: false });
      return false;
    }
  },

  register: async (username, email, password) => {
    set({ loading: true });
    try {
      const res = await axios.post("/api/users/register", {
        username,
        email,
        password,
      });

      const { token, ...userData } = res.data;

      localStorage.setItem("token", token);
      set({
        token,
        user: userData,
        loading: false,
      });
      return true;
    } catch (err) {
      console.error("Register error:", err);
      set({ loading: false });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({
      token: "",
      user: null,
    });
  },

  // Initialize user from token
  initializeAuth: async () => {
    const { token } = get();
    if (token && token !== "") {
      try {
        const res = await axios.get("/api/users/me");
        console.log("InitializeAuth response:", res.data);
        set({ user: res.data });
      } catch (err) {
        console.error("InitializeAuth error:", err);
        // Token is invalid, clear it
        get().logout();
      }
    }
  },
}));

export default useAuthStore;
