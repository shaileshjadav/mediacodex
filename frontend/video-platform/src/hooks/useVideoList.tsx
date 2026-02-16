import { create } from "zustand";
import { getVideoList } from "../apis/video";
import type { Video } from "../types";
import { VIDEO_STATUS } from "../utils/constants";

type VideoStoreState = {
  videos: Video[];
  loading: boolean;
  isInitialLoading: boolean;
  error: string | null;
  refresh: () => void;
  addVideo: (videoId: string) => void;
  loadVideos: (isRefresh?: boolean) => Promise<void>;
  selectedEmbedVideo: Video | null;
  setEmbedVideo: (video: Video | null) => void;
};

export const useVideoStore = create<VideoStoreState>((set, get) => ({
  videos: [],
  loading: false,
  isInitialLoading: true,
  error: null,
  selectedEmbedVideo:null,

  loadVideos: async (isRefresh = false) => {
    const { isInitialLoading, videos: currentVideos } = get();
    try {
      // Only show loading spinner on initial load, not on refresh
      if (!isRefresh) {
        set({ loading: true });
      }

      const data = await getVideoList();
      
      // Smart merge: update existing videos and add new ones without replacing the array
      if (isRefresh && currentVideos.length > 0) {
        const videoMap = new Map(currentVideos.map(v => [v.id, v]));
        
        // Update existing videos and add new ones
        const mergedVideos = data.map(newVideo => {
          const existingVideo = videoMap.get(newVideo.id);
          // Only update if the video data has actually changed
          if (existingVideo && 
              existingVideo.status === newVideo.status &&
              existingVideo.title === newVideo.title &&
              JSON.stringify(existingVideo.processedUrls) === JSON.stringify(newVideo.processedUrls)) {
            return existingVideo; // Keep the same reference to prevent re-render
          }
          return newVideo;
        });
        
        set({
          videos: mergedVideos,
          error: null,
        });
      } else {
        // Initial load or no existing videos
        set({
          videos: data,
          error: null,
        });
      }

      // Mark initial loading as complete
      if (isInitialLoading) {
        set({ isInitialLoading: false });
      }
    } catch (e: any) {
      set({
        error: e?.message || "Failed to fetch videos",
      });
    } finally {
      set({ loading: false });
    }
  },

  refresh: () => {
    // Pass true to indicate this is a refresh (no loading spinner)
    get().loadVideos(true);
  },

  addVideo: (videoId: string) =>
  set((state) => ({
    videos: [
      ...state.videos,
      {
        id: crypto.randomUUID(),
        title: "",
        description: "",
        videoId,
        status: VIDEO_STATUS.PROCESSING,
        uploadedAt: new Date(),
        processedUrls: {},
        originalUrl: "",
        filename: "",
        fileSize: 0,
      },
    ],
  })),
    
   setEmbedVideo: (video: Video | null) => set({ selectedEmbedVideo: video }),
}));
