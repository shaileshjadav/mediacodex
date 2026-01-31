import { useEffect, useState, useCallback } from "react";
import { getVideoList } from "../apis/video";
import type { Video } from "../types";
import { VIDEO_STATUS } from "../utils/constants";

export const useVideoList = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadVideos = useCallback(async (isRefresh = false) => {
    try {
      if (!isRefresh) setLoading(true);

      const data = await getVideoList();
      setVideos(data);
      setError(null);

      if (isInitialLoading) setIsInitialLoading(false);
    } catch (e: any) {
      setError(e.message || "Failed to fetch videos");
    } finally {
      setLoading(false);
    }
  }, [isInitialLoading]);

  useEffect(() => {
    loadVideos();

    const interval = setInterval(() => {
      // poll only if processing videos exist
      if (videos.some(v => v.status === VIDEO_STATUS.PROCESSING || v.status === VIDEO_STATUS.QUEUED)) {
        loadVideos(true);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [loadVideos, videos]);

  return {
    videos,
    loading,
    isInitialLoading,
    error,
    refresh: () => loadVideos(true),
    setVideos, // optional for optimistic updates
  };
};
