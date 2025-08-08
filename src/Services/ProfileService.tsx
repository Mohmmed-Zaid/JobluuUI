import axios from 'axios';

// Types matching your backend structure
interface Experience {
  id?: string;
  company: string;
  position: string;
  duration: string;
  description: string;
  current: boolean;
}

interface Certifications {
  id?: string;
  name: string;
  issuer: string;
  date: string;
  credentialId?: string;
}

interface ProfileDto {
  id?: Long;
  email: string;
  jobTitle: string;
  company: string;
  location: string;
  about: string;
  skills: string[];
  experiences: Experience[];
  certifications: Certifications[];
  // Additional fields for frontend compatibility
  name?: string;
  title?: string;
  phone?: string;
  avatar?: string;
  stats?: {
    projects: number;
    followers: number;
    successRate: number;
    rating: number;
  };
}

// API base URL - update this to match your backend
const base_url = "http://localhost:8080/api/profiles";

// Configure axios defaults
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Add request interceptor to include auth token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Get profile by ID
const getProfile = async (id: number): Promise<ProfileDto> => {
  try {
    const response = await axios.get(`${base_url}/get/${id}`);
    const data = response.data;
    
    // Transform backend data to match frontend expectations
    return {
      ...data,
      name: data.name || 'Your Name',
      title: data.jobTitle || data.title || 'Your Title',
      phone: data.phone || '',
      avatar: data.avatar || '/avatar.png',
      stats: data.stats || {
        projects: 0,
        followers: 0,
        successRate: 0,
        rating: 4.9
      }
    };
  } catch (error: any) {
    console.error('Error fetching profile:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch profile');
  }
};

// Update profile
const updateProfile = async (id: number, profile: Partial<ProfileDto>): Promise<ProfileDto> => {
  try {
    // Transform frontend data to match backend expectations
    const backendProfile = {
      email: profile.email,
      jobTitle: profile.title || profile.jobTitle,
      company: profile.company,
      location: profile.location,
      about: profile.about,
      skills: profile.skills || [],
      experiences: profile.experiences || [],
      certifications: profile.certifications || []
    };

    const response = await axios.put(`${base_url}/update/${id}`, backendProfile);
    const data = response.data;
    
    // Transform response back to frontend format
    return {
      ...data,
      name: data.name || profile.name,
      title: data.jobTitle,
      phone: data.phone || profile.phone,
      avatar: data.avatar || profile.avatar,
      stats: data.stats || profile.stats
    };
  } catch (error: any) {
    console.error('Error updating profile:', error);
    throw new Error(error.response?.data?.message || 'Failed to update profile');
  }
};

// Create new profile
const createProfile = async (profile: Partial<ProfileDto>): Promise<ProfileDto> => {
  try {
    // Transform frontend data to match backend expectations
    const backendProfile = {
      email: profile.email,
      jobTitle: profile.title || profile.jobTitle,
      company: profile.company || '',
      location: profile.location,
      about: profile.about,
      skills: profile.skills || [],
      experiences: profile.experiences || [],
      certifications: profile.certifications || []
    };

    const response = await axios.post(`${base_url}/create`, backendProfile);
    const data = response.data;
    
    // Transform response back to frontend format
    return {
      ...data,
      name: data.name || profile.name,
      title: data.jobTitle,
      phone: data.phone || profile.phone,
      avatar: data.avatar || '/avatar.png',
      stats: data.stats || {
        projects: 0,
        followers: 0,
        successRate: 0,
        rating: 4.9
      }
    };
  } catch (error: any) {
    console.error('Error creating profile:', error);
    throw new Error(error.response?.data?.message || 'Failed to create profile');
  }
};

// Upload avatar
const uploadAvatar = async (id: number, file: File): Promise<{ avatarUrl: string }> => {
  try {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const response = await axios.post(`${base_url}/upload-avatar/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error: any) {
    console.error('Error uploading avatar:', error);
    throw new Error(error.response?.data?.message || 'Failed to upload avatar');
  }
};

// Delete profile
const deleteProfile = async (id: number): Promise<{ message: string }> => {
  try {
    const response = await axios.delete(`${base_url}/delete/${id}`);
    return response.data;
  } catch (error: any) {
    console.error('Error deleting profile:', error);
    throw new Error(error.response?.data?.message || 'Failed to delete profile');
  }
};

// Get all profiles (for admin or listing purposes)
const getAllProfiles = async (): Promise<ProfileDto[]> => {
  try {
    const response = await axios.get(`${base_url}/all`);
    return response.data.map((profile: any) => ({
      ...profile,
      name: profile.name || 'User',
      title: profile.jobTitle,
      avatar: profile.avatar || '/avatar.png',
      stats: profile.stats || {
        projects: 0,
        followers: 0,
        successRate: 0,
        rating: 4.9
      }
    }));
  } catch (error: any) {
    console.error('Error fetching all profiles:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch profiles');
  }
};

// Search profiles
const searchProfiles = async (query: string): Promise<ProfileDto[]> => {
  try {
    const response = await axios.get(`${base_url}/search`, {
      params: { q: query }
    });
    return response.data.map((profile: any) => ({
      ...profile,
      name: profile.name || 'User',
      title: profile.jobTitle,
      avatar: profile.avatar || '/avatar.png',
      stats: profile.stats || {
        projects: 0,
        followers: 0,
        successRate: 0,
        rating: 4.9
      }
    }));
  } catch (error: any) {
    console.error('Error searching profiles:', error);
    throw new Error(error.response?.data?.message || 'Failed to search profiles');
  }
};

// Export functions and types
export {
  getProfile,
  updateProfile,
  createProfile,
  uploadAvatar,
  deleteProfile,
  getAllProfiles,
  searchProfiles
};

export type {
  ProfileDto,
  Experience,
  Certifications
};