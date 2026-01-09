import type {
  VideoUploadUrlRequest,
  VideoUploadUrlResponse,
} from '../types/video';
import type { Video } from '../types';
import api from '../utils/axios';
import axios from 'axios';

export const getVideoUploadUrl = async (
  data: VideoUploadUrlRequest
): Promise<VideoUploadUrlResponse> => {
  const response = await api.post(
    `${import.meta.env.VITE_API_BASE_URL}/videos/upload-url`,
    data
  );
  return response.data;
};

export const getVideoList = async (): Promise<Video[]> => {
  const response = await api.get(
    `${import.meta.env.VITE_API_BASE_URL}/videos`
  );
  return response.data;
};

export const generateEmbedCode = async (
  videoId: string,
  domain?: string
): Promise<{
  token: string;
  embedUrl: string;
  embedCode: string;
  expiresIn: number;
}> => {
  const response = await api.post(
    `${import.meta.env.VITE_API_BASE_URL}/videos/${videoId}/embed`,
    {
      domain,
    }
  );
  return response.data;
};

export const createPlayerSession = async (
  videoId: string,
  token: string
): Promise<{
  playbackUrl: string;
  expiresIn: number;
}> => {
  const response = await api.post(
    `${import.meta.env.VITE_API_BASE_URL}/player/session`,
    {
      videoId,
      token,
    }
  );
  return response.data;
};

export const getVideoPresignedUrl = async (
  videoId: string,
  quality: string
): Promise<any> => {
  const response = await api.post(
    `${import.meta.env.VITE_API_BASE_URL}/videos/presigned-url`,
    {
      videoId,
      quality,
    }
  );
  return response.data;
};

export const uploadOnObjectStore = (
  uploadUrl: string,
  uploadData: any,
  onProgress: (p: number) => void
): Promise<any> => {
  // used axois for direct upload on object store server.
  return axios.put(uploadUrl, uploadData, {
    onUploadProgress: (e) => {
      onProgress(Math.round((e.loaded * 100) / e.total!));
    },
  });
};
