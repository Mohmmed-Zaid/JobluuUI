// src/types/JobDTO.ts or src/interfaces/JobDTO.ts

// Backend JobDTO interface to match your Spring Boot backend
export interface JobDTO {
  id?: number;
  jobTitle: string;        // Changed from 'title'
  description: string;
  location: string;
  company: string;         // Changed from 'companyName'
  packageOffered: string;  // Changed from 'salary'
  jobType: string;
  exprience: string;       // Changed from 'experienceLevel' (note: typo in backend)
  skillsRequired: string[]; // Changed from 'skills'
  status?: 'active' | 'draft'; // This might not exist in backend
  companyLogo?: string;    // Changed from 'logoUrl'
  daysAgo?: number;
  postTime?: string;       // Added to match backend
}

// Frontend interface for form handling (what your components use)
export interface FrontendJobDTO {
  id?: number;
  title: string;
  description: string;
  location: string;
  companyName: string;
  salary: string;
  jobType: string;
  experienceLevel: string;
  skills: string[];
  status: 'active' | 'draft';
  logoUrl?: string;
  daysAgo?: number;
  postTime?: string;
}

// Helper function to convert frontend form data to backend format
export const convertToBackendFormat = (frontendJob: FrontendJobDTO): JobDTO => {
  return {
    id: frontendJob.id,
    jobTitle: frontendJob.title,
    description: frontendJob.description,
    location: frontendJob.location,
    company: frontendJob.companyName,
    packageOffered: frontendJob.salary,
    jobType: frontendJob.jobType,
    exprience: frontendJob.experienceLevel,
    skillsRequired: frontendJob.skills || [],
    companyLogo: frontendJob.logoUrl,
    postTime: frontendJob.postTime
  };
};

// Helper function to convert backend data to frontend format
export const convertToFrontendFormat = (backendJob: JobDTO): FrontendJobDTO => {
  return {
    id: backendJob.id,
    title: backendJob.jobTitle,
    description: backendJob.description,
    location: backendJob.location,
    companyName: backendJob.company,
    salary: backendJob.packageOffered,
    jobType: backendJob.jobType,
    experienceLevel: backendJob.exprience,
    skills: backendJob.skillsRequired || [],
    status: backendJob.status || 'active', // Default status since backend might not have this
    logoUrl: backendJob.companyLogo,
    daysAgo: backendJob.daysAgo,
    postTime: backendJob.postTime
  };
};