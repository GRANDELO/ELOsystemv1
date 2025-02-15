import axiosInstance from "../components/axiosInstance";

const API_URL = "https://elosystemv1.onrender.com/api";

// Create new email campaign
export const createCampaign = async (data) => {
  try {
    const response = await axiosInstance.post(`${API_URL}/campaigns`, data);
    return response.data;
  } catch (error) {
    console.error("Error creating campaign:", error);
    throw error;
  }
};

// Get all campaigns
export const getCampaigns = async () => {
  try {
    const response = await axiosInstance.get(`${API_URL}/campaigns`);
    return response.data;
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    throw error;
  }
};
