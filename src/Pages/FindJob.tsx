import React, { useState, useEffect } from "react";
import Header from "../Header/Header";
import Footer from "../footer/Footer";
import SearchBar from "../FindJobs/SearchBar";
import Jobs from "../FindJobs/Jobs";
import { useJobs } from '../context/JobContext'; // Import the context

export interface JobFilters {
  searchQuery: string;
  location: string;
  jobType: string;
  experience: string;
  salaryRange: [number, number];
  company: string;
  skills: string[];
}

export interface Job {
  id: number;
  jobTitle: string;
  company: string;
  companyLogo: string;
  location: string;
  jobType: string;
  experience: string;
  packageOffered: number;
  description: string;
  skillsRequired: string[];
  applicants: number;
  postTime: string;
  jobStatus: string;
}

const FindJob = () => {
  // Use the JobContext
  const { jobs, setJobs, loading, setLoading } = useJobs();
  
  // API Configuration - Update this with your backend URL
  const API_BASE_URL = 'http://localhost:8080';
  
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<JobFilters>({
    searchQuery: "",
    location: "",
    jobType: "",
    experience: "",
    salaryRange: [0, 100],
    company: "",
    skills: []
  });

  // Transform backend job data to frontend format
  const transformJobData = (backendJob: any): Job => {
    return {
      id: backendJob.id,
      jobTitle: backendJob.title || backendJob.jobTitle || 'Software Developer',
      company: backendJob.companyName || backendJob.company || 'Tech Company',
      companyLogo: backendJob.logoUrl || backendJob.companyLogo || `https://via.placeholder.com/40x40/facc15/000000?text=${(backendJob.companyName || 'TC').charAt(0)}`,
      location: backendJob.location || 'India',
      jobType: backendJob.jobType || 'Full-time',
      experience: backendJob.experienceLevel || backendJob.experience || '1-3 years',
      packageOffered: backendJob.salary ? (
        typeof backendJob.salary === 'string' 
          ? parseInt(backendJob.salary.replace(/[^\d]/g, '')) * 1000 
          : backendJob.salary
      ) : Math.floor(Math.random() * 1000000) + 500000,
      description: backendJob.description || 'We are looking for a talented professional to join our team.',
      skillsRequired: backendJob.skills || backendJob.skillsRequired || ['JavaScript', 'React', 'Node.js'],
      applicants: backendJob.applicants || Math.floor(Math.random() * 50) + 1,
      postTime: backendJob.createdAt || backendJob.postTime || new Date().toISOString(),
      jobStatus: backendJob.status ? backendJob.status.toUpperCase() : 'ACTIVE'
    };
  };

  // Generate comprehensive mock jobs to ensure we always have 12+ jobs
  const generateMockJobs = (): Job[] => {
    const companies = [
      { name: "TechCorp", logo: "https://via.placeholder.com/40x40/3b82f6/ffffff?text=TC" },
      { name: "DataSoft", logo: "https://via.placeholder.com/40x40/ef4444/ffffff?text=DS" },
      { name: "Innovation Labs", logo: "https://via.placeholder.com/40x40/10b981/ffffff?text=IL" },
      { name: "CloudTech", logo: "https://via.placeholder.com/40x40/8b5cf6/ffffff?text=CT" },
      { name: "DesignStudio", logo: "https://via.placeholder.com/40x40/f59e0b/ffffff?text=DS" },
      { name: "AI Solutions", logo: "https://via.placeholder.com/40x40/06b6d4/ffffff?text=AI" },
      { name: "WebCrafters", logo: "https://via.placeholder.com/40x40/ec4899/ffffff?text=WC" },
      { name: "MobileTech", logo: "https://via.placeholder.com/40x40/14b8a6/ffffff?text=MT" },
      { name: "CyberSecure", logo: "https://via.placeholder.com/40x40/f97316/ffffff?text=CS" },
      { name: "GameDev Studio", logo: "https://via.placeholder.com/40x40/84cc16/ffffff?text=GD" },
      { name: "FinTech Plus", logo: "https://via.placeholder.com/40x40/6366f1/ffffff?text=FT" },
      { name: "HealthTech", logo: "https://via.placeholder.com/40x40/dc2626/ffffff?text=HT" },
    ];

    const jobTitles = [
      "Frontend Developer", "Backend Developer", "Full Stack Developer", 
      "UI/UX Designer", "DevOps Engineer", "Data Scientist", 
      "Mobile App Developer", "Software Engineer", "Product Manager",
      "QA Engineer", "Cybersecurity Specialist", "Game Developer"
    ];

    const locations = [
      "Mumbai, Maharashtra", "Pune, Maharashtra", "Bangalore, Karnataka",
      "Hyderabad, Telangana", "Chennai, Tamil Nadu", "Delhi, NCR",
      "Gurgaon, Haryana", "Noida, UP", "Ahmedabad, Gujarat",
      "Kolkata, West Bengal", "Jaipur, Rajasthan", "Kochi, Kerala"
    ];

    const skillSets = [
      ["React", "JavaScript", "TypeScript", "CSS"],
      ["Java", "Spring Boot", "MongoDB", "REST API"],
      ["Python", "Django", "PostgreSQL", "Docker"],
      ["React Native", "Flutter", "iOS", "Android"],
      ["AWS", "Docker", "Kubernetes", "Jenkins"],
      ["Python", "Machine Learning", "TensorFlow", "SQL"],
      ["Figma", "Adobe XD", "Photoshop", "User Research"],
      ["Node.js", "Express", "MongoDB", "GraphQL"],
      ["Vue.js", "Nuxt.js", "Firebase", "Tailwind CSS"],
      ["C#", ".NET Core", "Azure", "SQL Server"],
      ["PHP", "Laravel", "MySQL", "Redis"],
      ["Go", "Gin", "PostgreSQL", "Microservices"]
    ];

    const experiences = ["0-1 years", "1-2 years", "2-4 years", "3-5 years", "5+ years"];
    const jobTypes = ["Full-time", "Part-time", "Contract", "Remote"];

    return Array.from({ length: 15 }, (_, index) => {
      const company = companies[index % companies.length];
      const jobTitle = jobTitles[index % jobTitles.length];
      const location = locations[index % locations.length];
      const skills = skillSets[index % skillSets.length];
      
      return {
        id: 1000 + index, // Use high IDs to avoid conflicts with backend
        jobTitle,
        company: company.name,
        companyLogo: company.logo,
        location,
        jobType: jobTypes[index % jobTypes.length],
        experience: experiences[index % experiences.length],
        packageOffered: (Math.floor(Math.random() * 15) + 5) * 100000, // 5L to 20L
        description: `We are looking for a skilled ${jobTitle} to join our dynamic team at ${company.name}. You will work on cutting-edge projects and collaborate with talented professionals to deliver exceptional solutions.`,
        skillsRequired: skills,
        applicants: Math.floor(Math.random() * 100) + 1,
        postTime: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000).toISOString(),
        jobStatus: Math.random() > 0.1 ? "ACTIVE" : "CLOSED"
      };
    });
  };

  // Fetch jobs from API with retry logic
  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Try different possible API endpoints
      const possibleUrls = [
        `${API_BASE_URL}/jobs/getAll`,
        `/api/jobs/getAll`,
        `/jobs/getAll`,
        `${API_BASE_URL}/api/jobs/getAll`
      ];

      let backendJobs: Job[] = [];
      let success = false;

      // Try to fetch from backend
      for (const url of possibleUrls) {
        try {
          const response = await fetch(url);
          if (response.ok) {
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
              const data = await response.json();
              backendJobs = data.map(transformJobData);
              success = true;
              console.log(`Successfully fetched ${backendJobs.length} jobs from ${url}`);
              break;
            }
          }
        } catch (err) {
          console.log(`Failed to fetch from ${url}:`, (err as Error).message);
          continue;
        }
      }

      // Always generate mock jobs and merge with backend jobs
      const mockJobs = generateMockJobs();
      let allJobs: Job[] = [];

      if (success && backendJobs.length > 0) {
        // Merge backend jobs with mock jobs, giving priority to backend jobs
        const backendJobIds = new Set(backendJobs.map(job => job.id));
        const filteredMockJobs = mockJobs.filter(job => !backendJobIds.has(job.id));
        allJobs = [...backendJobs, ...filteredMockJobs];
        console.log(`Total jobs: ${allJobs.length} (${backendJobs.length} from backend, ${filteredMockJobs.length} mock)`);
      } else {
        // Use only mock jobs if backend is unavailable
        allJobs = mockJobs;
        console.log(`Using ${allJobs.length} mock jobs (backend unavailable)`);
      }

      // Ensure we have at least 12 jobs
      if (allJobs.length < 12) {
        const additionalMockJobs = generateMockJobs().slice(allJobs.length, 12);
        allJobs = [...allJobs, ...additionalMockJobs];
      }

      // Update both local state and context
      setJobs(allJobs); // This updates the JobContext
      setFilteredJobs(allJobs);

    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError('Failed to load jobs. Showing sample jobs.');
      // Fallback to mock data
      const mockJobs = generateMockJobs();
      setJobs(mockJobs); // Update context
      setFilteredJobs(mockJobs);
    } finally {
      setLoading(false);
    }
  };

  // Set up periodic refresh to catch new jobs from backend
  useEffect(() => {
    fetchJobs();
    
    // Refresh jobs every 5 minutes to catch new posts
    const interval = setInterval(fetchJobs, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Filter jobs based on current filters
  const filterJobs = () => {
    let filtered = [...jobs]; // Use jobs from context

    // Search query filter
    if (filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(job =>
        job.jobTitle.toLowerCase().includes(query) ||
        job.company.toLowerCase().includes(query) ||
        job.description.toLowerCase().includes(query) ||
        job.skillsRequired.some(skill => skill.toLowerCase().includes(query))
      );
    }

    // Location filter
    if (filters.location) {
      filtered = filtered.filter(job =>
        job.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Job type filter
    if (filters.jobType) {
      filtered = filtered.filter(job =>
        job.jobType.toLowerCase() === filters.jobType.toLowerCase()
      );
    }

    // Experience filter
    if (filters.experience) {
      filtered = filtered.filter(job =>
        job.experience.toLowerCase().includes(filters.experience.toLowerCase())
      );
    }

    // Company filter
    if (filters.company) {
      filtered = filtered.filter(job =>
        job.company.toLowerCase().includes(filters.company.toLowerCase())
      );
    }

    // Salary range filter (convert to lakhs for comparison)
    filtered = filtered.filter(job => {
      const salary = job.packageOffered / 100000; // Convert to lakhs
      return salary >= filters.salaryRange[0] && salary <= filters.salaryRange[1];
    });

    // Skills filter
    if (filters.skills.length > 0) {
      filtered = filtered.filter(job =>
        filters.skills.some(skill =>
          job.skillsRequired.some(jobSkill =>
            jobSkill.toLowerCase().includes(skill.toLowerCase())
          )
        )
      );
    }

    // Only show active jobs
    filtered = filtered.filter(job => job.jobStatus === 'ACTIVE');

    setFilteredJobs(filtered);
  };

  // Update filters
  const updateFilters = (newFilters: Partial<JobFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      searchQuery: "",
      location: "",
      jobType: "",
      experience: "",
      salaryRange: [0, 100],
      company: "",
      skills: []
    });
  };

  // Apply filters when filters or jobs change
  useEffect(() => {
    filterJobs();
  }, [filters, jobs]); // Add jobs dependency

  return (
    <div className="min-h-[100vh] bg-mine-shaft-950 font-poppins">
      <Header />
      
      {/* Error Display */}
      {error && (
        <div className="mx-4 mt-4 p-3 bg-yellow-900/30 border border-yellow-400/50 rounded-lg text-yellow-200 text-sm">
          {error}
        </div>
      )}

      <SearchBar 
        filters={filters}
        updateFilters={updateFilters}
        clearFilters={clearFilters}
        jobCount={filteredJobs.length}
      />
      
      <Jobs 
        jobs={filteredJobs}
        loading={loading}  
        filters={filters}
        updateFilters={updateFilters}
      />
      
      <Footer />
    </div>
  );
};

export default FindJob;