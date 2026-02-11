import { useVideoStore } from "../contexts/VideoContext";

export const useVideos = () => {
  // Thin wrapper so existing callers don't change.
  return useVideoStore();
};