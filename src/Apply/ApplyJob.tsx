import { useNavigate, useParams } from "react-router-dom";
import { IconArrowLeft, IconUpload, IconCheck, IconAlertTriangle } from "@tabler/icons-react";
import { RingLoader } from "react-spinners";
import React, { useEffect, useState } from "react";
import { Job } from "../Pages/FindJob";

const ApplyJob = () => {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [jobData, setJobData] = useState<Job | null>(null);
  const [jobLoading, setJobLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    website: "",
    cv: null,
    coverLetter: "",
  });

  // Enhanced job fetching with better error handling
  useEffect(() => {
    const fetchJobData = async () => {
      if (!jobId) {
        setError("No job ID provided");
        setJobLoading(false);
        return;
      }

      try {
        setJobLoading(true);
        setError(null);

        // Try multiple API endpoints similar to FindJob component
        const possibleUrls = [
          `http://localhost:8080/jobs/${jobId}`,
          `/api/jobs/${jobId}`,
          `/jobs/${jobId}`,
          `http://localhost:8080/api/jobs/${jobId}`
        ];

        let response;
        let success = false;

        for (const url of possibleUrls) {
          try {
            response = await fetch(url);
            if (response.ok) {
              const contentType = response.headers.get('content-type');
              if (contentType && contentType.includes('application/json')) {
                const job = await response.json();
                setJobData(job);
                success = true;
                console.log(`Successfully fetched job from ${url}`);
                break;
              }
            }
          } catch (err) {
            console.log(`Failed to fetch from ${url}:`, (err as Error).message);
            continue;
          }
        }

        if (!success) {
          // Try to find job in mock data (for development)
          const mockJob = findJobInMockData(parseInt(jobId));
          if (mockJob) {
            setJobData(mockJob);
            console.log('Using mock data for job', jobId);
          } else {
            setError("Job not found");
          }
        }

      } catch (error) {
        console.error('Error fetching job data:', error);
        setError("Failed to load job data");
      } finally {
        setJobLoading(false);
      }
    };

    fetchJobData();
  }, [jobId]);

  // Mock data finder (should match the mock data from FindJob)
  const findJobInMockData = (id: number): Job | null => {
    const mockJobs = [
      {
        id: 1,
        jobTitle: "Frontend Developer",
        company: "TechCorp",
        companyLogo: "https://via.placeholder.com/40x40/facc15/000000?text=TC",
        location: "Mumbai, Maharashtra",
        jobType: "Full-time",
        experience: "2-4 years",
        packageOffered: 800000,
        description: "We are looking for a skilled Frontend Developer to join our dynamic team. You will be responsible for building user-friendly web applications using modern technologies.",
        skillsRequired: ["React", "JavaScript", "TypeScript", "CSS"],
        applicants: 25,
        postTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        jobStatus: "ACTIVE"
      },
      {
        id: 2,
        jobTitle: "Backend Developer",
        company: "DataSoft",
        companyLogo: "https://via.placeholder.com/40x40/facc15/000000?text=DS",
        location: "Pune, Maharashtra",
        jobType: "Full-time",
        experience: "3-5 years",
        packageOffered: 1200000,
        description: "Join our backend team to build scalable APIs and microservices. Experience with Java and Spring Boot required.",
        skillsRequired: ["Java", "Spring Boot", "MongoDB", "REST API"],
        applicants: 18,
        postTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        jobStatus: "ACTIVE"
      },
      // Add other mock jobs as needed...
    ];

    return mockJobs.find(job => job.id === id) || null;
  };

  const handleChange = (e: any) => {
    const { name, value, files } = e.target;
    setForm({ ...form, [name]: files ? files[0] : value });
  };

  const handleSubmit = () => {
    setLoading(true);
  };

  useEffect(() => {
    if (loading && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (loading && countdown === 0) {
      navigate("/find-jobs");
    }
  }, [loading, countdown, navigate]);

  const getCompanyLogo = (companyName: string) => {
    if (!companyName || typeof companyName !== 'string') {
      return (
        <div className="w-16 h-16 bg-gray-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
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

  const getTimeSincePost = (postTime: string) => {
    const posted = new Date(postTime);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - posted.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatSalary = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    }
    return `₹${(amount / 1000).toFixed(0)}K`;
  };

  // Loading state
  if (jobLoading) {
    return (
      <div className="bg-mine-shaft-950 text-white min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <RingLoader color="#facc15" size={60} />
          <p className="text-gray-400 text-sm">Loading job details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !jobData) {
    return (
      <div className="bg-mine-shaft-950 text-white min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <IconAlertTriangle size={64} className="text-yellow-400 mx-auto" />
          <h2 className="text-3xl font-bold text-bright-sun-400">
            {error === "Job not found" ? "Job Not Found" : "Something Went Wrong"}
          </h2>
          <p className="text-gray-400 text-sm max-w-md">
            {error === "Job not found" 
              ? "The job you're trying to access may have been removed or does not exist."
              : error || "Unable to load job details. Please try again later."
            }
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/find-jobs')}
              className="bg-gradient-to-r from-bright-sun-400 to-yellow-500 text-black px-6 py-3 rounded-xl font-semibold hover:from-yellow-300 hover:to-yellow-400 transition-all duration-300"
            >
              ⬅️ Back to Job Listings
            </button>
            <button
              onClick={() => window.location.reload()}
              className="bg-mine-shaft-800 text-white px-6 py-3 rounded-xl font-semibold hover:bg-mine-shaft-700 transition-all duration-300 border border-mine-shaft-600"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-mine-shaft-950 text-white min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-12">
        
        {/* Back Button */}
        <button
          onClick={() => navigate("/find-jobs")}
          className="flex items-center gap-3 text-sm font-medium text-bright-sun-400 bg-gradient-to-r from-mine-shaft-800 to-mine-shaft-700 px-6 py-3 rounded-xl hover:from-mine-shaft-700 hover:to-mine-shaft-600 transition-all duration-300 border border-mine-shaft-600 shadow-lg hover:shadow-bright-sun-400/20 mb-8 group"
        >
          <IconArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Back to Jobs
        </button>

        {/* Job Info Card */}
        <div className="bg-gradient-to-br from-mine-shaft-800 to-mine-shaft-900 p-8 rounded-2xl shadow-2xl mb-10 border border-mine-shaft-700">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Dynamic Logo */}
            {jobData.companyLogo && jobData.companyLogo.startsWith('http') ? (
              <div className="w-16 h-16 bg-mine-shaft-700 rounded-2xl flex items-center justify-center p-2 shadow-lg">
                <img
                  src={jobData.companyLogo}
                  alt={jobData.company}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const logoElement = getCompanyLogo(jobData.company);
                    target.parentElement!.innerHTML = logoElement.props.children;
                  }}
                />
              </div>
            ) : (
              getCompanyLogo(jobData.company)
            )}
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-bright-sun-400 mb-2">
                {jobData.jobTitle}
              </h1>
              <p className="text-lg text-gray-300 font-medium">{jobData.company}</p>
              <div className="flex flex-wrap gap-3 mt-3">
                <p className="text-sm text-gray-400 bg-mine-shaft-700/50 px-3 py-1 rounded-full">
                  Posted {getTimeSincePost(jobData.postTime)} days ago
                </p>
                <p className="text-sm text-bright-sun-400 bg-bright-sun-400/10 px-3 py-1 rounded-full font-medium">
                  {formatSalary(jobData.packageOffered)}
                </p>
                <p className="text-sm text-gray-400 bg-mine-shaft-700/50 px-3 py-1 rounded-full">
                  {jobData.location}
                </p>
                <p className="text-sm text-gray-400 bg-mine-shaft-700/50 px-3 py-1 rounded-full">
                  {jobData.jobType}
                </p>
              </div>
              
              {/* Skills */}
              {jobData.skillsRequired && jobData.skillsRequired.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {jobData.skillsRequired.slice(0, 5).map((skill, index) => (
                    <span key={index} className="bg-bright-sun-400/10 text-bright-sun-400 px-2 py-1 rounded-full text-xs border border-bright-sun-400/20">
                      {skill}
                    </span>
                  ))}
                  {jobData.skillsRequired.length > 5 && (
                    <span className="text-gray-400 text-xs px-2 py-1">
                      +{jobData.skillsRequired.length - 5} more
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Job Description */}
          {jobData.description && (
            <div className="mt-6 pt-6 border-t border-mine-shaft-700">
              <h3 className="text-lg font-semibold text-bright-sun-400 mb-3">About this role</h3>
              <p className="text-gray-300 text-sm leading-relaxed">{jobData.description}</p>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-mine-shaft-700 mb-10 opacity-50" />

        {/* Application Form */}
        <div className="bg-gradient-to-br from-mine-shaft-900 to-mine-shaft-950 p-8 rounded-2xl shadow-2xl border border-mine-shaft-700">
          <h2 className="text-2xl font-bold text-bright-sun-400 mb-8 flex items-center gap-3">
            Submit Your Application
          </h2>

          {loading ? (
            <div className="flex flex-col items-center justify-center gap-6 py-16">
              <RingLoader color="#facc15" size={100} />
              <div className="text-center">
                <p className="text-bright-sun-400 font-bold text-lg mb-2">
                  Sending Application...
                </p>
                <p className="text-gray-300 text-sm">
                  Redirecting in {countdown} seconds
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-bright-sun-400 mb-6">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { label: "Full Name", name: "name", type: "text", required: true },
                    { label: "Phone Number", name: "phone", type: "tel", required: true },
                    { label: "Email Address", name: "email", type: "email", required: true },
                    { label: "Personal Website", name: "website", type: "url", required: false },
                  ].map((input) => (
                    <div className="flex flex-col gap-2" key={input.name}>
                      <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                        {input.label}
                        {input.required && <span className="text-red-400">*</span>}
                      </label>
                      <input
                        name={input.name}
                        type={input.type}
                        value={(form as any)[input.name]}
                        onChange={handleChange}
                        placeholder={`Enter your ${input.label.toLowerCase()}`}
                        className="bg-mine-shaft-800 px-4 py-3 rounded-xl text-sm text-white placeholder-gray-500 border border-mine-shaft-600 focus:outline-none focus:ring-2 focus:ring-bright-sun-400 focus:border-bright-sun-400 transition-all duration-200"
                        required={input.required}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* CV Upload */}
              <div>
                <h3 className="text-lg font-semibold text-bright-sun-400 mb-6">
                  Resume/CV
                </h3>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                    Attach Your CV (PDF only)
                    <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      name="cv"
                      type="file"
                      accept=".pdf"
                      onChange={handleChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      required
                    />
                    <div className="bg-mine-shaft-800 border-2 border-dashed border-mine-shaft-600 hover:border-bright-sun-400 px-6 py-8 rounded-xl transition-all duration-200 flex flex-col items-center gap-4 hover:bg-mine-shaft-700/50">
                      <IconUpload size={32} className="text-bright-sun-400" />
                      <div className="text-center">
                        <p className="text-gray-300 font-medium">
                          {form.cv ? (form.cv as any).name : "Choose file or drag and drop"}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          PDF files only, max 10MB
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cover Letter */}
              <div>
                <h3 className="text-lg font-semibold text-bright-sun-400 mb-6">
                  Cover Letter
                </h3>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-300">
                    Tell us why you're perfect for this role
                  </label>
                  <textarea
                    name="coverLetter"
                    rows={8}
                    value={form.coverLetter}
                    onChange={handleChange}
                    placeholder={`Share your passion for ${jobData.jobTitle}, relevant experience, and what makes you the ideal candidate for this position at ${jobData.company}...`}
                    className="bg-mine-shaft-800 px-4 py-3 rounded-xl text-sm text-white placeholder-gray-500 border border-mine-shaft-600 resize-none focus:outline-none focus:ring-2 focus:ring-bright-sun-400 focus:border-bright-sun-400 transition-all duration-200"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {form.coverLetter.length} characters
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-mine-shaft-700">
                <p className="text-sm text-gray-400">
                  <span className="text-red-400">*</span> Required fields
                </p>
                <div className="flex gap-4">
                  <button
                    type="button"
                    className="bg-transparent border-2 border-bright-sun-400 text-bright-sun-400 hover:bg-bright-sun-400 hover:text-black px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-105"
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  >
                    Review Application
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="bg-gradient-to-r from-bright-sun-400 to-yellow-500 text-black px-8 py-3 rounded-xl text-sm font-bold hover:from-yellow-300 hover:to-yellow-400 transition-all duration-200 shadow-lg hover:shadow-bright-sun-400/30 transform hover:scale-105 flex items-center gap-2"
                  >
                    <IconCheck size={16} />
                    Submit Application
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplyJob;