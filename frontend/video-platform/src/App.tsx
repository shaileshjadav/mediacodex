import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { VideoProvider } from './contexts/VideoContext';
import { useAuth } from './hooks/useAuth';
import { useVideos } from './hooks/useVideo';
import {
  LayoutWrapper,
  UploadModal,
  StatusPage,
  VideoListContainer,
  VideoPlayerModal,
  EmbedModal,
  LandingPage,
} from './components';
import EmbedPage from './pages/EmbedPage';
import { useState } from 'react';

function App() {
  return (
    <AuthProvider>
      <VideoProvider>
        <Router>
          <AppContent />
        </Router>
      </VideoProvider>
    </AuthProvider>
  );
}

function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPlayerModalOpen, setIsPlayerModalOpen] = useState(false);
  const [isEmbedModalOpen, setIsEmbedModalOpen] = useState(false);
  const { videos, selectedVideo, selectVideo, refresh } = useVideos();

  const handleUploadComplete = (videoId: string) => {
    setIsModalOpen(false);
    refresh(); // Refresh the video list after upload
    console.log('Upload completed for video:', videoId);
  };

  const handleVideoSelect = (videoId: string) => {
    const video = videos.find((v) => v.id === videoId);
    if (video) {
      selectVideo(video);
      setIsPlayerModalOpen(true);
    }
  };

  const handleEmbedClick = (videoId: string) => {
    const video = videos.find((v) => v.id === videoId);
    if (video) {
      selectVideo(video);
      setIsEmbedModalOpen(true);
    }
  };

  const handleCloseEmbedModal = () => {
    setIsEmbedModalOpen(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Videos</h1>
          <p className="text-gray-600">Manage and share your video content</p>
        </div>
        <button
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          onClick={() => setIsModalOpen(true)}
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Upload Video
        </button>
      </div>

      <UploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUploadComplete={handleUploadComplete}
      />

      <VideoPlayerModal
        isOpen={isPlayerModalOpen}
        onClose={() => setIsPlayerModalOpen(false)}
        video={selectedVideo}
      />

      <EmbedModal
        isOpen={isEmbedModalOpen}
        onClose={handleCloseEmbedModal}
        video={selectedVideo}
      />

      <VideoListContainer
        onVideoSelect={handleVideoSelect}
        onEmbedClick={handleEmbedClick}
      />
    </div>
  );
}

function AppContent() {
  const { isSignedIn } = useAuth();

  return (
    <Routes>
      {/* Embed route - standalone page without layout */}
      <Route path="/embed/:videoId" element={<EmbedPage />} />

      {/* All other routes with layout */}
      <Route
        path="/*"
        element={
          <LayoutWrapper>
            <Routes>
              <Route
                path="/"
                element={<LandingPage />}
              />
              {/* Placeholder routes for future implementation */}
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route
                path="/upload"
                element={
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      Upload Video
                    </h2>
                    <p className="text-gray-600">
                      Upload functionality coming soon...
                    </p>
                  </div>
                }
              />
              <Route path="/status/:videoId" element={<StatusPage />} />
            </Routes>
          </LayoutWrapper>
        }
      />
    </Routes>
  );
}

export default App;
