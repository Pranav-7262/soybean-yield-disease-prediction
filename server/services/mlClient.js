import axios from "axios";

const ML_API = "http://127.0.0.1:8000";
export const predictYield = async (data) => {
  try {
    const response = await axios.post(`${ML_API}/predict/yield`, data);
    return response.data;
  } catch (error) {
    console.error("ML API Error:", error.message);
    throw error;
  }
};

export const getYieldDistricts = async () => {
  try {
    const response = await axios.get(`${ML_API}/predict/yield/districts`);
    return response.data;
  } catch (error) {
    console.error("ML API Error:", error.message);
    throw error;
  }
};
