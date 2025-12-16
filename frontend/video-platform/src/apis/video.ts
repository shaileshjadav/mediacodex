import type { VideoUploadUrlRequest, VideoUploadUrlResponse } from '../types/video';
import type { Video } from '../types';
import axios from '../utils/axios';



export const getVideoUploadUrl = async (data: VideoUploadUrlRequest): Promise<VideoUploadUrlResponse> => {
  const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/videos/upload-url`, data);
  return response.data;
};

export const getVideoList = async (): Promise<Video[]> => {
  const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/videos`);
  return response.data;
};

export const uploadOnObjectStore = (
  uploadUrl: string,
  uploadData: any,
  onProgress: (p: number) => void
): Promise<any> => {
  return axios.put(uploadUrl, uploadData, {
    onUploadProgress: (e) => {
      onProgress(Math.round((e.loaded * 100) / e.total!));
    },
  });
}