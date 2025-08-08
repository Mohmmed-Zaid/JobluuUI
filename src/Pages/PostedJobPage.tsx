
import React, { useState, useEffect } from "react";
import {
  IconMapPin,
  IconBriefcase,
  IconCurrencyDollar,
  IconBolt,
  IconMail,
  IconStar,
  IconX,
  IconEdit,
  IconTrash,
  IconPlus,
  IconRefresh,
  IconSearch,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import Footer from "../footer/Footer";
import Header from "../Header/Header";
import JobFormModal from "../Components/JobFormModal";
import { jobService, JobDTO } from '../Services/jobService';

// TalentCard component (keeping the original design)
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
  onLike: (talentId: number) => void;
}

const TalentCard: React.FC<TalentProps> = ({ talent, onLike }) => {
  const navigate = useNavigate();

  return (
    <div className="group relative bg-mine-shaft-900 p-3 sm:p-4 rounded-xl sm:rounded-2xl text-white shadow-xl w-[17rem] sm:w-[18rem] h-[16rem] sm:h-[18rem] flex flex-col justify-between transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-400/20 border border-slate-700 hover:border-yellow-400/50 backdrop-blur-sm">
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-yellow-400/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

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

      <div className="relative z-10 flex-1 mt-2 sm:mt-3">
        <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed overflow-hidden">
          {talent.description}
        </p>
      </div>

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

      <div className="relative z-10 mt-2 sm:mt-3 flex gap-2">
        <button
          onClick={() => navigate("/talent-profile")}
          className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black text-xs sm:text-sm font-bold px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-yellow-400/30 active:scale-95 transform"
        >
          View Profile
        </button>
        <button
          onClick={() => onLike(talent.id)}
          className="p-2 bg-slate-700 hover:bg-red-500 rounded-xl transition-colors duration-300"
          title="Like Talent"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-white"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

// Sample data for applicants (keeping original)
const allApplicants = [
  {
    id: 1,
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    name: "Alice Johnson",
    title: "Frontend Developer",
    skills: ["React", "JavaScript", "HTML", "CSS", "Next.js", "Tailwind CSS"],
    description: "Highly motivated frontend developer with 5 years of experience building responsive and user-friendly web applications. Proficient in modern JavaScript frameworks and libraries.",
    expectedSalary: "$90,000",
    location: "San Francisco, USA",
    experienceLevel: "Mid-level",
  },
  {
    id: 2,
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    name: "Bob Williams",
    title: "Backend Engineer",
    skills: ["Node.js", "Express", "MongoDB", "REST APIs", "AWS Lambda"],
    description: "Experienced backend engineer specializing in scalable API development and database management. Passionate about creating efficient and secure server-side solutions.",
    expectedSalary: "$95,000",
    location: "London, UK",
    experienceLevel: "Senior",
  },
  {
    id: 3,
    avatar: "https://randomuser.me/api/portraits/men/50.jpg",
    name: "Charlie Brown",
    title: "Full Stack Developer",
    skills: ["React", "Node.js", "TypeScript", "PostgreSQL", "Docker", "Kubernetes"],
    description: "Versatile full stack developer with a strong understanding of both frontend and backend technologies. Enjoys tackling complex problems and delivering end-to-end solutions.",
    expectedSalary: "$100,000",
    location: "Sydney, Australia",
    experienceLevel: "Expert",
  },
  {
    id: 4,
    avatar: "https://randomuser.me/api/portraits/women/62.jpg",
    name: "Diana Miller",
    title: "UI/UX Designer",
    skills: ["Figma", "Sketch", "User Research", "Wireframing", "Prototyping", "Usability Testing"],
    description: "Creative UI/UX designer focused on crafting intuitive and aesthetically pleasing user experiences. Committed to user-centered design principles.",
    expectedSalary: "$80,000",
    location: "Toronto, Canada",
    experienceLevel: "Mid-level",
  },
  {
    id: 5,
    avatar: "https://randomuser.me/api/portraits/men/78.jpg",
    name: "Eve Davis",
    title: "DevOps Engineer",
    skills: ["AWS", "Terraform", "Jenkins", "Linux", "Python Scripting"],
    description: "Results-driven DevOps engineer with a knack for automating infrastructure and streamlining deployment pipelines. Strong advocate for continuous integration and delivery.",
    expectedSalary: "$110,000",
    location: "Berlin, Germany",
    experienceLevel: "Senior",
  },
];

const invitedApplicants = [allApplicants[0], allApplicants[2]];

const PostedJobPage = () => {
  const navigate = useNavigate();
  
  // State management
  const [activeTab, setActiveTab] = useState("overview");
  const [activeJob, setActiveJob] = useState<JobDTO | null>(null);
  const [filterStatus, setFilterStatus] = useState("active");
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  // New states for backend integration
  const [jobs, setJobs] = useState<JobDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showJobModal, setShowJobModal] = useState(false);
  const [editingJob, setEditingJob] = useState<JobDTO | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch jobs on component mount
  useEffect(() => {
    fetchJobs();
  }, []);

  // Set first job as active when jobs are loaded
  useEffect(() => {
    if (jobs.length > 0 && !activeJob) {
      setActiveJob(jobs[0]);
    }
  }, [jobs, activeJob]);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedJobs = await jobService.getAllJobs();
      // Calculate days ago for display (mock calculation)
      const jobsWithDaysAgo = fetchedJobs.map(job => ({
        ...job,
        daysAgo: job.daysAgo || Math.floor(Math.random() * 10) + 1
      }));
      setJobs(jobsWithDaysAgo);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch jobs');
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter jobs based on status and search term - FIXED VERSION
  const filteredJobs = jobs.filter(job => {
    const matchesStatus = filterStatus === 'all' || job.status === filterStatus;
    const matchesSearch = (job.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (job.location?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Handle job submission (create/update)
  const handleJobSubmit = async (jobData: JobDTO, logoFile?: File) => {
    setIsSubmitting(true);
    try {
      if (editingJob && editingJob.id) {
        // Update existing job
        const updatedJob = await jobService.updateJob(editingJob.id, jobData, logoFile);
        setJobs(prevJobs => 
          prevJobs.map(job => 
            job.id === editingJob.id ? updatedJob : job
          )
        );
        // Show success message
        alert('Job updated successfully!');
      } else {
        // Create new job
        let newJob;
        if (logoFile) {
          newJob = await jobService.postJobWithLogo(jobData, logoFile);
        } else {
          newJob = await jobService.postJob(jobData);
        }
        setJobs(prevJobs => [newJob, ...prevJobs]);
        // Show success message
        alert('Job posted successfully!');
      }
      
      setShowJobModal(false);
      setEditingJob(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save job');
      alert(err instanceof Error ? err.message : 'Failed to save job');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle job deletion
  const handleDeleteJob = async (jobId: number) => {
    if (!window.confirm('Are you sure you want to delete this job?')) {
      return;
    }

    try {
      await jobService.deleteJob(jobId);
      setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
      
      // If deleted job was active, set first job as active
      if (activeJob?.id === jobId && filteredJobs.length > 1) {
        const remainingJobs = filteredJobs.filter(job => job.id !== jobId);
        setActiveJob(remainingJobs[0] || null);
      }
      
      alert('Job deleted successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete job');
      alert(err instanceof Error ? err.message : 'Failed to delete job');
    }
  };

  // Handle opening edit modal
  const handleEditJob = (job: JobDTO) => {
    setEditingJob(job);
    setShowJobModal(true);
  };

  // Handle opening create modal
  const handleCreateJob = () => {
    setEditingJob(null);
    setShowJobModal(true);
  };

  // Close job modal
  const handleCloseJobModal = () => {
    setShowJobModal(false);
    setEditingJob(null);
  };

  const handleLikeTalent = (talentId: number) => {
    console.log(`Liked talent with ID: ${talentId}`);
    alert(`You liked talent ID: ${talentId}`);
  };

  const openScheduleModal = (applicant: any) => {
    setSelectedApplicant(applicant);
    setShowScheduleModal(true);
  };

  const closeScheduleModal = () => {
    setShowScheduleModal(false);
    setSelectedDate("");
    setSelectedTime("");
    setSelectedApplicant(null);
  };

  const handleScheduleSubmit = () => {
    if (selectedDate && selectedTime && selectedApplicant) {
      console.log(`Scheduling interview for ${selectedApplicant.name} on ${selectedDate} at ${selectedTime}`);
      alert(`Interview scheduled for ${selectedApplicant.name} on ${selectedDate} at ${selectedTime}`);
      closeScheduleModal();
    } else {
      alert("Please select a date and time.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-mine-shaft-950 text-white">
      <Header />
      
      {/* Error Display */}
      {error && (
        <div className="mx-4 md:mx-8 lg:mx-10 mt-4 p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
          <div className="flex justify-between items-center">
            <span>{error}</span>
            <button 
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-300"
            >
              <IconX size={20} />
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-1 p-4 md:p-8 lg:p-10 border-4 border-yellow-500/20 rounded-2xl m-4 md:m-8 lg:m-10 shadow-lg shadow-yellow-500/10">
        {/* Left Job List Sidebar */}
        <aside className="w-72 border-r-2 border-slate-700/50 p-5 overflow-y-auto rounded-l-xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-yellow-400">Jobs</h2>
            <div className="flex gap-2">
              <button
                onClick={fetchJobs}
                className="p-2 text-slate-400 hover:text-yellow-400 transition-colors duration-200"
                title="Refresh Jobs"
                disabled={loading}
              >
                <IconRefresh size={18} className={loading ? 'animate-spin' : ''} />
              </button>
              <button
                onClick={handleCreateJob}
                className="p-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-300 transition-colors duration-200"
                title="Post New Job"
              >
                <IconPlus size={18} />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <IconSearch size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 text-sm bg-mine-shaft-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-yellow-400 transition-colors duration-200"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2 mb-4 flex-wrap">
            <button
              onClick={() => setFilterStatus("active")}
              className={`text-xs font-semibold px-3 py-1.5 rounded-md transition-all duration-300 ${
                filterStatus === "active"
                  ? "text-black bg-yellow-400 shadow-md shadow-yellow-400/30"
                  : "text-slate-400 border border-slate-700 hover:border-yellow-400 hover:text-white"
              }`}
            >
              Active [{jobs.filter(job => job.status === "active").length}]
            </button>
            <button
              onClick={() => setFilterStatus("draft")}
              className={`text-xs font-semibold px-3 py-1.5 rounded-md transition-all duration-300 ${
                filterStatus === "draft"
                  ? "text-black bg-yellow-400 shadow-md shadow-yellow-400/30"
                  : "text-slate-400 border border-slate-700 hover:border-yellow-400 hover:text-white"
              }`}
            >
              Drafts [{jobs.filter(job => job.status === "draft").length}]
            </button>
            <button
              onClick={() => setFilterStatus("all")}
              className={`text-xs font-semibold px-3 py-1.5 rounded-md transition-all duration-300 ${
                filterStatus === "all"
                  ? "text-black bg-yellow-400 shadow-md shadow-yellow-400/30"
                  : "text-slate-400 border border-slate-700 hover:border-yellow-400 hover:text-white"
              }`}
            >
              All [{jobs.length}]
            </button>
          </div>

          {/* Jobs List */}
          <div className="space-y-3">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-yellow-400 border-b-transparent"></div>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                {searchTerm || filterStatus !== 'all' ? 'No jobs found' : 'No jobs posted yet'}
              </div>
            ) : (
              filteredJobs.map((job) => (
                <div
                  key={job.id}
                  onClick={() => setActiveJob(job)}
                  className={`bg-mine-shaft-900 hover:border-yellow-400/50 border ${
                    activeJob?.id === job.id ? "border-yellow-400 shadow-lg shadow-yellow-400/10" : "border-slate-700"
                  } p-3 rounded-xl cursor-pointer transition-all duration-200 group`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-white text-sm group-hover:text-yellow-400 transition-colors duration-200">
                        {job.title || 'Untitled Job'}
                      </h3>
                      <p className="text-xs text-slate-400">{job.location || 'Location not specified'}</p>
                      <p className="text-xs text-slate-500">{job.daysAgo || 0} days ago</p>
                      <span className={`inline-block px-2 py-1 rounded text-xs font-semibold mt-1 ${
                        job.status === 'active' 
                          ? 'bg-green-900/30 text-green-400 border border-green-400/30' 
                          : 'bg-yellow-900/30 text-yellow-400 border border-yellow-400/30'
                      }`}>
                        {(job.status || 'draft').toUpperCase()}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditJob(job);
                        }}
                        className="p-1 text-slate-400 hover:text-yellow-400 transition-colors duration-200"
                        title="Edit Job"
                      >
                        <IconEdit size={14} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (job.id) handleDeleteJob(job.id);
                        }}
                        className="p-1 text-slate-400 hover:text-red-400 transition-colors duration-200"
                        title="Delete Job"
                      >
                        <IconTrash size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>

        {/* Center Job Detail / Applicants / Invited Section */}
        <main className="flex-1 p-10 overflow-y-auto bg-mine-shaft-950 rounded-r-xl">
          {activeJob ? (
            <>
              <div className="mb-6 pb-4 border-b-2 border-slate-700/50">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-3xl font-bold text-white">
                      {activeJob.title || 'Untitled Job'}{" "}
                      <span className={`text-xs font-bold px-2 py-1 rounded ml-2 shadow-sm ${
                        activeJob.status === 'active' 
                          ? 'bg-green-500 text-black' 
                          : 'bg-yellow-500 text-black'
                      }`}>
                        {(activeJob.status || 'draft').toUpperCase()}
                      </span>
                    </h1>
                    <p className="text-slate-400 mt-1">{activeJob.location || 'Location not specified'}</p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEditJob(activeJob)}
                      className="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-black rounded-lg font-semibold hover:bg-yellow-300 transition-colors duration-200 shadow-md"
                    >
                      <IconEdit size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => activeJob.id && handleDeleteJob(activeJob.id)}
                      className="flex items-center gap-2 px-4 py-2 border border-red-500 text-red-500 rounded-lg font-semibold hover:bg-red-500 hover:text-white transition-colors duration-200 shadow-md"
                    >
                      <IconTrash size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-6 border-b border-slate-700 mb-6">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`py-2 px-1 font-semibold transition-colors duration-300 ${
                    activeTab === "overview"
                      ? "text-yellow-400 border-b-2 border-yellow-400"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab("applicants")}
                  className={`py-2 px-1 font-semibold transition-colors duration-300 ${
                    activeTab === "applicants"
                      ? "text-yellow-400 border-b-2 border-yellow-400"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Applicants [{allApplicants.length}]
                </button>
                <button
                  onClick={() => setActiveTab("invited")}
                  className={`py-2 px-1 font-semibold transition-colors duration-300 ${
                    activeTab === "invited"
                      ? "text-yellow-400 border-b-2 border-yellow-400"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  Invited [{invitedApplicants.length}]
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === "overview" && (
                <div className="bg-mine-shaft-900 border border-slate-700 rounded-xl p-6 shadow-lg">
                  <div className="flex items-center gap-4 mb-6 pb-4 border-b border-slate-700/50">
                    <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center shadow-md">
                      <img 
                        src={activeJob.logoUrl || "/google.png"} 
                        alt="Company Logo" 
                        className="w-10 h-10 object-contain"
                        onError={(e) => {
                          e.currentTarget.src = "/google.png";
                        }}
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">
                        {activeJob.title || 'Untitled Job'}
                      </h3>
                      <p className="text-sm text-slate-400">
                        {activeJob.companyName || 'Company'} • {activeJob.daysAgo || 0} days ago • 48 Applicants
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6">
                    <div className="flex flex-col items-center p-4 bg-mine-shaft-800 rounded-lg border border-slate-700/50 shadow-sm">
                      <IconMapPin size={24} className="text-yellow-400 mb-2" />
                      <p className="text-sm text-slate-400">Location</p>
                      <p className="font-semibold text-white text-center">{activeJob.location || 'Not specified'}</p>
                    </div>
                    <div className="flex flex-col items-center p-4 bg-mine-shaft-800 rounded-lg border border-slate-700/50 shadow-sm">
                      <IconBriefcase size={24} className="text-yellow-400 mb-2" />
                      <p className="text-sm text-slate-400">Experience</p>
                      <p className="font-semibold text-white">{activeJob.experienceLevel || 'Not specified'}</p>
                    </div>
                    <div className="flex flex-col items-center p-4 bg-mine-shaft-800 rounded-lg border border-slate-700/50 shadow-sm">
                      <IconCurrencyDollar size={24} className="text-yellow-400 mb-2" />
                      <p className="text-sm text-slate-400">Salary</p>
                      <p className="font-semibold text-white">{activeJob.salary || 'Not specified'}</p>
                    </div>
                    <div className="flex flex-col items-center p-4 bg-mine-shaft-800 rounded-lg border border-slate-700/50 shadow-sm">
                      <IconBolt size={24} className="text-yellow-400 mb-2" />
                      <p className="text-sm text-slate-400">Job Type</p>
                      <p className="font-semibold text-white">{activeJob.jobType || 'Full Time'}</p>
                    </div>
                  </div>

                  {activeJob.skills && activeJob.skills.length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-lg font-semibold text-yellow-400 mb-4">Required Skills</h3>
                      <div className="flex flex-wrap gap-3">
                        {activeJob.skills.map((skill, i) => (
                          <span
                            key={i}
                            className="bg-slate-800 px-3 py-2 rounded-full text-sm text-white border border-slate-600 transition-colors duration-200 hover:bg-slate-700"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeJob.description && (
                    <div className="mt-8">
                      <h3 className="text-lg font-semibold text-yellow-400 mb-4">Job Description</h3>
                      <div className="bg-mine-shaft-800 border border-slate-700/50 rounded-lg p-4">
                        <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                          {activeJob.description}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "applicants" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {allApplicants.map((applicant) => (
                    <div key={applicant.id} className="bg-mine-shaft-900 border border-slate-700 rounded-xl p-4 shadow-lg">
                      <TalentCard talent={applicant} onLike={handleLikeTalent} />
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => navigate("/talent-profile")}
                          className="flex-1 px-4 py-2 text-sm bg-yellow-400 text-black rounded-md font-semibold hover:bg-yellow-300 transition-colors shadow-md"
                        >
                          Profile
                        </button>
                        <button
                          onClick={() => openScheduleModal(applicant)}
                          className="flex-1 px-4 py-2 text-sm border border-slate-500 text-slate-300 rounded-md font-semibold hover:bg-slate-700 hover:text-white transition-colors shadow-md"
                        >
                          Schedule
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "invited" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {invitedApplicants.map((applicant) => (
                    <div key={applicant.id} className="bg-mine-shaft-900 border border-slate-700 rounded-xl p-4 shadow-lg">
                      <TalentCard talent={applicant} onLike={handleLikeTalent} />
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => navigate("/talent-profile")}
                          className="flex-1 px-4 py-2 text-sm bg-yellow-400 text-black rounded-md font-semibold hover:bg-yellow-300 transition-colors shadow-md"
                        >
                          Profile
                        </button>
                        <button
                          onClick={() => openScheduleModal(applicant)}
                          className="flex-1 px-4 py-2 text-sm border border-slate-500 text-slate-300 rounded-md font-semibold hover:bg-slate-700 hover:text-white transition-colors shadow-md"
                        >
                          Schedule
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-24 h-24 bg-mine-shaft-800 rounded-full flex items-center justify-center mb-6">
                <IconBriefcase size={48} className="text-slate-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-400 mb-2">No Jobs Found</h2>
              <p className="text-slate-500 mb-6">Start by posting your first job to attract talented candidates.</p>
              <button
                onClick={handleCreateJob}
                className="flex items-center gap-2 px-6 py-3 bg-yellow-400 text-black rounded-lg font-semibold hover:bg-yellow-300 transition-colors duration-200 shadow-md"
              >
                <IconPlus size={20} />
                Post Your First Job
              </button>
            </div>
          )}
        </main>
      </div>

      <Footer />

      {/* Job Form Modal */}
      <JobFormModal
        isOpen={showJobModal}
        onClose={handleCloseJobModal}
        onSubmit={handleJobSubmit}
        editJob={editingJob}
        isLoading={isSubmitting}
      />

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-mine-shaft-900 p-8 rounded-lg shadow-xl w-96 border border-slate-700 relative">
            <button
              onClick={closeScheduleModal}
              className="absolute top-3 right-3 text-slate-400 hover:text-white transition-colors duration-200"
            >
              <IconX size={24} />
            </button>
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">Schedule Interview</h2>
            {selectedApplicant && (
              <p className="text-slate-300 mb-4">
                Scheduling for: <span className="font-semibold">{selectedApplicant.name}</span>
              </p>
            )}
            <div className="mb-4">
              <label htmlFor="interview-date" className="block text-slate-400 text-sm font-bold mb-2">
                Date
              </label>
              <input
                type="date"
                id="interview-date"
                className="w-full p-2 rounded-md bg-mine-shaft-800 border border-slate-600 text-white focus:outline-none focus:border-yellow-400 transition-colors duration-200"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <label htmlFor="interview-time" className="block text-slate-400 text-sm font-bold mb-2">
                Time
              </label>
              <input
                type="time"
                id="interview-time"
                className="w-full p-2 rounded-md bg-mine-shaft-800 border border-slate-600 text-white focus:outline-none focus:border-yellow-400 transition-colors duration-200"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
              />
            </div>
            <button
              onClick={handleScheduleSubmit}
              className="w-full bg-yellow-400 text-black font-bold py-2 px-4 rounded-md hover:bg-yellow-300 transition-colors shadow-md"
            >
              Confirm Schedule
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostedJobPage;