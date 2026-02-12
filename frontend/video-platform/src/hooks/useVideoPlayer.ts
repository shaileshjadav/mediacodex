import { create } from "zustand";
import type { Video } from "../types";

type VideoPlayerState = {
  selectedVideo: Video | null;
  selectVideo: (video: Video | null) => void;
  clearSelectedVideo: () => void;
};


export const useVideoPlayerStore = create<VideoPlayerState>((set) => ({
  selectedVideo: null,
  selectVideo: (video: Video | null) => set({ selectedVideo: video }),
  clearSelectedVideo: () => set({ selectedVideo: null }),
}));