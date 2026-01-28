import React, { createContext, useEffect, useState } from "react";
import { getVideoList } from "../apis/video";
import type { Video } from "../types";

type VideoContextType = {
  videos: Video[];
  loading: boolean;
  isInitialLoading: boolean;
  error: string | null;
  refresh: () => void;

    selectedVideo: Video | null;
  selectVideo: (video: Video) => void;
  clearSelectedVideo: () => void;
};

export const VideoContext = createContext<VideoContextType | null>(null);

export const VideoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<Video|null>(null);

  const loadVideos = async (isRefresh = false) => {
    try {
      // Only show loading spinner on initial load, not on refresh
      if (!isRefresh) {
        setLoading(true);
      }
      
      const data = await getVideoList();
      setVideos(data);
      setError(null);
      
      // Mark initial loading as complete
      if (isInitialLoading) {
        setIsInitialLoading(false);
      }
    } catch (e: any) {
      setError(e.message || "Failed to fetch videos");
    } finally {
      setLoading(false);
    }
  };

  const refreshVideos = () => {
    loadVideos(true); // Pass true to indicate this is a refresh
  };

  //  auto refresh every 30 seconds
  useEffect(() => {
    loadVideos(); // Initial load
    const interval = setInterval(() => loadVideos(true), 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <VideoContext.Provider
      value={{
        videos,
        loading,
        isInitialLoading,
        error,
        refresh: refreshVideos,
        selectedVideo,
        selectVideo: setSelectedVideo,
        clearSelectedVideo: () => setSelectedVideo(null),
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};
