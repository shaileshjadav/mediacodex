import React, { useState, useEffect , useCallback} from 'react';
import {
  XMarkIcon,
  ClipboardIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import type { Video } from '../types';
import { generateEmbedCode } from '../apis/video';

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
  const [embedCode, setEmbedCode] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);


  const fetchEmbedCode = useCallback(async () => {
    if (!video) return;

    try {
      setLoading(true);
      setError(null);
      const response = await generateEmbedCode(video.videoId);
      setEmbedCode(response.embedCode);
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
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
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
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Embed Video
                  </h3>
                  <p className="text-sm text-gray-600">Video ID: {video.id}</p>
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
                  Generating embed code...
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
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-lg font-semibold text-gray-900">
                    Embed Code
                  </h4>
                  <button
                    onClick={() => copyToClipboard(embedCode)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {copied ? (
                      <>
                        <CheckIcon className="w-4 h-4" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <ClipboardIcon className="w-4 h-4" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="relative">
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{embedCode}</code>
                  </pre>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  This embed code includes secure token-based authentication and
                  will expire in 5 minutes.
                </p>
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
