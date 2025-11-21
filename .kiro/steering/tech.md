# Technology Stack

## Core Technologies
- **LocalStack**: Local AWS cloud stack (S3, SQS)
- **Node.js**: Backend services and event processing
- **TypeScript**: Backend development with type safety
- **React**: Frontend video streaming interface
- **Docker**: Containerized video processing workers
- **FFmpeg**: Video transcoding engine

## Backend Stack
- **Express.js**: Web server framework
- **AWS SDK v3**: Cloud service interactions
- **Dockerode**: Docker container management
- **dotenv**: Environment configuration

## Frontend Stack
- **Vite**: Build tool and dev server
- **React Player**: Video playback component
- **Video.js**: Advanced video player features
- **ESLint**: Code linting

## Video Processing
- **fluent-ffmpeg**: FFmpeg wrapper for Node.js
- **HLS (HTTP Live Streaming)**: Adaptive bitrate streaming
- **Multiple resolutions**: 1080p, 720p, 480p, 360p

## Common Commands

### Development
```bash
# Start LocalStack
docker-compose up -d

# Setup infrastructure
./infra/setup.sh

# Backend development
cd backend && npm run dev

# Frontend development
cd frontend/hls-streaming && npm run dev

# Container processing
cd container && npm start
```

### Testing
```bash
# Upload test video
aws --endpoint-url=http://localhost:4566 s3 cp sample.mp4 s3://raw-videos/

# Check SQS messages
aws --endpoint-url=http://localhost:4566 sqs receive-message --queue-url <queue-url>
```

### Build
```bash
# Frontend build
cd frontend/hls-streaming && npm run build

# Backend build (TypeScript)
cd backend && npx tsc
```