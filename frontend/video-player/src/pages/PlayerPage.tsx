import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { createPlayerSession } from '../apis/video';
import { VideoPlayer } from '../components/VideoPlayer';
import { usePresignedVideoUrl } from '../hooks/usePresignedVideoUrl';

const PlayerPage: React.FC = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedQuality, setSelectedQuality] = useState<string>('720p');
  const { url, loading: isGeneratingVideoUrl } = usePresignedVideoUrl(
    videoId,
    selectedQuality
  );

  interface QualityOption {
    label: string;
    value: string;
    url: string;
  }

  const [processedUrls, setProcessedUrls] = useState([]);

  // Available quality options based on processed URL
  const getQualityOptions = (): QualityOption[] => {
    const options: QualityOption[] = [];

    // Add processed qualities
    Object.entries(processedUrls).forEach(([resolution, url]) => {
      options.push({
        label: resolution,
        value: resolution,
        url: url,
      });
    });

    // Sort by quality (highest first)
    const qualityOrder = ['1080p', '720p', '480p', '360p', '240p'];
    options.sort((a, b) => {
      const aIndex = qualityOrder.indexOf(a.value);
      const bIndex = qualityOrder.indexOf(b.value);
      return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
    });

    return options;
  };

  const qualityOptions = getQualityOptions();

  useEffect(() => {
    if (
      qualityOptions.length > 0 &&
      !qualityOptions.find((q) => q.value === selectedQuality)
    ) {
      setSelectedQuality(qualityOptions[0].value);
    }
  }, [qualityOptions, selectedQuality]);

  useEffect(() => {
    const initializePlayer = async () => {
      if (!videoId || !token) {
        setError('Missing video ID or token');
        setLoading(false);
        return;
      }

      try {
        const session = await createPlayerSession(videoId, token);
        setProcessedUrls(session.processedUrls);
      } catch (err: any) {
        console.error('Failed to create player session:', err);
        setError(err.response?.data?.error || 'Failed to load video');
      } finally {
        setLoading(false);
      }
    };

    initializePlayer();
  }, [videoId, token]);

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };
  const handleQualityChange = (quality: string) => {
    setSelectedQuality(quality);
  };
  if (loading || isGeneratingVideoUrl) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg">Loading video...</p>
          <p className="text-sm text-gray-400 mt-2">Validating access token</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-white text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">🚫</div>
          <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
          <p className="text-gray-300 mb-4">{error}</p>
          <div className="text-sm text-gray-500">
            <p>This could be due to:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Expired or invalid token</li>
              <li>Video not found</li>
              {/* <li>Domain not authorized</li> */}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden shadow-2xl">
          {url ? (
            <VideoPlayer
              src={url}
              poster="/video-placeholder.jpg"
              autoPlay={true}
              controls={true}
              className="w-full h-full"
              onError={handleError}
              availableQualities={qualityOptions}
              showQualitySelector={true}
              onQualityChange={handleQualityChange}
              selectedQuality={selectedQuality}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-4xl mb-4">📹</div>
                <p>No video source available</p>
              </div>
            </div>
          )}
        </div>

        {/* Video Info */}
        <div className="mt-4 text-center">
          <p className="text-gray-400 text-sm">
            Video ID: {videoId} | Secure Playback Session
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlayerPage;
