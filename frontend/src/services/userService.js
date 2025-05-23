import { apiClient } from "./authService";

const userService = {
  // Get all users (admin only) with optional filters and pagination
  getUsers: async (params = {}) => {
    try {
      const response = await apiClient.get("/users", { params });
      return response.data;
    } catch (error) {
      console.error("Get users error:", error);
      throw new Error(error.response?.data?.message || "Failed to load users");
    }
  },

  // Update user role (admin only)
  updateUserRole: async (userId, roleId) => {
    try {
      const response = await apiClient.put(`/users/${userId}/role`, { roleId });
      return response.data.user;
    } catch (error) {
      console.error("Update user role error:", error);
      throw new Error(
        error.response?.data?.message || "Failed to update user role"
      );
    }
  },

  // Get a single user (admin only)
  getUserById: async (userId) => {
    try {
      const response = await apiClient.get(`/users/${userId}`);
      return response.data.user;
    } catch (error) {
      console.error("Get user error:", error);
      throw new Error(
        error.response?.data?.message || "Failed to load user details"
      );
    }
  },
};

export default userService;
