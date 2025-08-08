import React from "react";
import { IconBookmark } from "@tabler/icons-react";
import CertificateCard from "./CertificateCard";

const ExpCard = () => {
  return (
    <div className="mt-5 bg-mine-shaft-800/50 border border-slate-700/50 rounded-2xl p-6 mb-6 shadow-md hover:border-yellow-400/30 transition-all duration-300">
      <div className="flex justify-between items-start mb-3">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <img
            src="/google.png"
            alt="Google"
            className="w-12 h-12 rounded-lg object-contain bg-white p-1"
            onError={(e) => {
              e.currentTarget.src = "https://placehold.co/48x48?text=G";
            }}
          />
          <div>
            <h3 className="text-lg font-semibold text-white">Software Engineer</h3>
            <p className="text-sm text-gray-400">Google • Full-time</p>
          </div>
        </div>

        {/* Bookmark */}
        <IconBookmark size={20} className="text-yellow-400 cursor-pointer" />
      </div>

      {/* Duration & Location */}
      <div className="flex items-center text-sm text-gray-400 mb-2">
        <span className="text-yellow-400 font-medium">Jan 2022 – Present</span>
        <span className="mx-2">•</span>
        <span>Bengaluru, India</span>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-300 leading-relaxed">
        Contributing to the scalability and reliability of Google Search services by developing
        robust backend APIs using Java and Go. Led the migration of legacy systems to
        microservices architecture and improved system performance by 35%. Collaborated with
        cross-functional teams to design secure and efficient solutions for global users.
      </p>
      
      {/**Certification card */}
      <h3 className="text-white font-semibold text-lg mb-4 mt-8">Certifications</h3>
      <CertificateCard />

    </div>
  );
};

export default ExpCard;
