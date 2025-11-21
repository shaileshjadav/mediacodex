// File: src/components/CustomVideoPlayer.js

import React, { useState } from 'react';
import ReactPlayer from 'react-player';

const CustomVideoPlayer = ({ posterUrl, autoplay = true }) => {
  const [quality, setQuality] = useState('720p'); // Default quality

  // URLs for different qualities (replace with your actual HLS URLs)
  const sources = {
    // '144p': 'https://s3.ap-south-1.amazonaws.com/shailesh.dev-learn/transcoded-videos/256x144/playlist.m3u8',
    // '360p': 'https://s3.ap-south-1.amazonaws.com/shailesh.dev-learn/transcoded-videos/640x360/playlist.m3u8',
    // '720p': 'https://s3.ap-south-1.amazonaws.com/shailesh.dev-learn/transcoded-videos/1280x720/playlist.m3u8',
    // '480p': 'https://s3.ap-south-1.amazonaws.com/shailesh.dev-learn/transcoded-videos/854x480/playlist.m3u8',
    // '1080p': 'https://s3.ap-south-1.amazonaws.com/shailesh.dev-learn/transcoded-videos/1920x1080/playlist.m3u8',
    
    // '144p': 'http://localhost:4566/processed-videos/transcoded-videos/256x144/playlist.m3u8',
    // '360p': 'http://localhost:4566/processed-videos/transcoded-videos/640x360/playlist.m3u8',
    '720p': 'http://localhost:4566/processed-videos/transcoded-videos/1280x720/playlist.m3u8',
    // '480p': 'http://localhost:4566/processed-videos/transcoded-videos/854x480/playlist.m3u8',
    // '1080p':'http://localhost:4566/processed-videos/transcoded-videos/1920x1080/playlist.m3u8',
    
  };

  const handleQualityChange = (event) => {
    setQuality(event.target.value);
  };

  return (
    <div>
      <h3>Select Video Quality:</h3>
      <select value={quality} onChange={handleQualityChange}>
        <option value="144p">144p</option>
        <option value="360p">360p</option>
        <option value="480p">480p</option>
        <option value="720p">720p</option>
        <option value="1080p">1080p</option>
      </select>

      <ReactPlayer
        url={sources[quality]} // Dynamically select the HLS stream based on user choice
        playing={autoplay}
        controls
        // light={posterUrl} // Poster URL shown before playing
        width="100%"
        height="500px"
      />
    </div>
  );
};

export default CustomVideoPlayer;
