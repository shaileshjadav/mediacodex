import React, { useState, useEffect , useCallback} from 'react';
import {
  XMarkIcon,
  ClipboardIcon,
  CheckIcon,
  ShareIcon,
} from '@heroicons/react/24/outline';
import type { Video } from '../types';
import { generateShareUrl } from '../apis/video';

interface EmbedModalProps {
  isOpen: boolean;
  onClose: () => void;
  video: Video | null;
}

export const EmbedModal: React.FC<EmbedModalProps> = ({
  isOpen,
  onClose,
  video,
}) => {
  const [shareUrl, setShareUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState(false);


  const fetchEmbedCode = useCallback(async () => {
    if (!video) return;

    try {
      setLoading(true);
      setError(null);
      const response = await generateShareUrl(video.videoId);
      
      
      setShareUrl(response.url);
      
    } catch (err: any) {
      console.error('Failed to generate embed code:', err);
      setError(err.response?.data?.error || 'Failed to generate embed code');
    } finally {
      setLoading(false);
    }
  },[video]);

  
  useEffect(() => {
    if (isOpen && video) {
      fetchEmbedCode();
    }
  }, [isOpen, video, fetchEmbedCode]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
      
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  if (!isOpen || !video) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />

        {/* Modal panel */}
        <div className="relative inline-block align-middle bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all w-full max-w-4xl mx-4">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 px-8 py-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <ShareIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Share Video
                  </h3>
                  <p className="text-sm text-gray-600">{video.title}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-2 transition-all duration-200"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white px-8 py-8">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">
                  Generating share link...
                </span>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-red-500 text-xl mb-2">⚠️</div>
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={fetchEmbedCode}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Share URL Section */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-semibold text-gray-900">
                      Share Link
                    </h4>
                    <button
                      onClick={() => copyToClipboard(shareUrl)}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      {copiedUrl ? (
                        <>
                          <CheckIcon className="w-4 h-4" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <ClipboardIcon className="w-4 h-4" />
                          <span>Copy Link</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      readOnly
                      value={shareUrl}
                      className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-3 pr-12 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Share this link with anyone to give them access to the video
                  </p>
                </div>


                {/* Info Banner */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <svg
                      className="w-5 h-5 text-blue-600 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div>
                      <p className="text-sm text-blue-800 font-medium">
                        Secure Access
                      </p>
                      <p className="text-xs text-blue-700 mt-1">
                        This link includes secure token-based authentication and will expire in 24 hours
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-4 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-3 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
