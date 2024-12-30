import React from "react";
import { Link } from "react-router-dom";
import { DownTrending, UpTrending } from "../assets/Icons";
import { currencyFormat } from "../utils/format";

const Coin = ({ coin }) => {
  return (
    <Link to={`/coin/${coin.id}`}>
      <div className="p-4 bg-gray-800 rounded-md hover:bg-yellow-800 hover:text-black transition duration-300 cursor-pointer">
        <div className="font-bold text-lg text-gray-300">{coin.name}</div>
        <div className="text-gray-400">{coin.symbol.toUpperCase()}</div>
        <div className="text-gray-300">Price: {currencyFormat(coin.current_price)}</div>
        <div className="text-gray-300">Market Cap: {currencyFormat(coin.market_cap)}</div>
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
    </Link>
  );
};

export default Coin;
