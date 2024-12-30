// src/utils/api.js

import axios from "axios";

export const fetchCoinsByPage = async (page = 1) => {
  try {
    // Correct axios call with template literal
    const response = await axios.get(`/api/coins`, {
      params: { page }, // Axios automatically appends the params to the URL
    });

    return response.data; // Return the data if successful
  } catch (error) {
    console.error(`Error fetching coins on page ${page}:`, error.message);

    // Handle specific error responses
    if (error.response) {
      throw new Error(error.response.data.error || "Failed to load coins.");
    }

    // Handle network or unknown errors
    throw new Error("Network error. Please check your connection.");
  }
};