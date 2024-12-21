import { useParams } from "react-router-dom";
import useAxios from "../hooks/UseAxios";
import { useState } from "react";

const CryptoDetails = () => {
  const { id } = useParams();
  const { response } = useAxios(`https://api.coingecko.com/api/v3/coins/${id}`);
  const [transactionAmount, setTransactionAmount] = useState(100); // Default transaction amount

  if (!response) {
    return <div className="text-center mt-6 text-gray-500">Loading...</div>;
  }

  // Map trust score to Tailwind classes
  const getTrustScoreColor = (score) => {
    switch (score) {
      case "green":
        return "bg-green-500";
      case "yellow":
        return "bg-yellow-500";
      case "red":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  // Calculate potential profit percentage
  const calculateProfitPercentage = (lowPrice, highPrice) => {
    return ((highPrice - lowPrice) / lowPrice) * 100;
  };

  // Filter tickers with green trust score and valid USD price
  const greenTrustTickers = response.tickers.filter(
    (ticker) => ticker.trust_score === "green" && ticker.converted_last.usd !== null
  );

  // Sort tickers by price
  const sortedByPrice = [...greenTrustTickers].sort(
    (a, b) => a.converted_last.usd - b.converted_last.usd
  );

  // Extract best exchanges for buying and selling
  const bestBuyExchanges = sortedByPrice.slice(0, 3);
  const bestSellExchanges = sortedByPrice.slice(-3).reverse();

  // Calculate lowest and highest prices
  const lowestPrice = bestBuyExchanges[0]?.converted_last.usd || 0;
  const highestPrice = bestSellExchanges[0]?.converted_last.usd || 0;

  // Calculate profit, profit amount, and risk
  const potentialProfit = calculateProfitPercentage(lowestPrice, highestPrice);
  const profitAmount = (transactionAmount / lowestPrice) * (highestPrice - lowestPrice);
  const risk = ((highestPrice - lowestPrice) / lowestPrice) * 100;

  return (
    <div className="wrapper-container mx-auto mt-[4%]">
      {/* Header Section */}
      <div className="flex items-center gap-4">
        {response.image && (
          <img
            src={response.image.small}
            alt={response.name}
            className="w-12 h-12"
          />
        )}
        <h1 className="text-2xl font-bold capitalize">{response.name}</h1>
      </div>

      {/* Transaction Amount Input */}
      <div className="my-6">
        <label
          htmlFor="transactionAmount"
          className="block mb-2 font-semibold text-gray-700"
        >
          Transaction Amount (USD):
        </label>
        <input
          type="number"
          id="transactionAmount"
          value={transactionAmount}
          onChange={(e) => setTransactionAmount(e.target.value)}
          className="border rounded px-4 py-2 w-full sm:w-1/3"
        />
      </div>

      {/* Arbitrage Opportunities Section */}
      <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Arbitrage Opportunities</h2>
        <p>
          <span className="font-semibold">Potential Profit:</span>{" "}
          {potentialProfit.toFixed(2)}%
        </p>
        <p>
          <span className="font-semibold">Profit Amount:</span> $
          {profitAmount.toFixed(2)} (on ${transactionAmount} transaction)
        </p>
        <p>
          <span className="font-semibold">Risk (Price Volatility):</span>{" "}
          {risk.toFixed(2)}%
        </p>

        {/* Best Buy Exchanges */}
        <h3 className="text-lg font-semibold mt-6">Best Exchanges to Buy (Low Price):</h3>
        <ul className="list-disc list-inside mt-2">
          {bestBuyExchanges.map((exchange, index) => (
            <li key={index}>
              Buy on <span className="font-semibold">{exchange.market.name}</span> at $
              {exchange.converted_last.usd}{" "}
              <span
                className={`inline-block px-2 py-1 text-xs rounded text-white ${getTrustScoreColor(
                  exchange.trust_score
                )}`}
              >
                {exchange.trust_score}
              </span>
            </li>
          ))}
        </ul>

        {/* Best Sell Exchanges */}
        <h3 className="text-lg font-semibold mt-6">Best Exchanges to Sell (High Price):</h3>
        <ul className="list-disc list-inside mt-2">
          {bestSellExchanges.map((exchange, index) => (
            <li key={index}>
              Sell on <span className="font-semibold">{exchange.market.name}</span> at $
              {exchange.converted_last.usd}{" "}
              <span
                className={`inline-block px-2 py-1 text-xs rounded text-white ${getTrustScoreColor(
                  exchange.trust_score
                )}`}
              >
                {exchange.trust_score}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CryptoDetails;
