import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  IconMapPin,
  IconClock,
  IconCurrencyDollar,
  IconUsers,
  IconBookmark,
  IconArrowLeft,
} from "@tabler/icons-react";
import { useJobs } from "../context/JobContext";

const JobDescPage = () => {
  const navigate = useNavigate();
  const { jobId } = useParams<{ jobId: string }>();
  const { getJobById, jobs } = useJobs();

  // Get the specific job by ID
  const job = jobId ? getJobById(jobId) : null;

  const handleApply = () => {
    if (jobId) {
      navigate(`/apply-job/${jobId}`);
    }
  };

  const handleBack = () => navigate("/find-jobs");

  // Function to format salary like in JobCards
  const formatSalary = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    }
    return `₹${(amount / 1000).toFixed(0)}K`;
  };

  // Function to get time since posting
  const getTimeSincePost = (postTime: string) => {
    const posted = new Date(postTime);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - posted.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Create company logo like in JobCards
  const getCompanyLogo = (companyName: string) => {
    if (!companyName || typeof companyName !== 'string') {
      return (
        <div className="w-16 h-16 bg-gray-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg">
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
      <div className={`w-16 h-16 ${colors[colorIndex]} rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
        {initials}
      </div>
    );
  };

  // Generate recommended jobs from available jobs
  const getRecommendedJobs = () => {
    if (!job || !jobs || jobs.length === 0) return [];
    
    // Filter out current job and get 3 random jobs
    const otherJobs = jobs.filter(j => j.id !== job.id && j.jobStatus === 'ACTIVE');
    const shuffled = otherJobs.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  };

  const recommendedJobs = getRecommendedJobs();

  // Generate some sample responsibilities and qualifications based on job data
  const generateResponsibilities = (job: any) => {
    const baseResponsibilities = [
      `Develop and maintain ${job.jobTitle.toLowerCase()} solutions`,
      "Collaborate with cross-functional teams to deliver high-quality products",
      "Participate in code reviews and maintain coding standards",
      "Troubleshoot and debug applications to optimize performance",
      "Stay updated with industry trends and best practices"
    ];
    
    if (job.skillsRequired && job.skillsRequired.length > 0) {
      baseResponsibilities.push(`Work with ${job.skillsRequired.slice(0, 3).join(', ')} and related technologies`);
    }
    
    return baseResponsibilities;
  };

  const generateQualifications = (job: any) => {
    const baseQualifications = [
      `${job.experience} of experience in ${job.jobTitle.toLowerCase()} or related field`,
      "Strong problem-solving and analytical skills",
      "Excellent communication and teamwork abilities",
      "Bachelor's degree in Computer Science, Engineering, or related field",
      "Experience working in agile development environments"
    ];
    
    if (job.skillsRequired && job.skillsRequired.length > 0) {
      baseQualifications.push(`Proficiency in ${job.skillsRequired.join(', ')}`);
    }
    
    return baseQualifications;
  };

  // Show loading if jobs are still being fetched
  if (!jobs || jobs.length === 0) {
    return (
      <div className="bg-mine-shaft-950 text-white min-h-screen">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
            <h1 className="text-xl font-bold text-yellow-400 mb-2">Loading job details...</h1>
            <p className="text-gray-400">Please wait while we fetch the job information</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error if job not found
  if (!job) {
    return (
      <div className="bg-mine-shaft-950 text-white min-h-screen">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <button
            onClick={handleBack}
            className="flex items-center gap-3 text-sm font-medium text-bright-sun-400 bg-gradient-to-r from-mine-shaft-800 to-mine-shaft-700 px-6 py-3 rounded-xl hover:from-mine-shaft-700 hover:to-mine-shaft-600 transition-all duration-300 border border-mine-shaft-600 shadow-lg hover:shadow-bright-sun-400/20 mb-8 group"
          >
            <IconArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Back to Jobs
          </button>
          <div className="text-center py-20">
            <h1 className="text-2xl font-bold text-red-400 mb-4">Job Not Found</h1>
            <p className="text-gray-400 mb-4">
              The job you're looking for doesn't exist or has been removed.
            </p>
            <p className="text-gray-500 text-sm">Job ID: {jobId}</p>
            <button
              onClick={handleBack}
              className="mt-6 bg-gradient-to-r from-bright-sun-400 to-yellow-500 text-black px-6 py-3 rounded-xl font-semibold hover:from-yellow-300 hover:to-yellow-400 transition-all duration-300"
            >
              Browse All Jobs
            </button>
          </div>
        </div>
        
      </div>
    );
  }

  const responsibilities = generateResponsibilities(job);
  const qualifications = generateQualifications(job);

  return (
    <div className="bg-mine-shaft-950 text-white min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center gap-3 text-sm font-medium text-bright-sun-400 bg-gradient-to-r from-mine-shaft-800 to-mine-shaft-700 px-6 py-3 rounded-xl hover:from-mine-shaft-700 hover:to-mine-shaft-600 transition-all duration-300 border border-mine-shaft-600 shadow-lg hover:shadow-bright-sun-400/20 mb-8 group"
        >
          <IconArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Jobs
        </button>

        {/* Main Job Info Card */}
        <div className="bg-gradient-to-br from-mine-shaft-800 to-mine-shaft-900 rounded-2xl border border-mine-shaft-700 p-8 mb-12 shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6 mb-8">
            <div className="flex items-center gap-6">
              {job.companyLogo && job.companyLogo.startsWith('http') ? (
                <div className="w-16 h-16 bg-mine-shaft-700 rounded-2xl flex items-center justify-center p-2 shadow-lg">
                  <img 
                    src={job.companyLogo} 
                    alt={job.company} 
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        parent.innerHTML = '';
                        parent.appendChild(getCompanyLogo(job.company));
                      }
                    }}
                  />
                </div>
              ) : (
                getCompanyLogo(job.company)
              )}
              <div>
                <h1 className="text-3xl font-bold text-bright-sun-400 mb-2 leading-tight">
                  {job.jobTitle}
                </h1>
                <p className="text-lg text-gray-300 font-medium">{job.company}</p>
              </div>
            </div>
            <IconBookmark 
              className="text-bright-sun-400 cursor-pointer hover:text-yellow-300 transition-colors hover:scale-110" 
              size={26} 
            />
          </div>

          {/* Job Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            <div className="flex items-center gap-3 text-gray-300 bg-mine-shaft-700/50 p-4 rounded-xl border border-mine-shaft-600">
              <IconMapPin size={20} className="text-bright-sun-400" />
              <span className="font-medium">{job.location}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300 bg-mine-shaft-700/50 p-4 rounded-xl border border-mine-shaft-600">
              <IconClock size={20} className="text-bright-sun-400" />
              <span className="font-medium">{job.experience}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300 bg-mine-shaft-700/50 p-4 rounded-xl border border-mine-shaft-600">
              <IconCurrencyDollar size={20} className="text-bright-sun-400" />
              <span className="font-medium">{formatSalary(job.packageOffered)}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300 bg-mine-shaft-700/50 p-4 rounded-xl border border-mine-shaft-600">
              <IconUsers size={20} className="text-bright-sun-400" />
              <span className="font-medium">{job.jobType}</span>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-6 border-t border-mine-shaft-600">
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span className="bg-mine-shaft-700/60 px-3 py-1.5 rounded-full">
                Posted {getTimeSincePost(job.postTime)} days ago
              </span>
              <span className="bg-emerald-400/10 text-emerald-400 px-3 py-1.5 rounded-full font-medium">
                {job.applicants} applicants
              </span>
            </div>
            <button
              onClick={handleApply}
              className="bg-gradient-to-r from-bright-sun-400 to-yellow-500 text-black px-8 py-3 rounded-xl text-sm font-bold hover:from-yellow-300 hover:to-yellow-400 transition-all duration-300 shadow-lg hover:shadow-bright-sun-400/30 transform hover:scale-105"
            >
              Apply Now
            </button>
          </div>
        </div>

        {/* Skills Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-bright-sun-400 mb-6">
            Required Skills
          </h2>
          <div className="flex flex-wrap gap-3">
            {job.skillsRequired && job.skillsRequired.map((skill: string, index: number) => (
              <span
                key={index}
                className="bg-gradient-to-r from-mine-shaft-700 to-mine-shaft-800 border border-mine-shaft-600 px-4 py-2 text-sm rounded-xl text-bright-sun-400 font-medium hover:from-mine-shaft-600 hover:to-mine-shaft-700 transition-all duration-200 shadow-md"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Recommended Jobs */}
        {recommendedJobs.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-bright-sun-400 mb-6">
              Recommended Jobs
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedJobs.map((recJob) => (
                <div
                  key={recJob.id}
                  onClick={() => navigate(`/jobs/${recJob.id}`)}
                  className="bg-gradient-to-br from-mine-shaft-800 to-mine-shaft-900 hover:from-mine-shaft-700 hover:to-mine-shaft-800 p-6 rounded-2xl cursor-pointer transition-all duration-300 border border-mine-shaft-600 hover:border-bright-sun-400/50 shadow-lg hover:shadow-bright-sun-400/20 transform hover:scale-105 group"
                >
                  <div className="flex items-center gap-4 mb-3">
                    {recJob.companyLogo && recJob.companyLogo.startsWith('http') ? (
                      <div className="w-12 h-12 bg-mine-shaft-700 rounded-xl flex items-center justify-center p-1 group-hover:bg-mine-shaft-600 transition-colors">
                        <img src={recJob.companyLogo} alt={recJob.company} className="w-full h-full object-contain" />
                      </div>
                    ) : (
                      <div className={`w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white font-bold text-sm group-hover:bg-blue-400 transition-colors`}>
                        {recJob.company.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h3 className="text-base font-bold text-bright-sun-400 group-hover:text-yellow-300 transition-colors">
                        {recJob.jobTitle}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {recJob.company} • {recJob.experience}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 bg-mine-shaft-700/50 px-3 py-1 rounded-lg inline-block">
                    {recJob.location}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Detailed Information */}
        <div className="bg-gradient-to-br from-mine-shaft-900 to-mine-shaft-950 p-8 rounded-2xl border border-mine-shaft-700 shadow-2xl space-y-8 mb-12">
          <div>
            <h3 className="text-2xl font-bold text-bright-sun-400 mb-4">
              Job Description
            </h3>
            <p className="text-base text-gray-300 leading-relaxed bg-mine-shaft-800/50 p-6 rounded-xl border border-mine-shaft-600">
              {job.description}
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-bright-sun-400 mb-4">
              Key Responsibilities
            </h3>
            <ul className="space-y-3">
              {responsibilities.map((res: string, idx: number) => (
                <li key={idx} className="flex items-start gap-3 text-gray-300">
                  <span className="w-2 h-2 bg-bright-sun-400 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-base leading-relaxed">{res}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-bright-sun-400 mb-4">
              Qualifications & Requirements
            </h3>
            <ul className="space-y-3">
              {qualifications.map((qual: string, idx: number) => (
                <li key={idx} className="flex items-start gap-3 text-gray-300">
                  <span className="w-2 h-2 bg-bright-sun-400 rounded-full mt-2 flex-shrink-0"></span>
                  <span className="text-base leading-relaxed">{qual}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-bright-sun-400 mb-4">
              About the Company
            </h3>
            <p className="text-base text-gray-300 leading-relaxed bg-mine-shaft-800/50 p-6 rounded-xl border border-mine-shaft-600 mb-4">
              {job.company} is a dynamic company looking for talented professionals to join our team. 
              We offer a collaborative work environment with opportunities for growth and development. 
              Join us to work on exciting projects and advance your career.
            </p>
            <button
              onClick={() => navigate("/company")}
              className="bg-gradient-to-r from-bright-sun-400 to-yellow-400 text-black font-semibold px-6 py-2 rounded-xl text-sm hover:from-yellow-300 hover:to-yellow-400 transition-all duration-300 shadow-lg hover:shadow-bright-sun-400/30 transform hover:scale-105"
            >
              Visit Company Page
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default JobDescPage;