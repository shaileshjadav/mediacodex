import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isSignedIn, isLoaded } = useAuth();

  // Determine if we should show the sidebar based on route and auth status
  const shouldShowSidebar = isSignedIn && isLoaded;

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex">
        {shouldShowSidebar && <Sidebar />}
        
        <main className={`flex-1 ${shouldShowSidebar ? 'ml-0 lg:ml-64' : ''}`}>
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

// Alternative layout for full-width pages (like status pages)
export const FullWidthLayout: React.FC<LayoutProps> = ({ children }) => {
  const { isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="w-full">
        {children}
      </main>
    </div>
  );
};

// Layout wrapper that chooses the appropriate layout based on route
export const LayoutWrapper: React.FC<LayoutProps> = ({ children }) => {
  
  // Use default layout for everything else
  return <Layout>{children}</Layout>;
};