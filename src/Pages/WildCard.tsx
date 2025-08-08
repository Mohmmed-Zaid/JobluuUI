import React from "react";
import Header from "../Header/Header"; 
import Footer from "../footer/Footer"; 
import { Link } from "react-router-dom";
import { IconArrowLeft } from "@tabler/icons-react";

const WildCard = () => {
  return (
    <div className="bg-mine-shaft-950 text-white min-h-screen flex flex-col justify-between">
      <Header />

      <div className="flex flex-col items-center justify-center flex-grow text-center px-4 py-20">
        <h1 className="text-6xl font-bold text-bright-sun-400 mb-6">404</h1>
        <h2 className="text-2xl md:text-3xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-gray-400 mb-8 max-w-md">
          The page you are looking for doesn’t exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 bg-bright-sun-400 text-black font-medium rounded-full hover:bg-yellow-300 transition"
        >
          <IconArrowLeft className="mr-2" /> Go back home
        </Link>
      </div>

      <Footer />
    </div>
  );
};

export default WildCard;
