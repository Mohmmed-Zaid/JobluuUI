import React from "react";
import {
  IconMapPin,
  IconStar,
  IconBriefcase,
  IconCalendar,
  IconMail,
  IconPhone,
  IconShare,
  IconBookmark,
} from "@tabler/icons-react";
import ExpCard from "./ExpCard";
import RecommendTalent from "./RecommendTalent";
import CertificateCard from "./CertificateCard";

interface ProfileProps {
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

const Profile: React.FC<ProfileProps> = ({ talent }) => {
  // Calculate years of experience based on experience level
  const getExperienceYears = (level: string) => {
    switch (level.toLowerCase()) {
      case 'entry-level': return '0-1 Years';
      case 'junior': return '1-3 Years';
      case 'mid-level': return '3-6 Years';
      case 'senior': return '6-10 Years';
      case 'lead': return '10+ Years';
      case 'principal': return '15+ Years';
      default: return '5+ Years';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-mine-shaft-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-700/50">
      {/* Banner */}
      <div className="relative">
        <img
          className="w-full h-48 object-cover"
          src="/banner.png"
          alt="Banner"
          onError={(e) => (e.currentTarget.style.display = "none")}
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-yellow-400/10 via-transparent to-yellow-400/5" />
        <div className="absolute top-4 right-4 flex gap-2">
          <button className="bg-mine-shaft-800/80 hover:bg-mine-shaft-700 p-2 rounded-full backdrop-blur-sm transition-all hover:scale-110">
            <IconShare size={18} className="text-yellow-400" />
          </button>
          <button className="bg-mine-shaft-800/80 hover:bg-mine-shaft-700 p-2 rounded-full backdrop-blur-sm transition-all hover:scale-110">
            <IconBookmark size={18} className="text-yellow-400" />
          </button>
        </div>

        {/* Avatar */}
        <div className="absolute -bottom-20 left-8">
          <div className="relative">
            <img
              className="w-40 h-40 rounded-full border-6 border-mine-shaft-900 shadow-2xl object-cover ring-4 ring-yellow-400/20"
              src={talent.avatar}
              alt={talent.name}
              onError={(e) =>
                (e.currentTarget.src =
                  "https://placehold.co/160x160/4f4f4f/ffffff?text=" + talent.name.split(' ').map(n => n[0]).join(''))
              }
            />
            <div className="absolute bottom-4 right-4 w-6 h-6 bg-green-500 rounded-full border-4 border-mine-shaft-900 animate-pulse shadow-lg" />
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
              <div className="flex items-center bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                <IconStar size={12} className="mr-1" />
                4.9
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Info */}
      <div className="pt-24 pb-8 px-8">
        <div className="text-white mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {talent.name}
              </h2>
              <p className="text-lg text-yellow-400 font-semibold mt-1">{talent.title}</p>
              <div className="flex items-center gap-4 mt-3 text-sm text-gray-400">
                <div className="flex items-center">
                  <IconBriefcase size={16} className="mr-1.5 text-yellow-400" />
                  {getExperienceYears(talent.experienceLevel)} Experience
                </div>
                <div className="flex items-center">
                  <IconCalendar size={16} className="mr-1.5 text-yellow-400" />
                  Available Now
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <button className="bg-mine-shaft-800 hover:bg-mine-shaft-700 p-2 rounded-full transition hover:scale-110">
                <IconMail size={20} className="text-yellow-400" />
              </button>
              <button className="bg-mine-shaft-800 hover:bg-mine-shaft-700 p-2 rounded-full transition hover:scale-110">
                <IconPhone size={20} className="text-yellow-400" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center text-gray-300 mb-6 bg-mine-shaft-800/50 px-4 py-3 rounded-xl border border-slate-700/50">
          <IconMapPin className="h-5 w-5 mr-2 text-yellow-400" />
          <span className="font-medium">{talent.location}</span>
          <span className="ml-auto text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
            Open to Remote
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Projects", value: "127" },
            { label: "Followers", value: "2.3k" },
            { label: "Success Rate", value: "98%" },
          ].map(({ label, value }, i) => (
            <div
              key={i}
              className="bg-mine-shaft-800/50 p-4 rounded-xl text-center border border-slate-700/50 hover:border-yellow-400/30 transition"
            >
              <div className="text-2xl font-bold text-yellow-400">{value}</div>
              <div className="text-xs text-gray-400 uppercase tracking-wide">{label}</div>
            </div>
          ))}
        </div>

        {/* About */}
        <div className="mb-6">
          <h3 className="text-white font-semibold mb-3 text-lg">About</h3>
          <div className="text-gray-300 text-sm leading-relaxed bg-mine-shaft-800/30 p-4 rounded-xl border border-slate-700/30">
            {talent.description}
          </div>
        </div>

        {/* Skills */}
        <div className="mb-6">
          <h3 className="text-white font-semibold mb-3 text-lg">Core Skills</h3>
          <div className="flex flex-wrap gap-2">
            {talent.skills.slice(0, 6).map((skill) => (
              <span
                key={skill}
                className="bg-mine-shaft-800 hover:bg-mine-shaft-700 text-gray-300 hover:text-white px-3 py-2 rounded-full text-sm border border-slate-700/50 hover:border-yellow-400/50 transition cursor-pointer"
              >
                {skill}
              </span>
            ))}
            {talent.skills.length > 6 && (
              <span className="text-yellow-400 px-3 py-2 rounded-full text-sm cursor-pointer hover:bg-yellow-400/10 transition">
                +{talent.skills.length - 6} more
              </span>
            )}
          </div>
        </div>

        {/* Expected Salary */}
        <div className="mb-8">
          <h3 className="text-white font-semibold mb-3 text-lg">Expected Salary</h3>
          <div className="bg-mine-shaft-800/50 px-4 py-3 rounded-xl border border-slate-700/50 inline-block">
            <span className="text-yellow-400 font-bold text-lg">{talent.expectedSalary}</span>
            <span className="text-gray-400 text-sm ml-2">per annum</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold text-sm px-6 py-3 rounded-xl transition hover:scale-105 active:scale-95">
            Connect Now
          </button>
          <button className="flex-1 border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black font-bold text-sm px-6 py-3 rounded-xl transition hover:scale-105 active:scale-95">
            Send Message
          </button>
          <button className="bg-mine-shaft-800 hover:bg-mine-shaft-700 text-gray-300 hover:text-white px-4 py-3 rounded-xl border border-slate-700/50 hover:border-yellow-400/50">
            <IconBookmark size={18} />
          </button>
        </div>

        {/* Experience Card */}
        <h3 className="text-white font-semibold text-lg mb-4 mt-8">Experience</h3> 
        <ExpCard />

        {/* Recommend Talent Card */}
        <RecommendTalent />
      </div>
    </div>
  );
};

export default Profile;
