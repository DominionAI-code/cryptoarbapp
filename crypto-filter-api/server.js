const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Filter coins API
app.get("/api/filter-coins", async (req, res) => {
  try {
    const { minPrice, maxPrice, minVolume, maxVolume, marketCap } = req.query;

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
        (!minPrice || coin.current_price >= minPrice) &&
        (!maxPrice || coin.current_price <= maxPrice);
      const withinVolumeRange =
        (!minVolume || coin.total_volume >= minVolume) &&
        (!maxVolume || coin.total_volume <= maxVolume);
      const withinMarketCap = !marketCap || coin.market_cap >= marketCap;

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