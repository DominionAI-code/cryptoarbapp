import express from "express";
import cors from "cors";
import axios from "axios";
import delay from "delay";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Helper function to handle rate limiting with retries
const fetchWithRetry = async (url, params, retries = 5, delayTime = 1000) => {
  try {
    const response = await axios.get(url, { params });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 429 && retries > 0) {
      console.log(`Rate limit exceeded, retrying in ${delayTime / 1000} seconds...`);
      await delay(delayTime); // Wait before retrying
      return fetchWithRetry(url, params, retries - 1, delayTime * 2); // Exponentially back off
    } else {
      throw error; // If no retries left or other error, throw
    }
  }
};

// API for fetching paginated coins
app.get("/api/coins", async (req, res) => {
  try {
    const { page = 1 } = req.query; // Default to page 1 if no page is provided

    // Validate the page number
    if (isNaN(page) || page < 1 || page > 100) {
      return res.status(400).json({ error: "Page must be between 1 and 100." });
    }

    // Fetch data from CoinGecko API with retry logic
    const data = await fetchWithRetry("https://api.coingecko.com/api/v3/coins/markets", {
      vs_currency: "usd",
      order: "market_cap_desc",
      per_page: 250,
      page, // Pass the validated page parameter
      sparkline: false,
    });

    // Respond with the fetched data
    res.json(data);
  } catch (error) {
    console.error("Error fetching coins:", error.message);

    if (error.response) {
      return res.status(error.response.status).json({
        error: error.response.data.error || "Failed to fetch coins from CoinGecko.",
      });
    }

    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

