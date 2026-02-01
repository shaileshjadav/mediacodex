import React, {  } from 'react';
import VideoList from './VideoList';
import { useVideos } from '../hooks/useVideo';

interface VideoListContainerProps {
  onVideoSelect: (videoId: string) => void;
  onEmbedClick: (videoId: string) => void;
}

const VideoListContainer: React.FC<VideoListContainerProps> = ({
  onVideoSelect,
  onEmbedClick,
}) => {
 const { videos, isInitialLoading, error, refresh } = useVideos();
  

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border border-red-200">
        <div className="text-center max-w-md">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Videos</h3>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={refresh}
            className="inline-flex items-center px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <VideoList
      videos={videos}
      loading={isInitialLoading}
      onVideoSelect={onVideoSelect}
      onEmbedClick={onEmbedClick}
    />
  );
};

export default VideoListContainer;