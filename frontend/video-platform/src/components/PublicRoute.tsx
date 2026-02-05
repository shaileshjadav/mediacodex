import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

interface PublicRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  restrictWhenAuthenticated?: boolean;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ 
  children, 
  redirectTo = '/dashboard',
  restrictWhenAuthenticated = false 
}) => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error('PublicRoute must be used within an AuthProvider');
  }

  const { isLoaded, isSignedIn } = authContext;

  // Show loading state while auth is being determined
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // If user is authenticated and this route should redirect authenticated users
  if (isSignedIn && restrictWhenAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;