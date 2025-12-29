import axios from '../utils/axios';

export const createPlayerSession = async (
  videoId: string,
  token: string
): Promise<{
  processedUrls: [];
  expiresIn: number;
}> => {
  const response = await axios.post(
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
  const response = await axios.post(
    `${import.meta.env.VITE_API_BASE_URL}/videos/presigned-url`,
    {
      videoId,
      quality,
    }
  );
  return response.data;
};
