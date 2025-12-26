import React, { useState, useRef, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import type { Video } from '../types';
import { usePresignedVideoUrl } from '../hooks/usePresignedVideoUrl';
import { VideoPlayer } from './VideoPlayer';

interface VideoPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  video: Video | null;
}

interface QualityOption {
  label: string;
  value: string;
  url?: string;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  isOpen,
  onClose,
  video,
}) => {
  const [selectedQuality, setSelectedQuality] = useState<string>('720p');
  const [error, setError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const { url, loading } = usePresignedVideoUrl(
    video?.videoId,
    selectedQuality
  );

  // Available quality options based on processed URLs
  const getQualityOptions = (): QualityOption[] => {
    if (!video?.processedUrls) {
      return [
        { label: 'Original', value: 'original', url: video?.originalUrl },
      ];
    }

    const options: QualityOption[] = [];

    // Add processed qualities
    Object.entries(video.processedUrls).forEach(([resolution, url]) => {
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

    // Add original if no processed versions
    if (options.length === 0) {
      options.push({
        label: 'Original',
        value: 'original',
        url: video?.originalUrl,
      });
    }

    return options;
  };

  const qualityOptions = getQualityOptions();

  useEffect(() => {
    if (
      qualityOptions.length > 0 &&
      !qualityOptions.find((q) => q.value === selectedQuality)
    ) {
      console.log('qualityOptions[0].value', qualityOptions[0].value);
      setSelectedQuality(qualityOptions[0].value);
    }
  }, [video, qualityOptions, selectedQuality]);

  const handleQualityChange = (quality: string) => {
    setSelectedQuality(quality);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const handleClose = () => {
    setError(null);
    onClose();
  };

  if (!isOpen || !video) return null;

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 overflow-hidden">
        <div className="flex items-center justify-center min-h-screen">
          <div
            className="fixed inset-0 bg-black bg-opacity-90"
            onClick={handleClose}
          />
          <div className="relative bg-black rounded-lg p-8">
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-lg">Loading video...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 z-50 overflow-hidden">
        <div className="flex items-center justify-center min-h-screen">
          <div
            className="fixed inset-0 bg-black bg-opacity-90"
            onClick={handleClose}
          />
          <div className="relative bg-black rounded-lg p-8 max-w-md">
            <div className="text-white text-center">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h2 className="text-xl font-semibold mb-2">Playback Error</h2>
              <p className="text-gray-300 mb-4">{error}</p>
              <button
                onClick={handleClose}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="flex items-center justify-center min-h-screen">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-black bg-opacity-90 transition-opacity"
          onClick={handleClose}
        />

        {/* Modal panel */}
        <div
          ref={containerRef}
          className="relative w-full max-w-6xl mx-4 bg-black rounded-lg overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4">
            <div className="flex items-center justify-between">
              <div className="text-white">
                <h3 className="text-lg font-semibold truncate">
                  {video.title || `Video ${video.id}`}
                </h3>
                {video.description && (
                  <p className="text-sm text-gray-300 truncate">
                    {video.description}
                  </p>
                )}
              </div>
              <button
                onClick={handleClose}
                className="text-white hover:text-gray-300 hover:bg-white/10 rounded-lg p-2 transition-all duration-200"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Video Player */}
          <div className="aspect-video">
            {url && (
              <VideoPlayer
                src={url}
                poster={video.thumbnailUrl}
                autoPlay={false}
                controls={true}
                className="w-full h-full"
                onError={handleError}
                showQualitySelector={true}
                availableQualities={qualityOptions.map((q) => ({
                  label: q.label,
                  value: q.value,
                  url: q.url || '',
                }))}
                onQualityChange={handleQualityChange}
                selectedQuality={selectedQuality}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
