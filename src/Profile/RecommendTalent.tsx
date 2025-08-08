import React from "react";
import { IconStar, IconMapPin, IconBriefcase, IconArrowRight } from "@tabler/icons-react";

const recommendedTalents = [
  {
    name: "Aarav Kapoor",
    title: "Full Stack Developer",
    experience: "4+ Years",
    location: "Mumbai, India",
    rating: 4.8,
    skills: ["React", "Node.js", "MongoDB", "Docker", "AWS"],
    avatar: "/avatar1.png",
  },
  {
    name: "Saanvi Mehta",
    title: "UI/UX Designer",
    experience: "3 Years",
    location: "Bengaluru, India",
    rating: 4.6,
    skills: ["Figma", "Adobe XD", "HTML", "CSS", "Design Systems"],
    avatar: "/avatar2.png",
  },
  {
    name: "Rohan Singh",
    title: "DevOps Engineer",
    experience: "5 Years",
    location: "Delhi, India",
    rating: 4.7,
    skills: ["AWS", "Docker", "Kubernetes", "Jenkins", "Terraform"],
    avatar: "/avatar3.png",
  },
  {
    name: "Isha Verma",
    title: "Backend Developer",
    experience: "4 Years",
    location: "Pune, India",
    rating: 4.9,
    skills: ["Java", "Spring Boot", "PostgreSQL", "Redis", "Microservices"],
    avatar: "/avatar4.png",
  },
];

const RecommendTalent = () => {
  return (
    <div className="mt-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recommendedTalents.map((talent, index) => (
          <div
            key={index}
            className="bg-mine-shaft-800/50 border border-slate-700/50 rounded-2xl p-6 shadow-md hover:border-yellow-400/30 transition-all duration-300"
          >
            <div className="flex items-center gap-4 mb-4">
              {/* Avatar */}
              <img
                src={talent.avatar}
                alt={talent.name}
                className="w-16 h-16 rounded-full object-cover ring-2 ring-yellow-400/30"
                onError={(e) => {
                  e.currentTarget.src = "https://placehold.co/64x64?text=AV";
                }}
              />
              {/* Info */}
              <div>
                <h3 className="text-lg font-bold text-white">{talent.name}</h3>
                <p className="text-sm text-yellow-400">{talent.title}</p>
                <div className="flex items-center text-sm text-gray-400 mt-1">
                  <IconBriefcase size={16} className="mr-1 text-yellow-400" />
                  {talent.experience} •
                  <IconMapPin size={16} className="ml-2 mr-1 text-yellow-400" />
                  {talent.location}
                </div>
              </div>
              {/* Rating */}
              <div className="ml-auto">
                <div className="flex items-center bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  <IconStar size={12} className="mr-1" />
                  {talent.rating}
                </div>
              </div>
            </div>
            {/* Skills */}
            <div className="flex flex-wrap gap-2 mb-4">
              {talent.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="bg-mine-shaft-700 hover:bg-mine-shaft-600 text-gray-300 hover:text-white px-3 py-1 rounded-full text-xs border border-slate-600/50 hover:border-yellow-400/40 transition cursor-pointer"
                >
                  {skill}
                </span>
              ))}
            </div>
            {/* CTA */}
            <div className="flex justify-end">
              <button className="flex items-center gap-2 text-yellow-400 hover:underline text-sm font-medium hover:scale-105 transition">
                View Profile
                <IconArrowRight size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendTalent;
