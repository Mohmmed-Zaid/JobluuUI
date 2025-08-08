// src/Store/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  name: string;
  email: string;
  accountType: 'APPLICANT' | 'EMPLOYER';
  avatar?: string;
  // Add other user properties as needed
}

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  token: string | null;
}

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  token: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Start login/signup loading
    authStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    
    // Successful login/signup
    authSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
      
      // Store token in localStorage for persistence
      localStorage.setItem('token', action.payload.token);
    },
    
    // Failed login/signup
    authFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = action.payload;
      
      // Remove token from localStorage
      localStorage.removeItem('token');
    },
    
    // Logout
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.token = null;
      state.error = null;
      state.isLoading = false;
      
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('persist:root'); // Clear persisted state
    },
    
    // Update user profile
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    
    // Restore authentication from token (on app startup)
    restoreAuth: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
  },
});

export const {
  authStart,
  authSuccess,
  authFailure,
  logout,
  updateUser,
  clearError,
  restoreAuth,
} = userSlice.actions;

export default userSlice.reducer;