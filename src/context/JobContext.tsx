// contexts/JobContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Job } from '../Pages/FindJob';

interface JobContextType {
  jobs: Job[];
  setJobs: (jobs: Job[]) => void;
  getJobById: (id: string | number) => Job | undefined;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const JobContext = createContext<JobContextType | undefined>(undefined);

interface JobProviderProps {
  children: ReactNode;
}

export const JobProvider: React.FC<JobProviderProps> = ({ children }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);

  const getJobById = (id: string | number): Job | undefined => {
    const numId = typeof id === 'string' ? parseInt(id, 10) : id;
    return jobs.find(job => job.id === numId);
  };

  // Debug log to track jobs in context
  useEffect(() => {
    console.log('JobContext: Jobs updated', jobs.length);
  }, [jobs]);

  const value = {
    jobs,
    setJobs,
    getJobById,
    loading,
    setLoading
  };

  return (
    <JobContext.Provider value={value}>
      {children}
    </JobContext.Provider>
  );
};

export const useJobs = (): JobContextType => {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error('useJobs must be used within a JobProvider');
  }
  return context;
};