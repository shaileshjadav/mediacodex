import React, { useState } from 'react';
import { VideoPlayerModal } from './VideoPlayerModal';
import type { Video } from '../types';

export const VideoPlayerDemo: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  // Demo videos with different quality options
  const demoVideos: Video[] = [
    {
      id: '1',
      title: 'Sample HLS Video - Multiple Qualities',
      description: 'This is a demo video showing HLS streaming with multiple quality options including 1080p, 720p, and 480p.',
      filename: 'sample-hls.mp4',
      originalUrl: 'http://localhost:4566/processed-videos/transcoded-videos/1280x720/playlist.m3u8',
      processedUrls: {
        '1080p': 'http://localhost:4566/processed-videos/transcoded-videos/1920x1080/playlist.m3u8',
        '720p': 'http://localhost:4566/processed-videos/transcoded-videos/1280x720/playlist.m3u8',
        '480p': 'http://localhost:4566/processed-videos/transcoded-videos/854x480/playlist.m3u8',
        '360p': 'http://localhost:4566/processed-videos/transcoded-videos/640x360/playlist.m3u8'
      },
      thumbnailUrl: 'https://via.placeholder.com/640x360/4F46E5/FFFFFF?text=HLS+Demo',
      duration: 120,
      fileSize: 25165824,
      status: 'completed',
      uploadedAt: new Date('2024-01-15'),
      processedAt: new Date('2024-01-15')
    },
    {
      id: '2',
      title: 'Big Buck Bunny - Test Video',
      description: 'Classic test video with multiple resolutions available for quality testing.',
      filename: 'big-buck-bunny.mp4',
      originalUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      processedUrls: {
        '720p': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        '480p': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
      },
      thumbnailUrl: 'https://via.placeholder.com/640x360/10B981/FFFFFF?text=Big+Buck+Bunny',
      duration: 596,
      fileSize: 158165824,
      status: 'completed',
      uploadedAt: new Date('2024-01-14'),
      processedAt: new Date('2024-01-14')
    },
    {
      id: '3',
      title: 'Elephant Dream - Creative Commons',
      description: 'Another test video demonstrating the video player capabilities with custom controls.',
      filename: 'elephant-dream.mp4',
      originalUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      processedUrls: {
        '720p': 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
      },
      thumbnailUrl: 'https://via.placeholder.com/640x360/8B5CF6/FFFFFF?text=Elephant+Dream',
      duration: 653,
      fileSize: 142165824,
      status: 'completed',
      uploadedAt: new Date('2024-01-13'),
      processedAt: new Date('2024-01-13')
    }
  ];

  const handleVideoSelect = (video: Video) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Video Player Modal Demo
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Experience our advanced video player with HLS streaming and quality selection
        </p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-left">
          <h2 className="text-lg font-semibold text-blue-900 mb-3">Features Demonstrated:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div className="space-y-2">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                HLS Streaming Support
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Multiple Quality Options
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Custom Video Controls
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Progress Bar & Seeking
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Volume Control
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Fullscreen Support
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Responsive Design
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Keyboard Shortcuts
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {demoVideos.map((video) => (
          <div
            key={video.id}
            className="group bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl hover:border-blue-300 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
            onClick={() => handleVideoSelect(video)}
          >
            {/* Thumbnail */}
            <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
              <img
                src={video.thumbnailUrl}
                alt={video.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              
              {/* Play overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/90 rounded-full p-4 shadow-xl">
                    <svg className="w-8 h-8 text-gray-800" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Duration */}
              <div className="absolute bottom-3 right-3 bg-black/80 text-white text-xs px-2.5 py-1 rounded-md font-medium">
                {Math.floor(video.duration! / 60)}:{(video.duration! % 60).toString().padStart(2, '0')}
              </div>

              {/* Quality indicator */}
              <div className="absolute top-3 left-3 bg-blue-600 text-white text-xs px-2.5 py-1 rounded-full font-semibold">
                {Object.keys(video.processedUrls).length} Qualities
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <h3 className="font-bold text-gray-900 mb-2 text-lg leading-tight group-hover:text-blue-600 transition-colors">
                {video.title}
              </h3>
              
              <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                {video.description}
              </p>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {Math.floor(video.duration! / 60)}m {video.duration! % 60}s
                </span>
                <span className="flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 110 2h-1v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6H3a1 1 0 110-2h4z" />
                  </svg>
                  {Math.round(video.fileSize / 1024 / 1024)}MB
                </span>
              </div>

              <button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105">
                <span className="flex items-center justify-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                  Play Video
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Instructions */}
      <div className="mt-12 bg-gray-50 rounded-xl p-8 text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          How to Test the Video Player
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-700">
          <div className="space-y-2">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-blue-600 font-bold text-lg">1</span>
            </div>
            <h4 className="font-semibold">Click any video</h4>
            <p>Click on any video card above to open the video player modal</p>
          </div>
          <div className="space-y-2">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-blue-600 font-bold text-lg">2</span>
            </div>
            <h4 className="font-semibold">Test quality options</h4>
            <p>Use the settings button to switch between different video qualities</p>
          </div>
          <div className="space-y-2">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-blue-600 font-bold text-lg">3</span>
            </div>
            <h4 className="font-semibold">Try all controls</h4>
            <p>Test play/pause, seeking, volume, and fullscreen functionality</p>
          </div>
        </div>
      </div>

      {/* Video Player Modal */}
      <VideoPlayerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        video={selectedVideo}
      />
    </div>
  );
};