import React, { useState } from 'react';
import {
  XMarkIcon,
  ClipboardIcon,
  CheckIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import type { Video } from '../types';

interface EmbedModalProps {
  isOpen: boolean;
  onClose: () => void;
  video: Video | null;
}

interface EmbedOptions {
  width: number;
  height: number;
  autoplay: boolean;
  controls: boolean;
  muted: boolean;
  loop: boolean;
  responsive: boolean;
}

export const EmbedModal: React.FC<EmbedModalProps> = ({
  isOpen,
  onClose,
  video,
}) => {
  const [embedOptions, setEmbedOptions] = useState<EmbedOptions>({
    width: 640,
    height: 360,
    autoplay: false,
    controls: true,
    muted: false,
    loop: false,
    responsive: true,
  });

  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedIframe, setCopiedIframe] = useState(false);

  const generateEmbedScript = (): string => {
    if (!video) return '';

    const videoUrl = video.processedUrls?.['720p'] || video.originalUrl;
    const { width, height, autoplay, controls, muted, loop, responsive } =
      embedOptions;

    return `<!-- Video Platform Embed Script -->
<div id="video-player-${video.id}" ${responsive ? 'style="position: relative; width: 100%; height: 0; padding-bottom: 56.25%;"' : `style="width: ${width}px; height: ${height}px;"`}>
  <video 
    ${responsive ? 'style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"' : `width="${width}" height="${height}"`}
    ${controls ? 'controls' : ''}
    ${autoplay ? 'autoplay' : ''}
    ${muted ? 'muted' : ''}
    ${loop ? 'loop' : ''}
    preload="metadata"
    poster="${video.thumbnailUrl || ''}"
  >
    <source src="${videoUrl}" type="application/x-mpegURL">
    <source src="${video.originalUrl}" type="video/mp4">
    Your browser does not support the video tag.
  </video>
</div>

<script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
<script>
  (function() {
    const video = document.querySelector('#video-player-${video.id} video');
    const src = '${videoUrl}';
    
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src;
    }
  })();
</script>`;
  };

  const generateIframeEmbed = (): string => {
    if (!video) return '';

    const { width, height, responsive } = embedOptions;
    const baseUrl = window.location.origin;
    const embedUrl = `${baseUrl}/embed/${video.id}`;

    if (responsive) {
      return `<div style="position: relative; width: 100%; height: 0; padding-bottom: 56.25%;">
  <iframe 
    src="${embedUrl}" 
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
    frameborder="0" 
    allowfullscreen>
  </iframe>
</div>`;
    }

    return `<iframe 
  src="${embedUrl}" 
  width="${width}" 
  height="${height}" 
  frameborder="0" 
  allowfullscreen>
</iframe>`;
  };

  const copyToClipboard = async (text: string, type: 'script' | 'iframe') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'script') {
        setCopiedScript(true);
        setTimeout(() => setCopiedScript(false), 2000);
      } else {
        setCopiedIframe(true);
        setTimeout(() => setCopiedIframe(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleOptionChange = (
    key: keyof EmbedOptions,
    value: boolean | number
  ) => {
    setEmbedOptions((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  if (!isOpen || !video) return null;

  const embedScript = generateEmbedScript();
  const iframeEmbed = generateIframeEmbed();

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
            {/* Embed Options */}
            <div className="mb-8">
              <div className="flex items-center space-x-2 mb-4">
                <Cog6ToothIcon className="w-5 h-5 text-gray-500" />
                <h4 className="text-lg font-semibold text-gray-900">
                  Customization Options
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Dimensions */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="responsive"
                      checked={embedOptions.responsive}
                      onChange={(e) =>
                        handleOptionChange('responsive', e.target.checked)
                      }
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label
                      htmlFor="responsive"
                      className="text-sm font-medium text-gray-700"
                    >
                      Responsive (recommended)
                    </label>
                  </div>

                  {!embedOptions.responsive && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Width
                        </label>
                        <input
                          type="number"
                          value={embedOptions.width}
                          onChange={(e) =>
                            handleOptionChange(
                              'width',
                              parseInt(e.target.value)
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          min="200"
                          max="1920"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Height
                        </label>
                        <input
                          type="number"
                          value={embedOptions.height}
                          onChange={(e) =>
                            handleOptionChange(
                              'height',
                              parseInt(e.target.value)
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          min="150"
                          max="1080"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Player Options */}
                <div className="space-y-3">
                  {[
                    { key: 'controls', label: 'Show controls' },
                    { key: 'autoplay', label: 'Autoplay' },
                    { key: 'muted', label: 'Muted' },
                    { key: 'loop', label: 'Loop' },
                  ].map(({ key, label }) => (
                    <div key={key} className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id={key}
                        checked={
                          embedOptions[key as keyof EmbedOptions] as boolean
                        }
                        onChange={(e) =>
                          handleOptionChange(
                            key as keyof EmbedOptions,
                            e.target.checked
                          )
                        }
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label
                        htmlFor={key}
                        className="text-sm font-medium text-gray-700"
                      >
                        {label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Embed Code Sections */}
            <div className="space-y-8">
              {/* JavaScript Embed */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-lg font-semibold text-gray-900">
                    JavaScript Embed (Recommended)
                  </h4>
                  <button
                    onClick={() => copyToClipboard(embedScript, 'script')}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {copiedScript ? (
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
                    <code>{embedScript}</code>
                  </pre>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  This embed includes HLS.js for adaptive streaming and fallback
                  support.
                </p>
              </div>

              {/* iFrame Embed */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-lg font-semibold text-gray-900">
                    iFrame Embed
                  </h4>
                  <button
                    onClick={() => copyToClipboard(iframeEmbed, 'iframe')}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    {copiedIframe ? (
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
                    <code>{iframeEmbed}</code>
                  </pre>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Simple iframe embed for basic integration.
                </p>
              </div>
            </div>
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
