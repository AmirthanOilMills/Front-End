// src/utils/api.js
import axios from "axios";
import Cookies from "js-cookie";

// Base URL of your backend API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // to include cookies if needed
});

// ===== INTERCEPTORS =====

// Request interceptor — adds token to every request
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token"); // your cookie name
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — can handle global errors or token expiry
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Unauthorized! Redirecting to login...");
      // Optionally redirect to login page
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ====== REQUEST HELPERS ======

export const getRequest = async (endpoint, params = {}) => {
  try {
    const response = await api.get(endpoint, { params });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const postRequest = async (endpoint, data = {}) => {
  try {
    const response = await api.post(endpoint, data);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const putRequest = async (endpoint, data = {}) => {
  try {
    const response = await api.put(endpoint, data);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const deleteRequest = async (endpoint, data = {}) => {
  try {
    const response = await api.delete(endpoint, { data });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// ====== FORM DATA HELPER ======

export const formDataRequest = async (endpoint, formData) => {
  try {
    const response = await api.post(endpoint, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// ====== COMMON ERROR HANDLER ======

const handleError = (error) => {
  console.error("API Error:", error?.response?.data || error.message);
  throw error?.response?.data || error;
};

export default api;
