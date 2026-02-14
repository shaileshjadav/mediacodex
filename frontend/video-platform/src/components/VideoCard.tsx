import React from 'react';
import type { Video, VideoStatus } from '../types';
import { VIDEO_STATUS } from '../utils/constants';

interface VideoCardProps {
  video: Video;
  onSelect: () => void;
  onEmbedClick: () => void;
}

const VideoCard: React.FC<VideoCardProps> = ({
  video,
  onSelect,
  onEmbedClick,
}) => {
  const formatDuration = (seconds?: number): string => {
    if (!seconds) return 'Unknown';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: VideoStatus): string => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'QUEUED':
        return 'bg-amber-100 text-amber-800 border border-amber-200';
      case 'UPLOADED':
        return 'bg-purple-100 text-purple-800 border border-purple-200';
      case 'FAILED':
        return 'bg-red-100 text-red-800 border border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const getStatusIcon = (status: VideoStatus) => {
    switch (status) {
      case 'COMPLETED':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        );
      case 'PROCESSING':
        return (
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        );
      case 'FAILED':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
              clipRule="evenodd"
            />
          </svg>
        );
    }
  };

  return (
    <div
      className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl hover:border-gray-300 transition-all duration-300 transform hover:-translate-y-1"
      data-testid="video-card"
    >
      {/* Thumbnail */}
      <div
        className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 cursor-pointer overflow-hidden"
        onClick={onSelect}
      >
        {video.thumbnailUrl ? (
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <div className="text-center">
              <svg
                className="w-16 h-16 text-gray-400 mx-auto mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              <p className="text-xs text-gray-500 font-medium">No Preview</p>
            </div>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-white/90 rounded-full p-3 shadow-lg">
              <svg
                className="w-6 h-6 text-gray-800"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Duration overlay */}
        {video.duration && (
          <div className="absolute bottom-3 right-3 bg-black/80 text-white text-xs px-2.5 py-1 rounded-md font-medium">
            {formatDuration(video.duration)}
          </div>
        )}

        {/* Status overlay */}
        <div
          className={`absolute top-3 left-3 px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-sm ${getStatusColor(video.status)}`}
        >
          {getStatusIcon(video.status)}
          {video.status.charAt(0).toUpperCase() + video.status.slice(1)}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3
          className="font-semibold text-gray-900 mb-2 line-clamp-2 cursor-pointer hover:text-blue-600 transition-colors leading-tight"
          onClick={onSelect}
        >
          {video.title}
        </h3>

        {video.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
            {video.description}
          </p>
        )}

        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            onClick={onEmbedClick}
            className={`w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-medium py-3 px-4 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 ${video.status !== VIDEO_STATUS.COMPLETED ? 'disabled:cursor-not-allowed disabled:opacity-50' : ''}`}
            disabled={video.status !== VIDEO_STATUS.COMPLETED}
          >
           <span className="flex items-center justify-center">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M22 2L11 13"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M22 2L15 22L11 13L2 9L22 2Z"
              />
            </svg>
            Share
          </span>



          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
