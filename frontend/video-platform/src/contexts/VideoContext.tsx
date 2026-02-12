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
  isEmbedModalOpen: boolean;
  setIsEmbedModalOpen: () => void,
  setIsEmbedModalClose: () => void,
};

export const useVideoStore = create<VideoStoreState>((set, get) => ({
  videos: [],
  loading: false,
  isInitialLoading: true,
  error: null,
  isEmbedModalOpen: false,

  loadVideos: async (isRefresh = false) => {
    const { isInitialLoading } = get();
    try {
      // Only show loading spinner on initial load, not on refresh
      if (!isRefresh) {
        set({ loading: true });
      }

      const data = await getVideoList();
      set({
        videos: data,
        error: null,
      });

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

  addVideo: (videoId: string) => {
    set((state) => {
      const newVideos = [...state.videos];
      const tempVideo: Video = {
        id: newVideos.length.toString(),
        title: "",
        description: "",
        videoId,
        status: VIDEO_STATUS.PROCESSING,
        uploadedAt: new Date(),
        processedUrls: {},
        originalUrl: "",
        filename: "",
        fileSize: 0,
      };
      newVideos.push(tempVideo);
      return { videos: newVideos };
    });
  },
   setIsEmbedModalOpen: () => set(() => ({ isEmbedModalOpen: true })),
   setIsEmbedModalClose: () => set(() => ({ isEmbedModalOpen: false })),
}));
