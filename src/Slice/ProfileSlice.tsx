import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

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

interface ProfileData {
  id: string | null;
  name: string;
  title: string;
  location: string;
  experience: string;
  email: string;
  phone: string;
  company: string;
}

interface Stats {
  projects: number;
  followers: number;
  successRate: number;
  rating: number;
}

interface ProfileState {
  profileData: ProfileData;
  about: string;
  skills: string[];
  avatar: string;
  banner: string;
  stats: Stats;
  experiences: Experience[];
  certifications: Certifications[];
  loading: boolean;
  saving: boolean;
  uploadingAvatar: boolean;
  error: string | null;
  lastUpdated: string | null;
  isEditModalOpen: boolean;
  autoSaveEnabled: boolean;
}

// API response type matching your backend
interface ApiResponse {
  id?: string;
  email?: string;
  jobTitle?: string;
  company?: string;
  location?: string;
  about?: string;
  skills?: string[];
  experiences?: Experience[];
  certifications?: Certifications[];
  // Additional frontend fields
  name?: string;
  title?: string;
  phone?: string;
  avatar?: string;
  stats?: Partial<Stats>;
}

interface AvatarUploadResponse {
  avatarUrl: string;
}

interface ProfileUpdatePayload {
  userId: string;
  profileData: Partial<ProfileData & {
    about: string;
    skills: string[];
    avatar: string;
    experiences: Experience[];
    certifications: Certifications[];
    stats: Stats;
  }>;
}

interface ExperienceUpdatePayload {
  index: number;
  data: Partial<Experience>;
}

// Import API functions
import {
  getProfile as apiGetProfile,
  updateProfile,
  createProfile,
  uploadAvatar as apiUploadAvatar
} from '../Services/ProfileService';

// Async thunk for fetching user profile with better error handling
export const fetchProfile = createAsyncThunk<
  ApiResponse,
  string,
  { rejectValue: string }
>(
  'profile/fetchProfile',
  async (userId: string, { rejectWithValue }) => {
    try {
      const data = await apiGetProfile(parseInt(userId, 10));
      return data;
    } catch (error: any) {
      // If profile doesn't exist, return default data instead of error
      if (error.message.includes('not found') || error.message.includes('404')) {
        return {
          id: userId,
          name: '',
          email: '',
          jobTitle: '',
          company: '',
          location: '',
          about: '',
          skills: [],
          experiences: [],
          certifications: [],
          stats: {
            projects: 0,
            followers: 0,
            successRate: 0,
            rating: 4.9
          }
        };
      }
      return rejectWithValue(error.message || 'Failed to fetch profile');
    }
  }
);

// Fixed auto-save thunk that gets current state properly
export const autoSaveProfile = createAsyncThunk<
  ApiResponse,
  { userId: string; delay?: number },
  { rejectValue: string; state: { profile: ProfileState } }
