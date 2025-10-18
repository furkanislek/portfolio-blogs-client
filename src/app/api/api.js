import axios from "axios";

export const getData = async (endpoint) => {
  try {
    const response = await axios.get(`${process.env.API}/${endpoint}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
