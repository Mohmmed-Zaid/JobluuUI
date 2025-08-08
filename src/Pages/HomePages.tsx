import React from "react";
import Header from "../Header/Header";
import DreamJob from "../Landingpage/DreamJob";
import Companies from "../Landingpage/Companies";
import JobCategory from "../Landingpage/JobCategory";
import Working from "../Landingpage/Working";
import Testimonials from "../Landingpage/Testimonials";
import Subscribe from "../Landingpage/Subscribe";
import Footer from "../footer/Footer";



const HomePages = () => {
  return (
    <div className="min-h-[100vh] bg-mine-shaft-950  font-['poopins']">
      <Header />
      <DreamJob/>
      <Companies/>
      <JobCategory/>
      <Working/>
      <Testimonials/>
      <Subscribe/>
      <Footer/>
  
    </div>
  );
};

export default HomePages;