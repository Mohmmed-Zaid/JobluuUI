import React from "react";
import Header from "../Header/Header";
import Footer from "../footer/Footer";
import { Link, useParams } from "react-router-dom";
import { Button } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import Profile from "../TalentProfile/Profile";
import TalentData from "../Landingpage/Data/TalentData";

const TalentProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  
  // Find the talent by ID
  const talent = TalentData.find(t => t.id === parseInt(id || '0'));
  
  // If talent not found, show error message
  if (!talent) {
    return (
      <div className="min-h-[100vh] bg-mine-shaft-950 font-poppins">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Link className="my-4 inline-block" to="/find-talent">
            <Button
              leftSection={<IconArrowLeft size={18} className="text-yellow-400" />}
              variant="light"
              color="brightSun.4"
              className="rounded-full bg-mine-shaft-800 hover:bg-mine-shaft-700 text-white border border-yellow-400 px-5 py-2 text-sm font-medium transition duration-200"
            >
              Back
            </Button>
          </Link>
          <div className="text-center text-white py-16">
            <h2 className="text-2xl font-bold mb-4">Talent Not Found</h2>
            <p className="text-gray-400">The talent profile you're looking for doesn't exist.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-[100vh] bg-mine-shaft-950 font-poppins">
      <Header />
      
      <div className="container mx-auto px-4 py-4">
        <Link className="my-4 inline-block" to="/find-talent">
          <Button
            leftSection={<IconArrowLeft size={18} className="text-yellow-400" />}
            variant="light"
            color="brightSun.4"
            className="rounded-full bg-mine-shaft-800 hover:bg-mine-shaft-700 text-white border border-yellow-400 px-5 py-2 text-sm font-medium transition duration-200"
          >
            Back
          </Button>
        </Link>
        
        <div>
          <Profile talent={talent} />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default TalentProfilePage;
