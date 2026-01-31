import React, { createContext, useCallback, useEffect, useState } from "react";
import { getVideoList } from "../apis/video";
import type { Video } from "../types";
import { VIDEO_STATUS } from "../utils/constants";

type VideoContextType = {
  videos: Video[];
  loading: boolean;
  isInitialLoading: boolean;
  error: string | null;
  refresh: () => void;
  addVideo: (videoId: string) => void;

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

  const loadVideos = useCallback(async (isRefresh = false) => {
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
  }, [isInitialLoading]);

  const refreshVideos = () => {
    loadVideos(true); // Pass true to indicate this is a refresh
  };

  const addVideo = useCallback((videoId : string)=>{
    const newVideos = [...videos];
    const tempVideo: Video = {
      id: newVideos.length.toString(),
      title: 'uploding...',
      description: '',
      videoId: videoId,
      status: VIDEO_STATUS.PROCESSING,
      uploadedAt: new Date(),
      processedUrls: {},
      originalUrl: '',
      filename: '',
      fileSize: 0,
    }
    newVideos.push(tempVideo);
    setVideos(newVideos);
  },[videos]);

  useEffect(() => {
    loadVideos();

    const interval = setInterval(() => {
      // TODO: poll only if processing videos exist
      // if (videos.some(v => v.status === VIDEO_STATUS.PROCESSING)) {
        loadVideos(true);
      // }
    }, 30000);

    return () => clearInterval(interval);
  }, [loadVideos]);
  return (
    <VideoContext.Provider
      value={{
        videos,
        loading,
        isInitialLoading,
        error,
        refresh: refreshVideos,
        addVideo,
        selectedVideo,
        selectVideo: setSelectedVideo,
        clearSelectedVideo: () => setSelectedVideo(null),
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};
