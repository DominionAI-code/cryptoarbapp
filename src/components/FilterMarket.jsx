import React, { useState } from "react";
import { Link } from "react-router-dom";
import { DownTrending, UpTrending } from "../assets/Icons";
import axios from "axios";

const FilterMarket = () => {
  // State for filtered coins and filter parameters
  const [filteredCoins, setFilteredCoins] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [volumeRange, setVolumeRange] = useState({ min: "", max: "" });
  const [marketCap, setMarketCap] = useState("");
  const [transactionAmount, setTransactionAmount] = useState(100);

  // Fetch coins based on the filters
  const fetchFilteredCoins = async () => {
    try {
      const response = await axios.get(`/api/filter-coins`, {
        params: {
          minPrice: priceRange.min || undefined,
          maxPrice: priceRange.max || undefined,
          minVolume: volumeRange.min || undefined,
          maxVolume: volumeRange.max || undefined,
          marketCap: marketCap || undefined,
        },
      });
  
      if (response.data.length === 0) {
        console.warn("No coins match the filter criteria.");
      }
  
      setFilteredCoins(response.data);
    } catch (error) {
      console.error("Error fetching filtered coins:", error.message);
      setFilteredCoins([]); // Clear filtered coins if there's an error
    }
  };
  

  // Input handler functions
  const handlePriceChange = (key, value) => {
    setPriceRange((prev) => ({ ...prev, [key]: value }));
  };

  const handleVolumeChange = (key, value) => {
    setVolumeRange((prev) => ({ ...prev, [key]: value }));
  };

  // Render function for filtered coins
  const renderFilteredCoins = () => {
    if (filteredCoins.length > 0) {
      return filteredCoins.map((coin) => (
        <div key={coin.id} className="mb-7 p-4 bg-slate-300 rounded-lg shadow-md">
          <div className="flex justify-between items-center">
            <div className="text-lg">
              <p>{coin.name} (${coin.current_price})</p>
              <Link
                to={`/coin/${coin.id}`}
                state={{ coin, transactionAmount }}
                className="text-blue-500 hover:underline"
              >
                View Details
              </Link>
            </div>

            {/* Price Change Section */}
            <span
              className={`flex items-center gap-1 justify-end sm:justify-center ${
                coin.price_change_percentage_24h < 0 ? "text-red-400" : "text-green-400"
              }`}
            >
              {coin.price_change_percentage_24h < 0 ? <DownTrending /> : <UpTrending />}
              {coin.price_change_percentage_24h}%
            </span>
          </div>
        </div>
      ));
    } else {
      return (
        <p className="text-2xl text-yellow-600 text-center">
          No coins match the filter criteria.
        </p>
      );
    }
  };

  return (
    <section className="mt-10 p-4 wrapper-container bg-gray-600">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl mb-8 text-gray-300 text-center lg:text-left">
        Filter Your Desired <span className="text-yellow-600">Cryptocurrencies</span>
      </h1>

      {/* Price Range Inputs */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <label className="text-lg sm:text-xl text-gray-300 mb-2 sm:mb-0">Price Range ($):</label>
        <div className="flex flex-col sm:flex-row sm:space-x-4">
          <input
            type="number"
            placeholder="Min"
            value={priceRange.min}
            onChange={(e) => handlePriceChange("min", e.target.value)}
            className="text-lg font-medium text-slate-700 hover:bg-slate-500 hover:text-white rounded sm:px-4 py-2"
          />
          <input
            type="number"
            placeholder="Max"
            value={priceRange.max}
            onChange={(e) => handlePriceChange("max", e.target.value)}
            className="text-lg font-medium text-slate-700 hover:bg-slate-500 hover:text-white rounded sm:px-4 py-2"
          />
        </div>
      </div>

      {/* Volume Range Inputs */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <label className="text-lg sm:text-xl text-gray-300 mb-2 sm:mb-0">Volume Range (24h):</label>
        <div className="flex flex-col sm:flex-row sm:space-x-4">
          <input
            type="number"
            placeholder="Min"
            value={volumeRange.min}
            onChange={(e) => handleVolumeChange("min", e.target.value)}
            className="text-lg font-medium text-slate-700 hover:bg-slate-500 hover:text-white rounded sm:px-4 py-2"
          />
          <input
            type="number"
            placeholder="Max"
            value={volumeRange.max}
            onChange={(e) => handleVolumeChange("max", e.target.value)}
            className="text-lg font-medium text-slate-700 hover:bg-slate-500 hover:text-white rounded sm:px-4 py-2"
          />
        </div>
      </div>

      {/* Market Cap Input */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <label className="text-lg sm:text-xl text-gray-300 mb-2 sm:mb-0">Market Cap:</label>
        <input
          type="number"
          value={marketCap}
          placeholder="Market Cap"
          onChange={(e) => setMarketCap(e.target.value)}
          className="text-lg font-medium text-slate-700 hover:bg-slate-500 hover:text-white rounded sm:px-4 py-2"
        />
      </div>

      {/* Transaction Amount Input */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <label className="text-lg sm:text-xl text-gray-300 mb-2 sm:mb-0">Transaction Amount ($):</label>
        <input
          type="number"
          value={transactionAmount}
          placeholder="$100"
          onChange={(e) => setTransactionAmount(e.target.value)}
          className="text-lg font-medium text-slate-700 hover:bg-slate-500 hover:text-white rounded sm:px-4 py-2"
        />
      </div>

      {/* Filter Button */}
      <button
        onClick={fetchFilteredCoins}
        className="bg-yellow-700 text-white px-6 py-2 rounded-lg mb-6 hover:bg-yellow-900 w-full sm:w-auto"
      >
        Generate Data
      </button>

      {/* Display Filtered Coins */}
      <div className="mt-8">{renderFilteredCoins()}</div>
    </section>
  );
};

export default FilterMarket;
