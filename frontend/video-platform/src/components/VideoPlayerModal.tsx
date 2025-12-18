import React, { useState, useRef, useEffect } from 'react';
import { XMarkIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import ReactPlayer from 'react-player';
import type { Video } from '../types';
import Hls from 'hls.js';
import { usePresignedVideoUrl } from '../hooks/usePresignedVideoUrl';

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
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const { url, loading } = usePresignedVideoUrl(
    video?.videoId,
    selectedQuality
  );

  // HLS setup effect
  useEffect(() => {
    if (!video || !videoRef.current) return;
    console.log('URL', url);
    if (!url) return;

    // Cleanup previous HLS instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (Hls.isSupported()) {
      // If HLS.js is supported, initialize it
      const hls = new Hls();
      hlsRef.current = hls;

      hls.loadSource(url);
      hls.attachMedia(videoRef.current);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log('Manifest parsed, video ready to play');
      });

      hls.on(Hls.Events.ERROR, (_event: any, data: any) => {
        console.error('HLS error:', data);
        // Implement custom error handling or recovery
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.log('Fatal network error encountered, try to recover');
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.log('Fatal media error encountered, try to recover');
              hls.recoverMediaError();
              break;
            default:
              console.log('Fatal error, cannot recover');
              hls.destroy();
              break;
          }
        }
      });
    } else if (videoRef.current?.canPlayType('application/vnd.apple.mpegurl')) {
      // Fallback for native HLS support (e.g., in Safari)
      videoRef.current.src = url;
    }

    // Cleanup function
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [video, selectedQuality]);

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
  const currentVideoUrl =
    qualityOptions.find((q) => q.value === selectedQuality)?.url ||
    video?.originalUrl;
  useEffect(() => {
    if (
      qualityOptions.length > 0 &&
      !qualityOptions.find((q) => q.value === selectedQuality)
    ) {
      console.log('qualityOptions[0].value', qualityOptions[0].value);
      setSelectedQuality(qualityOptions[0].value);
    }
  }, [video, qualityOptions, selectedQuality]);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (videoRef.current) {
      videoRef.current.volume = vol;
    }
  };

  const handleQualityChange = (quality: string) => {
    const currentTimeBeforeChange = videoRef.current?.currentTime || 0;
    const wasPlaying = isPlaying;

    setSelectedQuality(quality);
    setShowQualityMenu(false);

    // Restore playback state after quality change
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.currentTime = currentTimeBeforeChange;
        if (wasPlaying) {
          videoRef.current.play();
        }
      }
    }, 100);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleClose = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setIsPlaying(false);
    setCurrentTime(0);
    onClose();
  };

  if (!isOpen || !video) return null;

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
                  {video.title}
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
          <div className="relative aspect-video bg-black">
            <ReactPlayer
              width="100%"
              height="100%"
              ref={videoRef}
              src={url}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              poster={video.thumbnailUrl}
              preload="metadata"
            />

            {/* Play/Pause Overlay */}
            <div
              className="absolute inset-0 flex items-center justify-center cursor-pointer"
              onClick={handlePlayPause}
            >
              {!isPlaying && (
                <div className="bg-black/50 rounded-full p-4 hover:bg-black/70 transition-colors">
                  <svg
                    className="w-12 h-12 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
            {/* Progress Bar */}
            <div className="mb-4">
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(currentTime / duration) * 100}%, #4b5563 ${(currentTime / duration) * 100}%, #4b5563 100%)`,
                }}
              />
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center space-x-4">
                {/* Play/Pause */}
                <button
                  onClick={handlePlayPause}
                  className="hover:text-blue-400 transition-colors"
                >
                  {isPlaying ? (
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                    </svg>
                  ) : (
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </button>

                {/* Time Display */}
                <span className="text-sm font-mono">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>

                {/* Volume Control */}
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                  </svg>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {/* Quality Selector */}
                <div className="relative">
                  <button
                    onClick={() => setShowQualityMenu(!showQualityMenu)}
                    className="flex items-center space-x-1 hover:text-blue-400 transition-colors"
                  >
                    <Cog6ToothIcon className="w-5 h-5" />
                    <span className="text-sm">{selectedQuality}</span>
                  </button>

                  {showQualityMenu && (
                    <div className="absolute bottom-full right-0 mb-2 bg-black/90 rounded-lg border border-gray-600 overflow-hidden">
                      <div className="py-1">
                        <div className="px-3 py-2 text-xs text-gray-400 border-b border-gray-600">
                          Quality
                        </div>
                        {qualityOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => handleQualityChange(option.value)}
                            className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-700 transition-colors ${
                              selectedQuality === option.value
                                ? 'text-blue-400 bg-gray-700'
                                : 'text-white'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Fullscreen */}
                <button
                  onClick={toggleFullscreen}
                  className="hover:text-blue-400 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
};
