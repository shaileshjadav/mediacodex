import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SignInButton, SignOutButton } from '@clerk/clerk-react';
import { HomeIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../hooks/useAuth';

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  const { isSignedIn, isLoaded, userName } = useAuth();
  const location = useLocation();
  
  // Show mobile navigation for authenticated users not on landing page
  const shouldShowMobileNav = isSignedIn && isLoaded && location.pathname !== '/';

  if (!isLoaded) {
    return (
      <header className={`bg-white shadow-sm border-b ${className}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="h-8 w-32 bg-gray-200 animate-pulse rounded"></div>
            </div>
            <div className="h-8 w-20 bg-gray-200 animate-pulse rounded"></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className={`bg-white shadow-sm border-b fixed top-0 left-0 right-0 z-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Mobile navigation button and Logo */}
          <div className="flex items-center">
            {/* Mobile navigation - only show for authenticated users not on landing page */}
            {shouldShowMobileNav && (
              <div className="lg:hidden mr-4">
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors"
                >
                  <HomeIcon className="h-5 w-5" />
                  <span>Home</span>
                </Link>
              </div>
            )}
            
            <Link
              to="/dashboard"
              className="flex items-center space-x-2 text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">VP</span>
              </div>
              <span className="hidden sm:block">Video Platform</span>
            </Link>
          </div>

          {/* User menu */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {isSignedIn ? (
              <>
                <span className="text-sm text-gray-700 hidden sm:block">
                  Welcome, {userName}
                </span>
                <SignOutButton>
                  <button className="bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors">
                    Sign Out
                  </button>
                </SignOutButton>
              </>
            ) : (
              <SignInButton>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors">
                  Sign In
                </button>
              </SignInButton>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};