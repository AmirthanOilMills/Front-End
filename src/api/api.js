// src/utils/api.js
import axios from "axios";

// Base URL of your backend API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // to include cookies if needed
});

// ===== INTERCEPTORS =====

// Request interceptor — adds token to every request
// api.interceptors.request.use(
//   (config) => {
//     const token = Cookies.get("token"); // your cookie name
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// Response interceptor — can handle global errors or token expiry
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Unauthorized! Redirecting to login...");
      // Optionally redirect to login page
      // window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

// ====== REQUEST HELPERS ======

export const getRequest = async (endpoint, params = {}) => {
  const response = await api.get(endpoint, { params });
  return response.data;
};

export const postRequest = async (endpoint, data = {}) => {
  const isFormData = data instanceof FormData;

  const response = await api.post(endpoint, data, {
    headers: isFormData
      ? { "Content-Type": "multipart/form-data" }
      : {},
  });

  return response.data;
};

export const putRequest = async (endpoint, data = {}) => {
  const isFormData = data instanceof FormData;

  const response = await api.put(endpoint, data, {
    headers: isFormData
      ? { "Content-Type": "multipart/form-data" }
      : {},
  });

  return response.data;
};

export const deleteRequest = async (endpoint, data = {}) => {
  const response = await api.delete(endpoint, { data });
  return response.data;
};

// ====== FORM DATA HELPER ======

// export const formDataRequest = async (endpoint, formData) => {
//   try {
//     const response = await api.post(endpoint, formData, {
//       headers: { "Content-Type": "multipart/form-data" },
//     });
//     return response.data;
//   } catch (error) {
//     handleError(error);
//   }
// };



export default api;
