import axios from "axios";

const API_BASE_URL = process.env.API;

export const getData = async (endpoint) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${endpoint}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
