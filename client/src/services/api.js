import axiosInstance from "./axiosInstance";

export const api = {
  // ==================== AUTH ENDPOINTS ====================
  auth: {
    register: async (data) => {
      return axiosInstance.post("/auth/register", data);
    },

    login: async (data) => {
      return axiosInstance.post("/auth/login", data);
    },

    logout: async () => {
      return axiosInstance.post("/auth/logout");
    },

    getCurrentUser: async () => {
      return axiosInstance.get("/auth/current-user");
    },

    refreshToken: async () => {
      return axiosInstance.post("/auth/refresh");
    },

    updateUsername: async (username) => {
      return axiosInstance.put("/auth/update-username", { username });
    },

    updateEmail: async (email) => {
      return axiosInstance.put("/auth/update-email", { email });
    },

    changePassword: async (data) => {
      return axiosInstance.put("/auth/update-password", data);
    },

    resetAccount: async () => {
      return axiosInstance.delete("/auth/reset-account");
    },
  },

  disease: {
    predict: async (formData) => {
      return axiosInstance.post("/disease/disease", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
  },

  yield: {
    predict: async (data) => {
      return axiosInstance.post("/yield/predict", data);
    },
  },

  // ==================== HISTORY ENDPOINTS ====================
  history: {
    getAll: async () => {
      return axiosInstance.get("/history");
    },

    getStats: async () => {
      return axiosInstance.get("/history/stats");
    },

    getById: async (id) => {
      return axiosInstance.get(`/history/${id}`);
    },

    delete: async (id) => {
      return axiosInstance.delete(`/history/${id}`);
    },

    deleteAll: async () => {
      return axiosInstance.delete("/history");
    },
  },
};

// ==================== ERROR HANDLING UTILITY ====================
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    return {
      status: error.response.status,
      message: error.response.data?.message || "An error occurred",
      data: error.response.data,
    };
  } else if (error.request) {
    // Request made but no response
    return {
      status: 0,
      message: "No response from server. Check your connection.",
      data: null,
    };
  } else {
    // Error in request setup
    return {
      status: 0,
      message: error.message || "An error occurred",
      data: null,
    };
  }
};

// ==================== REQUEST WRAPPER WITH ERROR HANDLING ====================
export const apiCall = async (apiMethod, ...args) => {
  try {
    const response = await apiMethod(...args);
    return {
      success: true,
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    const errorInfo = handleApiError(error);
    return {
      success: false,
      error: errorInfo.message,
      status: errorInfo.status,
      data: errorInfo.data,
    };
  }
};

export default api;
