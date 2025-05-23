import { apiClient } from "./authService";

const curriculumService = {
  // Get all curriculum files with optional filtering
  getCurriculums: async (params = {}) => {
    try {
      const response = await apiClient.get("/curriculums", { params });
      return response.data;
    } catch (error) {
      console.error("Get curriculums error:", error);
      throw new Error(
        error.response?.data?.message || "Failed to load curriculum files"
      );
    }
  },

  // Get a single curriculum file by ID
  getCurriculumById: async (id) => {
    try {
      const response = await apiClient.get(`/curriculums/${id}`);
      return response.data.file;
    } catch (error) {
      console.error("Get curriculum error:", error);
      throw new Error(
        error.response?.data?.message || "Failed to load curriculum file"
      );
    }
  },

  // Get download URL for a curriculum file
  getDownloadUrl: async (id) => {
    try {
      const response = await apiClient.get(`/curriculums/${id}/download`);
      return response.data.downloadUrl;
    } catch (error) {
      console.error("Get download URL error:", error);
      throw new Error(
        error.response?.data?.message || "Failed to get download link"
      );
    }
  },

  // Upload a new curriculum file
  uploadCurriculum: async (formData) => {
    try {
      const response = await apiClient.post("/curriculums", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data.file;
    } catch (error) {
      console.error("Upload curriculum error:", error);
      throw new Error(
        error.response?.data?.message || "Failed to upload curriculum file"
      );
    }
  },

  // Update curriculum metadata
  updateCurriculum: async (id, data) => {
    try {
      const response = await apiClient.put(`/curriculums/${id}`, data);
      return response.data.file;
    } catch (error) {
      console.error("Update curriculum error:", error);
      throw new Error(
        error.response?.data?.message || "Failed to update curriculum file"
      );
    }
  },

  // Delete a curriculum file
  deleteCurriculum: async (id) => {
    try {
      const response = await apiClient.delete(`/curriculums/${id}`);
      return response.data;
    } catch (error) {
      console.error("Delete curriculum error:", error);
      throw new Error(
        error.response?.data?.message || "Failed to delete curriculum file"
      );
    }
  },

  // Get available tags (for autocomplete)
  getAvailableTags: async () => {
    try {
      const response = await apiClient.get("/tags");
      return response.data.tags;
    } catch (error) {
      console.error("Get tags error:", error);
      // Return empty array instead of throwing, since this is not critical
      return [];
    }
  },
};

export default curriculumService;
