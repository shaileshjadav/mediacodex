import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

import {
  LayoutWrapper,
  LandingPage,
  ProtectedRoute,
  PublicRoute,
} from './components';
import DashboardPage from './pages/DashboardPage';


function App() {
  return (
    <AuthProvider>
      {/* <VideoProvider> */}
        <Router>
          <AppContent />
        </Router>
      {/* </VideoProvider> */}
    </AuthProvider>
  );
}



function AppContent() {
  return (
    <Routes>

      {/* All other routes with layout */}
      <Route
        path="/*"
        element={
          <LayoutWrapper>
            <Routes>
              {/* Landing page - public, but redirect authenticated users to dashboard */}
              <Route
                path="/"
                element={
                  <PublicRoute restrictWhenAuthenticated={true}>
                    <LandingPage />
                  </PublicRoute>
                }
              />
              
              {/* Dashboard route - protected, requires authentication */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                } 
              />
              
              {/* Add more protected routes here */}
              {/* Example: Profile page - protected */}
              {/* <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } 
              /> */}
              
              {/* Example: Settings page - protected */}
              {/* <Route 
                path="/settings" 
                element={
                  <ProtectedRoute>
                    <SettingsPage />
                  </ProtectedRoute>
                } 
              /> */}
            </Routes>
          </LayoutWrapper>
        }
      />
    </Routes>
  );
}

export default App;