>(
  'profile/autoSaveProfile',
  async ({ userId, delay = 0 }, { rejectWithValue, getState }) => {
    try {
      // Wait for debounce delay if specified
      if (delay > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
      
      const state = getState();
      const profile = state.profile;
      
      if (!profile.autoSaveEnabled) {
        return rejectWithValue('Auto-save disabled');
      }

      // Create the complete profile payload from current state
      const profilePayload = {
        id: profile.profileData.id || userId,
        name: profile.profileData.name,
        title: profile.profileData.title,
        email: profile.profileData.email,
        company: profile.profileData.company,
        location: profile.profileData.location,
        phone: profile.profileData.phone,
        experience: profile.profileData.experience,
        about: profile.about,
        skills: profile.skills,
        avatar: profile.avatar,
        experiences: profile.experiences,
        certifications: profile.certifications,
        stats: profile.stats
      };

      const profileId = parseInt(userId, 10);
      
      // Transform data to match backend expectations
      const backendData = {
        email: profilePayload.email || '',
        jobTitle: profilePayload.title || '',
        company: profilePayload.company || '',
        location: profilePayload.location || '',
        about: profilePayload.about || '',
        skills: profilePayload.skills || [],
        experiences: profilePayload.experiences || [],
        certifications: profilePayload.certifications || [],
        // Keep frontend-specific fields for response
        name: profilePayload.name,
        phone: profilePayload.phone,
        avatar: profilePayload.avatar,
        stats: profilePayload.stats
      };

      // Try to update first, if it fails, create new profile
      try {
        const data = await updateProfile(profileId, backendData);
        return data;
      } catch (updateError: any) {
        if (updateError.message.includes('not found') || updateError.message.includes('404')) {
          // Profile doesn't exist, create new one
          const data = await createProfile(backendData);
          return data;
        }
        throw updateError;
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Auto-save failed');
    }
  }
);

// Enhanced save profile with better error handling
export const saveProfile = createAsyncThunk<
  ApiResponse,
  ProfileUpdatePayload,
  { rejectValue: string }
>(
  'profile/saveProfile',
  async ({ userId, profileData }, { rejectWithValue }) => {
    try {
      const profileId = parseInt(userId, 10);
      
      // Transform data to match backend expectations
      const backendData = {
        email: profileData.email || '',
        jobTitle: profileData.title || '',
        company: profileData.company || '',
        location: profileData.location || '',
        about: profileData.about || '',
        skills: profileData.skills || [],
        experiences: profileData.experiences || [],
        certifications: profileData.certifications || [],
        // Keep frontend-specific fields for response
        name: profileData.name,
        phone: profileData.phone,
        avatar: profileData.avatar,
        stats: profileData.stats
      };

      // Try to update first, if it fails, create new profile
      try {
        const data = await updateProfile(profileId, backendData);
        return data;
      } catch (updateError: any) {
        if (updateError.message.includes('not found') || updateError.message.includes('404')) {
          // Profile doesn't exist, create new one
          const data = await createProfile(backendData);
          return data;
        }
        throw updateError;
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to save profile');
    }
  }
);

// Async thunk for uploading profile avatar
export const uploadAvatar = createAsyncThunk<
  string,
  { userId: string; file: File },
  { rejectValue: string }
>(
  'profile/uploadAvatar',
  async ({ userId, file }, { rejectWithValue }) => {
    try {
      const data: AvatarUploadResponse = await apiUploadAvatar(parseInt(userId, 10), file);
      return data.avatarUrl;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to upload avatar');
    }
  }
);

// Initial state
const initialState: ProfileState = {
  profileData: {
    id: null,
    name: '',
    title: '',
    location: '',
    experience: '',
    email: '',
    phone: '',
    company: '',
  },
  about: '',
  skills: [],
  avatar: '/avatar.png',
  banner: '/banner.png',
  stats: {
    projects: 0,
    followers: 0,
    successRate: 0,
    rating: 4.9,
  },
  experiences: [],
  certifications: [],
  loading: false,
  saving: false,
  uploadingAvatar: false,
  error: null,
  lastUpdated: null,
  isEditModalOpen: false,
  autoSaveEnabled: true,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    // UI state management
    setEditModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isEditModalOpen = action.payload;
    },

    clearError: (state) => {
      state.error = null;
    },

    setAutoSaveEnabled: (state, action: PayloadAction<boolean>) => {
      state.autoSaveEnabled = action.payload;
    },

    // Profile data updates
    updateProfileData: (state, action: PayloadAction<Partial<ProfileData>>) => {
      state.profileData = { ...state.profileData, ...action.payload };
    },

    updateAbout: (state, action: PayloadAction<string>) => {
      state.about = action.payload;
    },

    updateSkills: (state, action: PayloadAction<string[]>) => {
      state.skills = action.payload;
    },

    addSkill: (state, action: PayloadAction<string>) => {
      const skill = action.payload.trim();
      if (skill && !state.skills.includes(skill)) {
        state.skills.push(skill);
      }
    },

    removeSkill: (state, action: PayloadAction<number>) => {
      state.skills = state.skills.filter((_, index) => index !== action.payload);
    },

    updateAvatar: (state, action: PayloadAction<string>) => {
      state.avatar = action.payload;
    },

    // Experience management
    addExperience: (state, action: PayloadAction<Experience>) => {
      state.experiences.push(action.payload);
    },

    updateExperience: (state, action: PayloadAction<ExperienceUpdatePayload>) => {
      const { index, data } = action.payload;
      if (state.experiences[index]) {
        state.experiences[index] = { ...state.experiences[index], ...data };
      }
    },

    removeExperience: (state, action: PayloadAction<number>) => {
      state.experiences = state.experiences.filter((_, index) => index !== action.payload);
    },

    // Certification management
    addCertification: (state, action: PayloadAction<Certifications>) => {
      state.certifications.push(action.payload);
    },

    updateCertification: (state, action: PayloadAction<{ index: number; data: Partial<Certifications> }>) => {
      const { index, data } = action.payload;
      if (state.certifications[index]) {
        state.certifications[index] = { ...state.certifications[index], ...data };
      }
    },

    removeCertification: (state, action: PayloadAction<number>) => {
      state.certifications = state.certifications.filter((_, index) => index !== action.payload);
    },

    // Reset profile to initial state
    resetProfile: () => {
      return { ...initialState };
    },

    // Initialize profile with user data
    initializeProfile: (state, action: PayloadAction<{ userId: string; name?: string; email?: string }>) => {
      const { userId, name, email } = action.payload;
      state.profileData.id = userId;
      if (name) state.profileData.name = name;
      if (email) state.profileData.email = email;
    },
  },

  extraReducers: (builder) => {
    // Fetch Profile
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        const data = action.payload;

        // Map backend data to frontend state
        state.profileData = {
          id: data.id || state.profileData.id,
          name: data.name || state.profileData.name,
          title: data.jobTitle || data.title || state.profileData.title,
          location: data.location || state.profileData.location,
          experience: state.profileData.experience, // This field might not exist in backend
          email: data.email || state.profileData.email,
          phone: data.phone || state.profileData.phone,
          company: data.company || state.profileData.company,
        };

        state.about = data.about || state.about;
        state.skills = data.skills || state.skills;
        state.avatar = data.avatar || state.avatar;

        // Update stats
        if (data.stats) {
          state.stats = { ...state.stats, ...data.stats };
        }

        // Update experiences and certifications
        state.experiences = data.experiences || state.experiences;
        state.certifications = data.certifications || state.certifications;

        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch profile';
      });

    // Save Profile
    builder
      .addCase(saveProfile.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(saveProfile.fulfilled, (state, action) => {
        state.saving = false;
        state.lastUpdated = new Date().toISOString();
        
        // Update state with server response
        const data = action.payload;
        if (data) {
          state.profileData.id = data.id || state.profileData.id;
          
          // Update any server-generated or modified fields
          if (data.jobTitle) {
            state.profileData.title = data.jobTitle;
          }
          if (data.company) {
            state.profileData.company = data.company;
          }
          if (data.location) {
            state.profileData.location = data.location;
          }
          if (data.email) {
            state.profileData.email = data.email;
          }
          if (data.about !== undefined) {
            state.about = data.about;
          }
          if (data.skills) {
            state.skills = data.skills;
          }
          if (data.experiences) {
            state.experiences = data.experiences;
          }
          if (data.certifications) {
            state.certifications = data.certifications;
          }
        }
      })
      .addCase(saveProfile.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload || 'Failed to save profile';
      });

    // Auto Save Profile
    builder
      .addCase(autoSaveProfile.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(autoSaveProfile.fulfilled, (state, action) => {
        state.saving = false;
        state.lastUpdated = new Date().toISOString();
        
        // Update state with server response
        const data = action.payload;
        if (data) {
          state.profileData.id = data.id || state.profileData.id;
          
          // Update any server-generated or modified fields
          if (data.jobTitle) {
            state.profileData.title = data.jobTitle;
          }
          if (data.company) {
            state.profileData.company = data.company;
          }
          if (data.location) {
            state.profileData.location = data.location;
          }
          if (data.email) {
            state.profileData.email = data.email;
          }
          if (data.about !== undefined) {
            state.about = data.about;
          }
          if (data.skills) {
            state.skills = data.skills;
          }
          if (data.experiences) {
            state.experiences = data.experiences;
          }
          if (data.certifications) {
            state.certifications = data.certifications;
          }
        }
      })
      .addCase(autoSaveProfile.rejected, (state, action) => {
        state.saving = false;
        // Only show error if it's not disabled auto-save
        if (action.payload !== 'Auto-save disabled') {
          console.warn('Auto-save failed:', action.payload);
          // Optionally set error for debugging, but don't show to user
          // state.error = action.payload || 'Auto-save failed';
        }
      });

    // Upload Avatar
    builder
      .addCase(uploadAvatar.pending, (state) => {
        state.uploadingAvatar = true;
        state.error = null;
      })
      .addCase(uploadAvatar.fulfilled, (state, action) => {
        state.uploadingAvatar = false;
        state.avatar = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(uploadAvatar.rejected, (state, action) => {
        state.uploadingAvatar = false;
        state.error = action.payload || 'Failed to upload avatar';
      });
  },
});

// Export actions
export const {
  setEditModalOpen,
  clearError,
  setAutoSaveEnabled,
  updateProfileData,
  updateAbout,
  updateSkills,
  addSkill,
  removeSkill,
  updateAvatar,
  addExperience,
  updateExperience,
  removeExperience,
  addCertification,
  updateCertification,
  removeCertification,
  resetProfile,
  initializeProfile,
} = profileSlice.actions;

// Type-safe root state interface
interface RootState {
  profile: ProfileState;
  auth?: any;
  user?: any;
}

// Fixed selectors with proper typing and null safety
export const selectProfile = (state: RootState): ProfileState => 
  state.profile ?? initialState;

export const selectProfileData = (state: RootState) =>
  state.profile?.profileData ?? initialState.profileData;

export const selectAbout = (state: RootState): string =>
  state.profile?.about ?? "";

export const selectSkills = (state: RootState): string[] =>
  state.profile?.skills ?? [];

export const selectAvatar = (state: RootState): string =>
  state.profile?.avatar ?? "/avatar.png";

export const selectBanner = (state: RootState): string =>
  state.profile?.banner ?? "/banner.png";

export const selectStats = (state: RootState): Stats =>
  state.profile?.stats ?? initialState.stats;

export const selectExperiences = (state: RootState): Experience[] =>
  state.profile?.experiences ?? [];

export const selectCertifications = (state: RootState): Certifications[] =>
  state.profile?.certifications ?? [];

export const selectProfileLoading = (state: RootState): boolean =>
  state.profile?.loading ?? false;

export const selectProfileSaving = (state: RootState): boolean =>
  state.profile?.saving ?? false;

export const selectUploadingAvatar = (state: RootState): boolean =>
  state.profile?.uploadingAvatar ?? false;

export const selectProfileError = (state: RootState): string | null =>
  state.profile?.error ?? null;

export const selectLastUpdated = (state: RootState): string | null =>
  state.profile?.lastUpdated ?? null;

export const selectIsEditModalOpen = (state: RootState): boolean =>
  state.profile?.isEditModalOpen ?? false;

export const selectAutoSaveEnabled = (state: RootState): boolean =>
  state.profile?.autoSaveEnabled ?? true;

  // Export types
export type {
  ProfileData,
  Stats,
  Experience,
  Certifications,
  ProfileState,
  ApiResponse,
  AvatarUploadResponse,
  ProfileUpdatePayload,
  ExperienceUpdatePayload,
  RootState,
};

// Export reducer
export default profileSlice.reducer;
