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
    `${import.meta.env.VITE_API_BASE_URL}/player/presigned-url`,
    {
      videoId,
      quality,
    },
     { withCredentials: true } // this is required to include cookies in the request, which are needed for CloudFront signed cookies authentication
  );
  return response.data;
};
