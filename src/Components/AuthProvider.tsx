// Components/AuthProvider.tsx
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../Store/hooks';
import { autoLogin, setInitialized } from '../Store/authSlice';
import { Center, Loader } from '@mantine/core';

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { isInitialized, isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Only run auto-login once when app starts
    if (!isInitialized) {
      const token = localStorage.getItem('token');
      
      if (token) {
        console.log('🔄 AuthProvider: Found token, attempting auto-login...');
        dispatch(autoLogin());
      } else {
        console.log('❌ AuthProvider: No token found, marking as initialized');
        dispatch(setInitialized());
      }
    }
  }, [dispatch, isInitialized]);

  // Show loading spinner while initializing authentication
  if (!isInitialized || isLoading) {
    return (
      <Center h="100vh">
        <Loader size="lg" />
      </Center>
    );
  }

  return <>{children}</>;
};

export default AuthProvider;