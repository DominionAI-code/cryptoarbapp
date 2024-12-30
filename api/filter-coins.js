import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 4000;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Route for filtering coins
app.get("/api/filter-coins", async (req, res) => {
  try {
    const { minPrice, maxPrice, minVolume, maxVolume, marketCap } = req.query;

    // Parse query parameters into numbers
    const parsedMinPrice = parseFloat(minPrice);
    const parsedMaxPrice = parseFloat(maxPrice);
    const parsedMinVolume = parseFloat(minVolume);
    const parsedMaxVolume = parseFloat(maxVolume);
    const parsedMarketCap = parseFloat(marketCap);

    // Fetch coins data from the CoinGecko API
    const { data } = await axios.get("https://api.coingecko.com/api/v3/coins/markets", {
      params: {
        vs_currency: "usd",
        order: "market_cap_desc",
        per_page: 250, // Maximum coins per page
        page: 1,
        sparkline: false,
      },
    });

    // Filter coins based on query parameters
    const filteredCoins = data.filter((coin) => {
      const withinPriceRange =
        (isNaN(parsedMinPrice) || coin.current_price >= parsedMinPrice) &&
        (isNaN(parsedMaxPrice) || coin.current_price <= parsedMaxPrice);
      const withinVolumeRange =
        (isNaN(parsedMinVolume) || coin.total_volume >= parsedMinVolume) &&
        (isNaN(parsedMaxVolume) || coin.total_volume <= parsedMaxVolume);
      const withinMarketCap =
        isNaN(parsedMarketCap) || coin.market_cap >= parsedMarketCap;

      return withinPriceRange && withinVolumeRange && withinMarketCap;
    });

    res.json(filteredCoins);
  } catch (error) {
    console.error("Error fetching coins data:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
