import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import axios from '../utils/axios';

interface PlayerSession {
  playbackUrl: string;
  expiresIn: number;
}

const EmbedPage: React.FC = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [playbackUrl, setPlaybackUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const createPlayerSession = async () => {
      if (!videoId || !token) {
        setError('Missing video ID or token');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.post<PlayerSession>(
          `${import.meta.env.VITE_API_BASE_URL}/player/session`,
          {
            videoId,
            token,
          }
        );

        setPlaybackUrl(response.data.playbackUrl);
      } catch (err: any) {
        console.error('Failed to create player session:', err);
        setError(err.response?.data?.error || 'Failed to load video');
      } finally {
        setLoading(false);
      }
    };

    createPlayerSession();
  }, [videoId, token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading video...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-white text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold mb-2">Video Unavailable</h2>
          <p className="text-gray-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-full max-w-4xl aspect-video">
        {playbackUrl ? (
          <video
            controls
            className="w-full h-full"
            poster="/video-placeholder.jpg"
          >
            <source src={playbackUrl} type="application/x-mpegURL" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
            <p className="text-white">No video source available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmbedPage;
