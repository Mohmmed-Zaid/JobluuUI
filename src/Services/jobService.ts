// Services/jobService.ts - Fixed version with authentication
export interface FrontendJobDTO {
  id?: number;
  title: string;
  description: string;
  location: string;
  companyName: string;
  salary?: string;
  jobType: string;
  experienceLevel: string;
  skills: string[];
  status: 'active' | 'draft';
  logoUrl?: string;
  daysAgo?: number;
}

export interface BackendJobDTO {
  id?: number;
  jobTitle: string;
  description: string;
  location: string;
  company: string;
  packageOffered?: string;
  jobType: string;
  exprience: string; // Note: typo in backend
  skillsRequired: string[];
  companyLogo?: string;
  postTime?: string;
  daysAgo?: number;
}

// Helper functions for field mapping
const mapToBackend = (frontendJob: FrontendJobDTO): BackendJobDTO => {
  return {
    id: frontendJob.id,
    jobTitle: frontendJob.title,
    description: frontendJob.description,
    location: frontendJob.location,
    company: frontendJob.companyName,
    packageOffered: frontendJob.salary,
    jobType: frontendJob.jobType,
    exprience: frontendJob.experienceLevel,
    skillsRequired: frontendJob.skills,
    companyLogo: frontendJob.logoUrl,
  };
};

const mapToFrontend = (backendJob: BackendJobDTO): FrontendJobDTO => {
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
    status: 'active', // Default since backend doesn't have this
    logoUrl: backendJob.companyLogo,
    daysAgo: backendJob.daysAgo,
  };
};

const getApiBaseUrl = () => {
  if (typeof window !== 'undefined' && (window as any).REACT_APP_API_BASE_URL) {
    return (window as any).REACT_APP_API_BASE_URL;
  }
  return 'http://localhost:8080';
};

class JobService {
  private baseUrl = `${getApiBaseUrl()}/jobs`;

  // Get authentication headers
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }

  // Check if user is authenticated
  private isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  // Handle authentication errors
  private handleAuthError(response: Response): void {
    if (response.status === 401 || response.status === 403) {
      // Clear invalid token
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      
      // Redirect to login page
      window.location.href = '/login';
      throw new Error('Authentication expired. Please login again.');
    }
  }

  async getAllJobs(): Promise<FrontendJobDTO[]> {
    try {
      // Check authentication before making request
      if (!this.isAuthenticated()) {
        throw new Error('Please login to view jobs');
      }

      const response = await fetch(`${this.baseUrl}/getAll`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
        credentials: 'include', // Include cookies if needed
      });

      // Handle authentication errors
      this.handleAuthError(response);

      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: `HTTP ${response.status}: ${response.statusText}` };
        }
        throw new Error(errorData.error || errorData.message || `Failed to fetch jobs: ${response.status}`);
      }

      const backendJobs: BackendJobDTO[] = await response.json();
      return backendJobs.map(mapToFrontend);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to fetch jobs. Please try again.');
    }
  }

  async postJob(jobData: FrontendJobDTO): Promise<FrontendJobDTO> {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Please login to post jobs');
      }

      const backendJobData = mapToBackend(jobData);
      
      const response = await fetch(`${this.baseUrl}/post`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(backendJobData),
      });

      // Handle authentication errors
      this.handleAuthError(response);

      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: `HTTP ${response.status}: ${response.statusText}` };
        }
        throw new Error(errorData.error || errorData.message || `Failed to create job: ${response.status}`);
      }

      const createdBackendJob: BackendJobDTO = await response.json();
      return mapToFrontend(createdBackendJob);
    } catch (error) {
      console.error('Error creating job:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to create job. Please try again.');
    }
  }

  async updateJob(jobId: number, jobData: FrontendJobDTO, logoFile?: File): Promise<FrontendJobDTO> {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Please login to update jobs');
      }

      const backendJobData = mapToBackend(jobData);
      
      const response = await fetch(`${this.baseUrl}/update/${jobId}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(backendJobData),
      });

      // Handle authentication errors
      this.handleAuthError(response);

      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: `HTTP ${response.status}: ${response.statusText}` };
        }
        throw new Error(errorData.error || errorData.message || `Failed to update job: ${response.status}`);
      }

      const updatedBackendJob: BackendJobDTO = await response.json();
      return mapToFrontend(updatedBackendJob);
    } catch (error) {
      console.error('Error updating job:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to update job. Please try again.');
    }
  }

  async deleteJob(jobId: number): Promise<void> {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Please login to delete jobs');
      }

      const response = await fetch(`${this.baseUrl}/delete/${jobId}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
        credentials: 'include',
      });

      // Handle authentication errors
      this.handleAuthError(response);

      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: `HTTP ${response.status}: ${response.statusText}` };
        }
        throw new Error(errorData.error || errorData.message || `Failed to delete job: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting job:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to delete job. Please try again.');
    }
  }

  async getJobById(jobId: number): Promise<FrontendJobDTO> {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('Please login to view job details');
      }

      const response = await fetch(`${this.baseUrl}/${jobId}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
        credentials: 'include',
      });

      // Handle authentication errors
      this.handleAuthError(response);

      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: `HTTP ${response.status}: ${response.statusText}` };
        }
        throw new Error(errorData.error || errorData.message || `Failed to fetch job: ${response.status}`);
      }

      const backendJob: BackendJobDTO = await response.json();
      return mapToFrontend(backendJob);
    } catch (error) {
      console.error('Error fetching job by ID:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to fetch job. Please try again.');
    }
  }

  // Mock implementations for missing endpoints (until you add them to backend)
  async getJobsByStatus(status: string): Promise<FrontendJobDTO[]> {
    const allJobs = await this.getAllJobs();
    return allJobs.filter(job => job.status === status);
  }

  async searchJobs(query: string): Promise<FrontendJobDTO[]> {
    const allJobs = await this.getAllJobs();
    return allJobs.filter(job => 
      job.title.toLowerCase().includes(query.toLowerCase()) ||
      job.companyName.toLowerCase().includes(query.toLowerCase()) ||
      job.location.toLowerCase().includes(query.toLowerCase())
    );
  }

  async postJobWithLogo(jobData: FrontendJobDTO, logoFile?: File): Promise<FrontendJobDTO> {
    // For now, just post without logo until you implement the backend endpoint
    console.warn('Logo upload not implemented in backend yet');
    return this.postJob(jobData);
  }

  // Method to check token validity and refresh if needed
  async ensureValidToken(): Promise<boolean> {
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }

    try {
      // Decode token to check expiry
      const payload = JSON.parse(atob(token.split('.')[1]));
      const isExpired = payload.exp * 1000 < Date.now();
      
      if (isExpired) {
        // Try to refresh token
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          // You can call your auth service refresh method here
          console.log('Token expired, should refresh');
          return false;
        }
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error checking token validity:', error);
      return false;
    }
  }
}

export const jobService = new JobService();
export type JobDTO = FrontendJobDTO; // For backward compatibility