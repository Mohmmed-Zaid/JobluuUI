// Components/ProtectedRoute.tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../Store/hooks';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectTo = '/signup'
}) => {
  const location = useLocation();
  const { isAuthenticated, user, isInitialized } = useAppSelector((state) => state.auth);

  // Don't render anything until auth is initialized
  // (AuthProvider handles the loading state)
  if (!isInitialized) {
    return null;
  }

  // If not authenticated, redirect to signup/login
  if (!isAuthenticated) {
    console.log('❌ ProtectedRoute: User not authenticated, redirecting to:', redirectTo);
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // If authenticated but no user data, something went wrong
  if (!user) {
    console.log('⚠️ ProtectedRoute: Authenticated but no user data, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  console.log('✅ ProtectedRoute: Access granted to:', location.pathname);
  return <>{children}</>;
};

export default ProtectedRoute;