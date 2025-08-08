import React from "react";
import {
  IconBuildingFactory2, // Represents company/factory
  IconCalendar,         // Represents dates
  IconMapPin,           // Represents location
  IconAward,            // Represents achievements
  IconCode,             // Represents technologies
} from "@tabler/icons-react";

// Assuming Header and Footer are imported externally, similar to PostedJobPage
import Header from "../Header/Header";
import Footer from "../footer/Footer";

// Define the interface for a single job history entry
interface JobHistoryEntry {
  id: number;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string; // Can be a date string or "Present"
  description: string;
  achievements: string[];
  technologies: string[];
}

// Sample data for job history
const jobHistoryData: JobHistoryEntry[] = [
  {
    id: 1,
    title: "Senior Software Engineer",
    company: "Tech Solutions Inc.",
    location: "San Francisco, USA",
    startDate: "Jan 2022",
    endDate: "Present",
    description: "Led a team of 5 engineers in developing scalable backend services for a high-traffic e-commerce platform. Responsible for architectural decisions and code reviews.",
    achievements: [
      "Improved API response time by 30% through optimization of database queries.",
      "Successfully migrated legacy systems to a microservices architecture.",
      "Mentored junior developers and fostered a collaborative team environment.",
    ],
    technologies: ["Node.js", "TypeScript", "Express", "PostgreSQL", "AWS", "Docker", "Kubernetes"],
  },
  {
    id: 2,
    title: "Software Developer",
    company: "Innovate Corp.",
    location: "New York, USA",
    startDate: "Mar 2019",
    endDate: "Dec 2021",
    description: "Developed and maintained robust web applications using React and Node.js. Collaborated with product managers and designers to deliver user-centric features.",
    achievements: [
      "Implemented a new user authentication module, reducing security vulnerabilities by 40%.",
      "Contributed to the redesign of the main dashboard, increasing user engagement by 15%.",
    ],
    technologies: ["React", "JavaScript", "Redux", "Node.js", "MongoDB", "Git"],
  },
  {
    id: 3,
    title: "Junior Developer",
    company: "Startup Hub",
    location: "Austin, USA",
    startDate: "Aug 2017",
    endDate: "Feb 2019",
    description: "Assisted in the development of a mobile-first web application. Gained experience in full-stack development and agile methodologies.",
    achievements: [
      "Developed several responsive UI components using HTML and CSS.",
      "Participated in daily stand-ups and sprint planning sessions.",
    ],
    technologies: ["HTML", "CSS", "JavaScript", "jQuery", "PHP", "MySQL"],
  },
];

const JobHistoryPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-mine-shaft-950 text-white">
      {/* Header Component - Uncomment and import if you have one */}
      <Header />

      <div className="flex-1 p-4 md:p-8 lg:p-10 border-4 border-yellow-500/20 rounded-2xl m-4 md:m-8 lg:m-10 shadow-lg shadow-yellow-500/10">
        <h1 className="text-4xl font-bold text-yellow-400 mb-8 text-center">My Job History</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"> {/* Grid for cards */}
          {jobHistoryData.map((job) => (
            <div
              key={job.id}
              // Card styling inspired by JobCards, adjusted for history content
              className="bg-gradient-to-br from-mine-shaft-900 to-slate-800 p-6 rounded-2xl text-white shadow-lg flex flex-col justify-between
                         transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-yellow-400/20 border border-slate-700 hover:border-yellow-400/50 group"
            >
              {/* Header: Company Icon, Title, Company Name */}
              <div className="flex items-center mb-4 pb-4 border-b border-slate-700/50">
                {/* Using a placeholder company icon */}
                <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center p-1 mr-4 flex-shrink-0 group-hover:bg-slate-600 transition-colors">
                    <IconBuildingFactory2 size={28} className="text-yellow-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold leading-tight text-white group-hover:text-yellow-400 transition-colors">{job.title}</h2>
                  <p className="text-sm text-slate-400">{job.company}</p>
                </div>
              </div>

              {/* Location and Dates */}
              <div className="grid grid-cols-1 gap-2 mb-4">
                <div className="flex items-center gap-2 text-slate-300 text-sm">
                  <IconMapPin size={18} className="text-emerald-400 flex-shrink-0" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300 text-sm">
                  <IconCalendar size={18} className="text-blue-400 flex-shrink-0" />
                  <span>{job.startDate} - {job.endDate}</span>
                </div>
              </div>

              {/* Role Description */}
              <div className="mb-4 flex-grow"> {/* flex-grow to push footer down */}
                <h3 className="text-md font-semibold text-yellow-400 mb-2">Role Description</h3>
                <p className="text-slate-300 text-sm line-clamp-4 leading-relaxed">
                  {job.description}
                </p>
              </div>

              {/* Key Achievements */}
              {job.achievements.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-md font-semibold text-yellow-400 mb-2">Key Achievements</h3>
                  <ul className="list-none space-y-1 text-slate-300 text-sm">
                    {job.achievements.map((achievement, index) => (
                      <li key={index} className="flex items-start">
                        <IconAward size={16} className="text-purple-400 mr-2 flex-shrink-0 mt-0.5" />
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Technologies Used */}
              {job.technologies.length > 0 && (
                <div>
                  <h3 className="text-md font-semibold text-yellow-400 mb-2">Technologies Used</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="bg-slate-700/60 px-2.5 py-1 rounded-full text-xs font-medium text-slate-300 border border-slate-600
                                   transition-colors duration-200 hover:bg-slate-600 flex items-center gap-1"
                      >
                        <IconCode size={14} className="text-cyan-400" />
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer Component - Uncomment and import if you have one */}
      <Footer />
    </div>
  );
};

export default JobHistoryPage;
