import { create } from 'zustand';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://10.0.2.2:5001'; // Android emulator
// const API_BASE_URL = 'http://localhost:5001'; // iOS simulator
// const API_BASE_URL = 'http://your-computer-ip:5001'; // Physical device

axios.defaults.baseURL = API_BASE_URL;

const useAuthStore = create((set, get) => ({
  // State
  user: null,
  token: null,
  loading: false,
  isInitialized: false,

  // Actions
  login: async (email, password) => {
    set({ loading: true });
    try {
      const res = await axios.post('/api/users/login', { email, password });
      const { token, ...userData } = res.data;

      await AsyncStorage.setItem('token', token);
      set({
        token,
        user: userData,
        loading: false,
      });
      return true;
    } catch (err) {
      console.error('Login error:', err);
      set({ loading: false });
      return false;
    }
  },

  register: async (username, email, password) => {
    set({ loading: true });
    try {
      const res = await axios.post('/api/users/register', {
        username,
        email,
        password,
      });
      const { token, ...userData } = res.data;

      await AsyncStorage.setItem('token', token);
      set({
        token,
        user: userData,
        loading: false,
      });
      return true;
    } catch (err) {
      console.error('Register error:', err);
      set({ loading: false });
      return false;
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem('token');
    set({
      token: null,
      user: null,
    });
  },

  // Initialize user from stored token
  initializeAuth: async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const res = await axios.get('/api/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        set({
          user: res.data,
          token,
          isInitialized: true,
        });
      } else {
        set({ isInitialized: true });
      }
    } catch (err) {
      console.error('Initialize auth error:', err);
      await AsyncStorage.removeItem('token');
      set({
        user: null,
        token: null,
        isInitialized: true,
      });
    }
  },
}));

export default useAuthStore;
