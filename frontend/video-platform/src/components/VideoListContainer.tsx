import React, { useEffect } from 'react';
import VideoList from './VideoList';
import { useVideoStore } from '../hooks/useVideoList';
import { useShallow } from 'zustand/shallow';
import { VIDEO_STATUS } from '../utils/constants';
import { useVideoPlayerStore } from '../hooks/useVideoPlayer';


const VideoListContainer: React.FC = () => {
  const selectVideo = useVideoPlayerStore((state) => state.selectVideo);
  const setEmbedVideo = useVideoStore((state) => state.setEmbedVideo);

  const handleVideoSelect = (videoId: string) => {
    const video = videos.find((v) => v.id === videoId);
    if (video && video.status === VIDEO_STATUS.COMPLETED) {
      selectVideo(video);
    }
  };

  const handleEmbedClick = (videoId: string) => {
    const video = videos.find((v) => v.id === videoId);
    if (video) {
      setEmbedVideo(video);
    }
  };

  //useShallow make sure that component re-renders only when actual state changed.
 const { videos, isInitialLoading, error } = useVideoStore(useShallow((state) => ({
    videos: state.videos,
    isInitialLoading: state.isInitialLoading,
    error: state.error,
 })));
 const refresh = useVideoStore(state => state.refresh);
  
 useEffect(() => {
  // intial fetch
  refresh();
  const interval = setInterval(() => {
    refresh();
  },10000)
  return () => clearInterval(interval);
 }, [refresh])
 
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
      onVideoSelect={handleVideoSelect}
      onEmbedClick={handleEmbedClick}
    />
  );
};

export default VideoListContainer;