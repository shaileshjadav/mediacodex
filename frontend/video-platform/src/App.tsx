import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SignInButton } from '@clerk/clerk-react';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import { LayoutWrapper, UploadModal, VideoList, StatusPage } from './components';
import type { Video } from './types';
import { useState } from 'react';

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

function LoadingDemoPage() {
  const handleVideoSelect = (videoId: string) => {
    console.log('Selected video:', videoId);
  };

  const handleEmbedClick = (videoId: string) => {
    console.log('Embed video:', videoId);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Loading State Demo</h1>
        <p className="text-gray-600">See how the interface looks while loading content</p>
      </div>
      <VideoList
        videos={[]}
        loading={true}
        onVideoSelect={handleVideoSelect}
        onEmbedClick={handleEmbedClick}
      />
    </div>
  );
}

function EmptyDemoPage() {
  const handleVideoSelect = (videoId: string) => {
    console.log('Selected video:', videoId);
  };

  const handleEmbedClick = (videoId: string) => {
    console.log('Embed video:', videoId);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Empty State Demo</h1>
        <p className="text-gray-600">See how the interface looks when no videos are present</p>
      </div>
      <VideoList
        videos={[]}
        loading={false}
        onVideoSelect={handleVideoSelect}
        onEmbedClick={handleEmbedClick}
      />
    </div>
  );
}

function DashboardPage() {
   const [isModalOpen, setIsModalOpen] = useState(false);
    const [lastUploadedVideoId, setLastUploadedVideoId] = useState<string | null>(null);
  
    const handleUploadComplete = (videoId: string) => {
      setLastUploadedVideoId(videoId);
      setIsModalOpen(false);
      // In a real app, this would redirect to the status page
      console.log('Upload completed for video:', videoId);
    };

  // Mock data for demonstration
  const mockVideos: Video[] = [
    {
      id: '1',
      userId: 'user1',
      title: 'Product Demo: Revolutionary AI Assistant',
      description: 'A comprehensive walkthrough of our latest AI assistant features and capabilities that will transform your workflow.',
      filename: 'ai-demo.mp4',
      originalUrl: 'https://example.com/ai-demo.mp4',
      processedUrls: {
        '1080p': 'https://example.com/ai-demo_1080p.m3u8',
        '720p': 'https://example.com/ai-demo_720p.m3u8',
        '480p': 'https://example.com/ai-demo_480p.m3u8'
      },
      thumbnailUrl: 'https://via.placeholder.com/320x180/4F46E5/FFFFFF?text=AI+Demo',
      duration: 245,
      fileSize: 45728640, // 43MB
      status: 'completed',
      uploadedAt: new Date('2024-01-15'),
      processedAt: new Date('2024-01-15')
    },
    {
      id: '2',
      userId: 'user1',
      title: 'Team Meeting Recording - Q1 Planning',
      description: 'Strategic planning session for Q1 objectives and key results discussion.',
      filename: 'team-meeting.mp4',
      originalUrl: 'https://example.com/team-meeting.mp4',
      processedUrls: {},
      duration: 3600,
      fileSize: 125165824, // 119MB
      status: 'processing',
      uploadedAt: new Date('2024-01-16')
    },
    {
      id: '3',
      userId: 'user1',
      title: 'Tutorial: Getting Started with React',
      description: 'A beginner-friendly guide to building your first React application from scratch.',
      filename: 'react-tutorial.mp4',
      originalUrl: 'https://example.com/react-tutorial.mp4',
      processedUrls: {},
      fileSize: 152428800, // 145MB
      status: 'failed',
      uploadedAt: new Date('2024-01-17')
    },
    {
      id: '4',
      userId: 'user1',
      title: 'Customer Success Story: TechCorp',
      description: 'How TechCorp increased their productivity by 300% using our platform.',
      filename: 'success-story.mp4',
      originalUrl: 'https://example.com/success-story.mp4',
      processedUrls: {
        '720p': 'https://example.com/success-story_720p.m3u8'
      },
      thumbnailUrl: 'https://via.placeholder.com/320x180/10B981/FFFFFF?text=Success+Story',
      duration: 180,
      fileSize: 28728640, // 27MB
      status: 'completed',
      uploadedAt: new Date('2024-01-14'),
      processedAt: new Date('2024-01-14')
    },
    {
      id: '5',
      userId: 'user1',
      title: 'Webinar: Future of Remote Work',
      description: 'Industry experts discuss trends and predictions for the future of remote work.',
      filename: 'webinar.mp4',
      originalUrl: 'https://example.com/webinar.mp4',
      processedUrls: {},
      duration: 2700,
      fileSize: 95165824, // 90MB
      status: 'pending',
      uploadedAt: new Date('2024-01-18')
    },
    {
      id: '6',
      userId: 'user1',
      title: 'Behind the Scenes: Office Tour',
      description: 'Take a virtual tour of our modern office space and meet the team.',
      filename: 'office-tour.mp4',
      originalUrl: 'https://example.com/office-tour.mp4',
      processedUrls: {
        '1080p': 'https://example.com/office-tour_1080p.m3u8',
        '720p': 'https://example.com/office-tour_720p.m3u8'
      },
      thumbnailUrl: 'https://via.placeholder.com/320x180/8B5CF6/FFFFFF?text=Office+Tour',
      duration: 420,
      fileSize: 65728640, // 62MB
      status: 'completed',
      uploadedAt: new Date('2024-01-13'),
      processedAt: new Date('2024-01-13')
    }
  ];

  const handleVideoSelect = (videoId: string) => {
    console.log('Selected video:', videoId);
  };

  const handleEmbedClick = (videoId: string) => {
    console.log('Embed video:', videoId);
  };

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
          
      <VideoList
        videos={mockVideos}
        loading={false}
        onVideoSelect={handleVideoSelect}
        onEmbedClick={handleEmbedClick}
      />
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
          path="/empty-demo"
          element={<EmptyDemoPage />}
        />
        <Route
          path="/loading-demo"
          element={<LoadingDemoPage />}
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
