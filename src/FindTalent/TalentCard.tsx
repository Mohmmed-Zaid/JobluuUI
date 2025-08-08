import React from "react";
import { useNavigate } from 'react-router-dom';
import { IconMail, IconMapPin, IconCurrencyDollar, IconStar } from "@tabler/icons-react";

interface TalentProps {
  talent: {
    id: number;
    avatar: string;
    name: string;
    title: string;
    skills: string[];
    description: string;
    expectedSalary: string;
    location: string;
    experienceLevel: string;
  };
}

const TalentCard: React.FC<TalentProps> = ({ talent }) => {
  const navigate = useNavigate();

  return (
    <div className="group relative bg-mine-shaft-900 p-3 sm:p-4 rounded-xl sm:rounded-2xl text-white shadow-xl w-[17rem] sm:w-[18rem] h-[16rem] sm:h-[18rem] flex flex-col justify-between transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-400/20 border border-slate-700 hover:border-yellow-400/50 backdrop-blur-sm">
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-yellow-400/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Header Section */}
      <div className="relative z-10 flex justify-between items-start">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative">
            <img
              src={talent.avatar}
              alt={talent.name}
              className="w-9 h-9 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-slate-600 group-hover:border-yellow-400 transition-colors duration-300 shadow-lg"
              onError={(e) => {
                e.currentTarget.src = "https://placehold.co/48x48/4f4f4f/ffffff?text=AV";
              }}
            />
            <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-mine-shaft-900 animate-pulse" />
          </div>
          
          <div>
            <h3 className="text-sm sm:text-base font-bold leading-tight text-white group-hover:text-yellow-400 transition-colors duration-300">
              {talent.name}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5">
              {talent.title}
            </p>
            <div className="flex items-center gap-1 mt-1">
              <IconStar size={10} className="sm:hidden text-yellow-400" />
              <IconStar size={12} className="hidden sm:block text-yellow-400" />
              <span className="text-xs text-slate-400">{talent.experienceLevel}</span>
            </div>
          </div>
        </div>
        
        <div className="relative">
          <IconMail 
            size={18} 
            className="sm:hidden text-yellow-400 cursor-pointer hover:text-yellow-300 transition-all duration-300 hover:scale-110 drop-shadow-lg" 
          />
          <IconMail 
            size={20} 
            className="hidden sm:block text-yellow-400 cursor-pointer hover:text-yellow-300 transition-all duration-300 hover:scale-110 drop-shadow-lg" 
          />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        </div>
      </div>

      {/* Skills Section */}
      <div className="relative z-10 flex flex-wrap gap-1 sm:gap-1.5 mt-2 sm:mt-3 min-h-[24px]">
        {talent.skills.slice(0, 4).map((skill, index) => (
          <span 
            key={index} 
            className="bg-mine-shaft-800 hover:bg-slate-600/70 px-2 sm:px-2.5 py-1 rounded-full text-xs text-slate-300 hover:text-white transition-all duration-300 backdrop-blur-sm border border-slate-600/50 hover:border-yellow-400/50"
          >
            {skill}
          </span>
        ))}
        {talent.skills.length > 4 && (
          <span className="bg-yellow-400/20 text-yellow-400 px-2 sm:px-2.5 py-1 rounded-full text-xs font-medium border border-yellow-400/30">
            +{talent.skills.length - 4} more
          </span>
        )}
      </div>

      {/* Description */}
      <div className="relative z-10 flex-1 mt-2 sm:mt-3">
        <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed overflow-hidden">
          {talent.description}
        </p>
      </div>

      {/* Location and Salary */}
      <div className="relative z-10 flex justify-between items-center mt-2 sm:mt-3 p-2 bg-mine-shaft-800/50 rounded-lg backdrop-blur-sm border border-slate-700/50">
        <div className="flex items-center gap-1 sm:gap-1.5">
          <IconMapPin size={12} className="sm:hidden text-emerald-400" />
          <IconMapPin size={14} className="hidden sm:block text-emerald-400" />
          <span className="text-xs text-emerald-400 font-medium">{talent.location}</span>
        </div>
        <div className="flex items-center gap-1 sm:gap-1.5">
          <IconCurrencyDollar size={12} className="sm:hidden text-yellow-400" />
          <IconCurrencyDollar size={14} className="hidden sm:block text-yellow-400" />
          <span className="text-xs text-yellow-400 font-bold">
            {talent.expectedSalary}
          </span>
        </div>
      </div>

      {/* View Profile Button - CHANGED: Pass talent ID in URL */}
      <div className="relative z-10 mt-2 sm:mt-3">
        <button
          onClick={() => navigate(`/talent-profile/${talent.id}`)}
          className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black text-xs sm:text-sm font-bold px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-yellow-400/30 active:scale-95 transform"
        >
          View Profile
        </button>
      </div>
    </div>
  );
};

export default TalentCard;