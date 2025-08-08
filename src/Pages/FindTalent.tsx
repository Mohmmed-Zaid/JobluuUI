import React from "react";
import Header from "../Header/Header"; 
import Footer from "../footer/Footer"; 
import SearchBar from "../FindTalent/SearchBar";
import Talents from "../FindTalent/Talent";

/**
 * FindTalent component: The main page for searching and displaying talent profiles.
 * It integrates the Header, a talent-specific SearchBar, the Talents display area,
 * and the Footer.
 */
const FindTalent = () => {
  return (
    // Main container with a minimum height to ensure footer is at the bottom
    // Uses a dark background and Poppins font as per the original FindJob structure.
    <div className="min-h-[100vh] bg-mine-shaft-950 font-poppins">
      <Header /> {/* Reusing the existing Header component */}
      <SearchBar /> {/* Talent-specific search bar */}
      <Talents /> {/* Component to display the grid of talent cards */}
      <Footer /> {/* Reusing the existing Footer component */}
    </div>
  );
};

export default FindTalent;

