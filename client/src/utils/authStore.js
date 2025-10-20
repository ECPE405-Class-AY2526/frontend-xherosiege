import { create } from "zustand";
import axios from "axios";

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
      console.log(res.data);
      const { token, user } = res.data;

      localStorage.setItem("token", token);
      set({
        token,
        user,
        loading: false,
      });
      return true;
    } catch (err) {
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
      const { token, user } = res.data;

      localStorage.setItem("token", token);
      set({
        token,
        user,
        loading: false,
      });
      return true;
    } catch (err) {
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
        const res = await axios.get("/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        set({ user: res.data });
      } catch (err) {
        // Token is invalid, clear it
        get().logout();
      }
    }
  },
}));

export default useAuthStore;
