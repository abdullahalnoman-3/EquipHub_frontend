import axios from "axios";

// Dynamically resolves backend API base URL with SSL / non-SSL support
export const getApiBaseUrl = (): string => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host.includes("equiphub.hmnoman.com") || host.includes("hmnoman.com")) {
      const proto = window.location.protocol; // "http:" or "https:"
      return `${proto}//equiphubadmin.hmnoman.com/api/v1`;
    }
  }
  return "http://localhost:5000/api/v1";
};

export const API_BASE_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 20000,
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("equiphub_token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors cleanly
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If token is invalid or expired (401), clean up local storage
    if (error.response && error.response.status === 401) {
      if (typeof window !== "undefined") {
        const hadToken = localStorage.getItem("equiphub_token");
        if (hadToken) {
          localStorage.removeItem("equiphub_token");
          localStorage.removeItem("equiphub_user");
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
