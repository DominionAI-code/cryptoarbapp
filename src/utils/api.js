// src/utils/api.js

import axios from "axios";

export const fetchCoinsByPage = async (page) => {
  try {
    const perPage = 250; // Maximum allowed by CoinGecko
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${page}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching coins on page ${page}:`, error);
    throw error;
  }
};


  