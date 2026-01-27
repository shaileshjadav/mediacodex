import { useState } from 'react';
import { PlayIcon, PauseIcon } from '@heroicons/react/24/solid';

const DemoVideo = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl overflow-hidden shadow-2xl">
      {/* Video placeholder */}
      <div className="aspect-video bg-gradient-to-br from-blue-900 to-indigo-900 flex items-center justify-center relative">
        {/* Play button overlay */}
        <button
          onClick={togglePlay}
          className="group relative z-10 w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 hover:scale-110"
        >
          {isPlaying ? (
            <PauseIcon className="w-8 h-8 text-white ml-0" />
          ) : (
            <PlayIcon className="w-8 h-8 text-white ml-1" />
          )}
        </button>

        {/* Video content simulation */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white/80">
            <div className="text-6xl font-bold mb-4">🎬</div>
            <div className="text-xl font-semibold mb-2">Demo Video</div>
            <div className="text-sm opacity-75">See how easy video transcoding can be</div>
          </div>
        </div>

        {/* Progress bar */}
        {isPlaying && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-white/20 rounded-full h-1 overflow-hidden">
              <div className="bg-white h-full rounded-full animate-pulse" style={{ width: '30%' }}></div>
            </div>
          </div>
        )}

        {/* Video controls overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
          <div className="flex items-center justify-between text-white text-sm">
            <span>Professional Video Transcoding</span>
            <span>2:34</span>
          </div>
        </div>
      </div>

      {/* Video info */}
      <div className="p-6 bg-white">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          How Video Transcoding Works
        </h3>
        <p className="text-gray-600 text-sm">
          Watch this quick demo to see how our platform transforms your videos into optimized, 
          streamable content ready for global delivery.
        </p>
      </div>
    </div>
  );
};

export default DemoVideo;