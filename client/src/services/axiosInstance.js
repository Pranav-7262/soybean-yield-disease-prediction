import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

// Create axios instance
export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Track token refresh promise to avoid multiple refresh calls
let refreshPromise = null;

// Response interceptor for handling token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Prevent infinite refresh loops
      if (originalRequest.url?.includes("/auth/refresh")) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        // Use existing promise if refresh is already in progress
        if (!refreshPromise) {
          refreshPromise = axiosInstance.post("/auth/refresh");
        }

        await refreshPromise;
        refreshPromise = null;

        // Retry original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        refreshPromise = null;
        // Clear auth on refresh failure - trigger logout
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

// Request interceptor for adding tokens if needed
axiosInstance.interceptors.request.use(
  (config) => {
    // Tokens are handled via cookies with credentials: true
    return config;
  },
  (error) => Promise.reject(error),
);

export default axiosInstance;
