import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SignInButton } from '@clerk/clerk-react';
import { AuthProvider } from './contexts/AuthContext';
import { VideoProvider } from './contexts/VideoContext';
import { useAuth } from './hooks/useAuth';
import { useVideos } from './hooks/useVideo';
import { LayoutWrapper, UploadModal, StatusPage, VideoListContainer, VideoPlayerModal } from './components';
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
  const { videos, selectedVideo, selectVideo,  refresh } = useVideos();

  const handleUploadComplete = (videoId: string) => {
    setIsModalOpen(false);
    refresh(); // Refresh the video list after upload
    console.log('Upload completed for video:', videoId);
  };

  const handleVideoSelect = (videoId: string) => {
     const video = videos.find(v => v.id === videoId);
    if(video){
      selectVideo(video);
      setIsPlayerModalOpen(true);
    }
    
  };

  const handleEmbedClick = (videoId: string) => {
    console.log('Embed video:', videoId);
  }   

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Videos</h1>
          <p className="text-gray-600">Manage and share your video content</p>
        </div>
        <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          onClick={() => setIsModalOpen(true)}
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
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
          
        <VideoListContainer 
          onVideoSelect={handleVideoSelect}
          onEmbedClick={handleEmbedClick}/>
    </div>
  );
}

function AppContent() {
  const { isSignedIn } = useAuth();

  return (
    <LayoutWrapper>
      <Routes>
        <Route
          path="/"
          element={
            <div className="text-center max-w-4xl mx-auto">
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-6 shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  Welcome to <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Video Platform</span>
                </h2>
                <p className="text-xl text-gray-600 mb-12 leading-relaxed">
                  Upload, manage, and embed your videos with ease. 
                  <br />
                  Professional video hosting made simple.
                </p>
              </div>
              
              {isSignedIn ? (
                <div className="bg-gradient-to-br from-emerald-50 to-green-100 border border-emerald-200 rounded-2xl p-8 shadow-lg">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500 rounded-full mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-emerald-800 mb-3">
                    You're all set!
                  </h3>
                  <p className="text-emerald-700 text-lg mb-6">
                    Ready to start managing your videos and building your content library.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors shadow-md">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H9a2 2 0 01-2-2z" />
                      </svg>
                      View Dashboard
                    </button>
                    <button className="inline-flex items-center px-6 py-3 bg-white text-emerald-600 font-semibold rounded-xl hover:bg-emerald-50 transition-colors border border-emerald-200">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Upload Video
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200 rounded-2xl p-8 shadow-lg">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-blue-800 mb-3">
                    Get Started Today
                  </h3>
                  <p className="text-blue-700 text-lg mb-6">
                    Sign in to unlock powerful video management tools and start building your content library.
                  </p>
                  <SignInButton>
                    <button className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                      Sign In to Continue
                    </button>
                  </SignInButton>
                </div>
              )}
            </div>
          }
        />
        {/* Placeholder routes for future implementation */}
        <Route
          path="/dashboard"
          element={<DashboardPage />}
        />
        <Route
          path="/upload"
          element={
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Upload Video</h2>
              <p className="text-gray-600">Upload functionality coming soon...</p>
            </div>
          }
        />
        <Route
          path="/status/:videoId"
          element={<StatusPage />}
        />
        
      </Routes>
    </LayoutWrapper>
  );
}

export default App;
