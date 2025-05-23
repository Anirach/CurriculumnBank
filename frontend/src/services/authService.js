import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Create axios instance with base URL
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add interceptor to add auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Authentication service
const authService = {
  // Login with Google token
  login: async (googleToken) => {
    try {
      const response = await apiClient.post("/auth/login", {
        token: googleToken,
      });
      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      throw new Error(error.response?.data?.message || "Login failed");
    }
  },

  // Get current user info
  getCurrentUser: async () => {
    try {
      const response = await apiClient.get("/auth/me");
      return response.data.user;
    } catch (error) {
      console.error("Get user error:", error);
      throw new Error(
        error.response?.data?.message || "Failed to get user info"
      );
    }
  },
};

export default authService;
export { apiClient };
