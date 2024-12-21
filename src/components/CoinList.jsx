// src/components/CoinList.jsx
import React, { useEffect, useState } from "react";
import Coin from "./Coin";
import { fetchCoinsByPage } from "../utils/api";

const CoinList = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const maxPages = 100; // Maximum pages to display

  const loadCoins = async (page) => {
    try {
      setLoading(true); // Show loading indicator
      const pageCoins = await fetchCoinsByPage(page);
      setCoins(pageCoins);
    } catch (err) {
      console.error("Error fetching coins:", err);
      setError("Failed to load coins. Please try again later.");
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  useEffect(() => {
    loadCoins(currentPage); // Load coins for the current page on mount or page change
  }, [currentPage]);

  const handleNextPage = () => {
    if (currentPage < maxPages) setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prevPage) => prevPage - 1);
  };

  if (loading) {
    return <div className="text-center text-gray-400 mt-[5%]">Loading coins...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 mt-[5%]">{error}</div>;
  }

  return (
    <div className="container mx-auto mt-[5%] bg-gray-600">
      {/* Coins Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {coins.map((coin) => (
          <Coin key={coin.id} coin={coin} />
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center space-x-4 mt-8">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-md ${
            currentPage === 1 ? "bg-gray-400 cursor-not-allowed" : "bg-yellow-600 hover:bg-yellow-700"
          } text-white`}
        >
          Previous
        </button>
        <span className="text-lg font-semibold">
          Page {currentPage} of {maxPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === maxPages}
          className={`px-4 py-2 rounded-md ${
            currentPage === maxPages ? "bg-gray-400 cursor-not-allowed" : "bg-yellow-600 hover:bg-yellow-700"
          } text-white`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CoinList;


