import { useUser, useAuth as useClerkAuth } from '@clerk/clerk-react';

/**
 * Custom hook that provides a simplified interface to Clerk authentication
 * This hook combines useUser and useAuth from Clerk for easier usage throughout the app
 */
export const useAuth = () => {
  const { user, isLoaded } = useUser();
  const { isSignedIn, signOut } = useClerkAuth();

  return {
    user,
    isLoaded,
    isSignedIn: isSignedIn || false,
    signOut,
    // Helper properties for common use cases
    isAuthenticated: isLoaded && isSignedIn,
    isLoading: !isLoaded,
    userEmail: user?.emailAddresses?.[0]?.emailAddress,
    userName: user?.firstName || user?.emailAddresses?.[0]?.emailAddress || 'User',
  };
};