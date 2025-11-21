# Project Structure

## Root Level
- `docker-compose.yml`: LocalStack service configuration
- `README.md`: Project documentation and setup instructions
- `sample.mp4`: Test video file for uploads

## Core Directories

### `/backend`
TypeScript/Node.js backend service
- `src/index.ts`: Express server entry point
- `src/sqs-listener.ts`: SQS event processing
- `src/dockerode.ts`: Docker container management
- `src/presigner.ts`: S3 URL signing utilities
- `.env`: Environment variables (not committed)
- `package.json`: Backend dependencies and scripts

### `/container`
Video processing worker (Docker container)
- `index.js`: Main transcoding logic using FFmpeg
- `Dockerfile`: Container build configuration
- `package.json`: Processing dependencies (fluent-ffmpeg, AWS SDK)
- `.env`: Container environment variables

### `/frontend/hls-streaming`
React video streaming application
- `src/App.jsx`: Main application component
- `src/components/CustomVideoPlayer.jsx`: Video player with quality selection
- `public/`: Static assets
- `vite.config.js`: Vite build configuration

### `/infra`
Infrastructure setup scripts
- `setup.sh`: Creates S3 buckets, SQS queues, and event notifications

### `/localstack`
LocalStack data persistence directory

## File Naming Conventions
- TypeScript files: `.ts` extension for backend
- React components: PascalCase `.jsx` files
- Configuration files: lowercase with hyphens
- Environment files: `.env` (excluded from git)

## Key Configuration Files
- `tsconfig.json`: TypeScript compiler settings
- `eslint.config.js`: Frontend linting rules
- `.gitignore`: Excludes node_modules, .env, dist folders
- `package-lock.json`: Dependency lock files (committed)

## Architecture Separation
- **Backend**: Event processing and API services
- **Container**: Isolated video processing workers
- **Frontend**: User interface for video streaming
- **Infra**: Infrastructure as code scripts