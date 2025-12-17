import React, { createContext, useEffect, useState } from "react";
import { getVideoList } from "../apis/video";
import type { Video } from "../types";

type VideoContextType = {
  videos: Video[];
  loading: boolean;
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
  const [error, setError] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<Video|null>(null);

  const loadVideos = async () => {
    try {
      setLoading(true);
      const data = await getVideoList();

      setVideos(data);
    } catch (e: any) {
      setError(e.message || "Failed to fetch videos");
    } finally {
      setLoading(false);
    }
  };

  //  auto refresh every 30 seconds
  useEffect(() => {
    loadVideos();
    const interval = setInterval(loadVideos, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <VideoContext.Provider
      value={{
        videos,
        loading,
        error,
        refresh: loadVideos,
        selectedVideo,
        selectVideo: setSelectedVideo,
        clearSelectedVideo: () => setSelectedVideo(null),
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};
