// Hooks/useAuth.ts
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../Store/hooks';
import { useNavigate } from 'react-router-dom';
import AuthService, { LoginCredentials, RegisterCredentials } from '../Services/AuthService';
import { clearError, logout as logoutAction } from '../Store/authSlice';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  // Get auth state from Redux
  const { 
    isAuthenticated, 
    token, 
    isLoading, 
    error: authError,
    user,
    isInitialized
  } = useAppSelector((state) => state.auth);

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      await AuthService.login(credentials, dispatch);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Login failed' 
      };
    }
  }, [dispatch]);

  const register = useCallback(async (credentials: RegisterCredentials) => {
    try {
      await AuthService.register(credentials, dispatch);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Registration failed' 
      };
    }
  }, [dispatch]);

  const googleLogin = useCallback(async (credential: string, accountType: 'APPLICANT' | 'EMPLOYER') => {
    try {
      await AuthService.loginWithGoogle(credential, accountType, dispatch);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Google login failed' 
      };
    }
  }, [dispatch]);

  const logout = useCallback(async () => {
    try {
      await AuthService.logout(dispatch);
      navigate('/');
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Logout failed' 
      };
    }
  }, [dispatch, navigate]);

  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Quick logout without API call (for expired tokens)
  const forceLogout = useCallback(() => {
    dispatch(logoutAction());
    navigate('/login');
  }, [dispatch, navigate]);

  return {
    // State
    isAuthenticated,
    isLoading,
    authError,
    user,
    token,
    isInitialized,
    
    // Actions
    login,
    register,
    googleLogin,
    logout,
    forceLogout,
    clearAuthError,
    
    // Utility functions
    getAuthHeaders: AuthService.getAuthHeaders.bind(AuthService),
    apiRequest: AuthService.apiRequest.bind(AuthService),
  };
};