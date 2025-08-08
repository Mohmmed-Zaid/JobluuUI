import React from "react";
import { IconBookmark } from "@tabler/icons-react";
import { Link, useNavigate } from "react-router-dom";
import { Job } from "../Pages/FindJob";

interface JobProps {
  job: Job;
}

const JobCards: React.FC<JobProps> = ({ job }) => {
  const navigate = useNavigate();

  const formatSalary = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    }
    return `₹${(amount / 1000).toFixed(0)}K`;
  };

  const getTimeSincePost = (postTime: string) => {
    const posted = new Date(postTime);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - posted.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleApplyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/apply-job/${job.id}`);
  };

  // Handle card click to navigate to job details
  const handleCardClick = () => {
    navigate(`/jobs/${job.id}`);
  };

  // Create a simple logo based on company name
  const getCompanyLogo = (companyName: string) => {
    if (!companyName || typeof companyName !== 'string') {
      return (
        <div className="w-10 h-10 bg-gray-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
          ?
        </div>
      );
    }

    const initials = companyName
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
    
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500', 
      'bg-indigo-500', 'bg-pink-500', 'bg-orange-500', 'bg-teal-500'
    ];
    const colorIndex = companyName.length % colors.length;
    
    return (
      <div className={`w-10 h-10 ${colors[colorIndex]} rounded-lg flex items-center justify-center text-white font-bold text-sm`}>
        {initials}
      </div>
    );
  };

  return (
    // Changed from Link to div with onClick for better control
    <div 
      onClick={handleCardClick}
      className="block cursor-pointer"
    >
      <div className="bg-gradient-to-br bg-mine-shaft-950 to-slate-800 p-4 rounded-2xl text-white shadow-lg w-full h-72 flex flex-col justify-between transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl hover:shadow-yellow-400/20 border border-slate-700 hover:border-yellow-400/50 group">
        
        {/* Header: Logo + Info + Bookmark */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-3">
            {job.companyLogo && job.companyLogo.startsWith('http') ? (
              <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center p-1 group-hover:bg-slate-600 transition-colors">
                <img
                  src={job.companyLogo}
                  alt={job.company || 'Company Logo'}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.style.display = 'none';
                  }}
                />
              </div>
            ) : (
              getCompanyLogo(job.company)
            )}
            <div>
              <h3 className="text-sm font-bold leading-tight text-white group-hover:text-yellow-400 transition-colors">
                {job.jobTitle || 'Job Title'}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {job.company || 'Company'} • {job.experience || 'Experience'}
              </p>
            </div>
          </div>
          <IconBookmark 
            size={18}
            className="text-slate-400 hover:text-yellow-400 cursor-pointer transition-colors duration-200 hover:scale-110"
            onClick={(e) => {
              e.stopPropagation(); // Prevent card navigation when clicking bookmark
              // Add bookmark functionality here
              console.log('Bookmarked job:', job.id);
            }}
          />
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="bg-slate-700/60 text-slate-300 px-2.5 py-1 rounded-full text-xs font-medium border border-slate-600">
            {job.jobType || 'Job Type'}
          </span>
          <span className="bg-slate-700/60 text-slate-300 px-2.5 py-1 rounded-full text-xs font-medium border border-slate-600">
            {job.location || 'Location'}
          </span>
          <span className="bg-slate-700/60 text-slate-300 px-2.5 py-1 rounded-full text-xs font-medium border border-slate-600">
            {job.experience || 'Experience'}
          </span>
        </div>

        {/* Skills */}
        {job.skillsRequired && job.skillsRequired.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {job.skillsRequired.slice(0, 3).map((skill, index) => (
              <span key={index} className="bg-yellow-400/10 text-yellow-400 px-2 py-1 rounded-full text-xs">
                {skill}
              </span>
            ))}
            {job.skillsRequired.length > 3 && (
              <span className="text-slate-400 text-xs px-2 py-1">
                +{job.skillsRequired.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Description */}
        <p className="text-xs text-slate-400 mb-3 line-clamp-2 leading-relaxed flex-grow">
          {job.description || 'No description available'}
        </p>

        {/* Footer: Salary & Apply Button */}
        <div className="flex justify-between items-center mt-auto">
          <div className="flex flex-col">
            <span className="text-yellow-400 font-bold text-sm">
              {job.packageOffered ? formatSalary(job.packageOffered) : 'Salary TBD'}
            </span>
            <span className="text-slate-400 text-xs">
              {job.postTime ? getTimeSincePost(job.postTime) : 0}d ago
            </span>
          </div>
          <button 
            onClick={handleApplyClick}
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black text-xs font-bold px-4 py-2 rounded-full hover:from-yellow-300 hover:to-yellow-400 transition-all duration-200 shadow-lg hover:shadow-yellow-400/30 transform hover:scale-105"
          >
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobCards;