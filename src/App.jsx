// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CoinList from "./components/CoinList";
import CryptoDetails from "./components/CryptoDetails";
import FilterMarket from "./components/FilterMarket";
import Navbar from "./components/Navbar";
import About from "./components/About";
import Contact from "./components/Contact"

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Route for the list of coins */}
        <Route path="/" element={<CoinList />} />

        {/* Route for the coin details page */}
        <Route path="/coin/:id" element={<CryptoDetails />} />
        {/* Route for the coin filter page */}
        <Route path="filter" element={<FilterMarket />} />
        {/* Route for the about page */}
        <Route path="about" element={<About />} />
        {/* Route for the contact page */}
        <Route path="contact" element={<Contact />} />
      </Routes>
    </Router>
  );
};

export default App;
