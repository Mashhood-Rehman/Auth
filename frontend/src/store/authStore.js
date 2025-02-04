import axios from "axios";
import { create } from "zustand";

const API_URL = "https://auth-seven-kappa.vercel.app/api/auth";
axios.defaults.withCredentials = true;
export const useAuthStore = create((set) => ({
  user: null,
  isLoading: false,
  isAuthenticating: false,
  error: null,
  isCheckingAuth: true,

  signup: async ({ email, password, name }) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/signup`, {
        email,
        password,
        name,
      });
      set({
        user: response.data.user,
        isAuthenticating: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response.data.message || "Error Signing up",
        isLoading: false,
      });
      throw new Error(error.response?.data?.message || "Signup failed");
    }
  },
  verifyEmail: async (verificationCode) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/verify-email`, {
        code: verificationCode,
      });

      set({
        user: response.data.user,
        isLoading: false,
        isAuthenticating: true,
      });
    } catch (error) {
      set({
        error: error.response.data.message || "Error occurred while verifying",
        isLoading: false,
      });
      throw new Error(error.response?.data?.message || "Verification failed");
    }
  },
  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_URL}/logout`);
      set({
        user: null,
        isAuthenticated: false,
        error: null,
        isLoading: false,
      });
    } catch (error) {
      set({ error: "Error logging out", isLoading: false });
      throw error;
    }
  },
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });
      set({
        user: response.data.user,
        isAuthenticating: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response.data.message || "Error while loging in ",
        isLoading: false,
      });
      throw error;
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true, error: false });
    try {
      const res = await axios.get(`${API_URL}/check-auth`);
      set({ user: res.data.user, isAuthenticating: true, isLoading: false });
    } catch (error) {
      set({ error: error, isCheckingAuth: false, isAuthenticating: false });
    }
  },
  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/forgot-password`, {
        email,
      });
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error:
          error.response.data.message || "Error sending reset password email",
      });
      throw error;
    }
  },
  resetPassword: async (token, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/reset-password/${token}`, {
        password,
      });
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response.data.message || "Error resetting password",
      });
      throw error;
    }
  },
}));
