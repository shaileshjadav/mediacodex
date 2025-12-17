import { useContext } from "react";
import { VideoContext } from "../contexts/VideoContext";

export const useVideos = () => {
  const ctx = useContext(VideoContext);
  if (!ctx) {
    throw new Error("useVideos must be used inside VideoProvider");
  }
  return ctx;
};