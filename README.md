# Mediacodex

A distributed, container-orchestrated video transcoding and streaming platform built with AWS, Node.js, and React.

**Website**: [https://mediacodex.cloud](https://mediacodex.cloud)

---

##  Problem Statement

Building a video platform that encodes videos and streams them via a generated link. Users can securely share videos with others by simply providing a protected sharing URL.

---

## Description

Mediacodex is a distributed video transcoding system that delivers HLS streaming capabilities through sharable link. The platform handles video upload, transcoding into multiple resolutions, secure storage, and CDN-powered streaming - all accessible through an video player.

---

## Demo




https://github.com/user-attachments/assets/0436c029-7a8c-46b1-aa1b-8c3a922796b3


## Key Highlights

- **Encoding**: Videos are transcoded into multiple formats (360p, 720p, 1080p) using FFmpeg in separate, isolated environments powered by AWS Fargate containers.

- **Streaming**: Videos are delivered using HLS streaming format with manifest files (.m3u8) and segment files (.ts), distributed globally via CloudFront CDN.

- **Sharing**: Videos can be easily share to user by sharing URL. The player includes built-in token validation and session management.

- **Security**: Video streaming uses CloudFront signed cookies to deliver content securely, ensuring only authorized users can access videos.

---

## Features

### Transcoding
- When a user uploads a video, AWS Fargate is triggered via SQS notification
- Worker containers download the uploaded video and transcode it into multiple resolutions
- Transcoded videos are uploaded to a separate S3 bucket for streaming

### Sharing
- Users can share videos with streaming capabilities by sharing a link
- Share links include secure token-based authentication

### Streaming
- End users can view videos in streaming mode by opening the shared link
- Session/token validation occurs before playback
- After validation, signed cookies are generated for secure content delivery
- Users can switch between multiple quality formats seamlessly

---

## Architecture

```
Client Uploads Video
        ↓
API Gateway (Node.js / Express)
        ↓
S3 Bucket (raw-videos)
        ↓
SQS Notification Trigger
        ↓
Worker Orchestrator
        ↓
AWS Fargate (FFmpeg Containers)
        ↓
Transcoding (360p, 720p, 1080p)
        ↓
S3 Bucket (processed-videos)
        ↓
CloudFront CDN
        ↓
HLS Manifest Generation (.m3u8)
        ↓
Video Player (with signed cookies)
        ↓
End User Streaming
```

### Architecture Flow

1. **Upload**: User uploads video through the web interface
2. **Storage**: Video is stored in S3 raw-videos bucket
3. **Trigger**: S3 event triggers SQS notification
4. **Processing**: SQS message triggers AWS Fargate task
5. **Transcoding**: Fargate container downloads video and transcodes using FFmpeg
6. **Output**: Transcoded files uploaded to processed-videos bucket
7. **Distribution**: CloudFront CDN serves HLS streams globally
8. **Playback**: Video player validates tokens and generates signed cookies for secure streaming

---

## Tech Stack

### Backend
- Node.js / Express
- AWS S3 (Storage)
- AWS SQS (Message Queue)
- AWS Fargate (Container Orchestration)
- AWS ECR (Container Registry)
- AWS CloudFront (CDN)
- FFmpeg (Video Transcoding)

### Frontend 
- React.js
- TypeScript
- Tailwind CSS
- Vite

### Infrastructure
- Terraform (IaC)
- Docker
- LocalStack (Local Development)

---

## Getting Started

### Prerequisites
- Docker & Docker Compose
- Node.js (v18+)
- AWS CLI
- Terraform (for infrastructure deployment)

### Local Development Setup

### 1. Start LocalStack
```sh
docker-compose up -d
```

### 2. Run setup script
```sh
terraform apply
```

### 3. Install dependencies

**Backend:**
```sh
cd backend
npm install
```

**Frontend:**
```sh
cd frontend/video-platform
npm install
```

**Frontend: Video player**
```sh
cd frontend/video-player
npm install
```

### 4. Configure environment variables

Copy `.env.example` to `.env` in respective directories and configure:
- Backend: Database, AWS credentials, CloudFront keys
- Frontend: API endpoints

### 5. Generate CloudFront keys (for signed cookies)
```sh
openssl genrsa -out backend/certs/cloudfront_private_key.pem 2048
openssl rsa -pubout -in backend/certs/cloudfront_private_key.pem -out backend/certs/cloudfront_public_key.pem
```

### 6. Start the services

**Backend:**
```sh
cd backend
npm run dev
```

**Frontend:**
```sh
cd frontend/video-platform
npm run dev
```

**Frontend: Video player**
```sh
cd frontend/video-player
npm run dev
```
---

##  Project Structure

```
video-transcoding/
├── backend/              # Node.js API server
│   ├── src/             # Source code
│   ├── db/              # Database migrations
│   ├── certs/           # CloudFront certificates
│   └── hls/             # HLS output files
├── frontend/
│   ├── video-platform/  # Main React app
│   └── video-player/    # Embeddable video player
├── container/           # FFmpeg transcoding container
├── infra/
│   └── terraform/       # Infrastructure as Code
└── docker-compose.yml   # LocalStack setup
```

---

## 🔧 Configuration

### Backend Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `AWS_REGION`: AWS region
- `S3_RAW_BUCKET`: Raw video storage bucket
- `S3_PROCESSED_BUCKET`: Transcoded video bucket
- `CLOUDFRONT_DOMAIN`: CloudFront distribution domain
- `CLOUDFRONT_KEY_PAIR_ID`: CloudFront key pair ID

### Frontend Environment Variables
- `VITE_API_URL`: Backend API endpoint
- `VITE_CLOUDFRONT_DOMAIN`: CloudFront domain for video delivery

---

##  Deployment

### Infrastructure Setup
```sh
cd infra/terraform
terraform init
terraform plan
terraform apply
```

### Container Deployment
```sh
cd container
docker build -t mediacodex-transcoder .
docker tag mediacodex-transcoder:latest <ECR_REPO_URL>:latest
docker push <ECR_REPO_URL>:latest
```


##  Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

##  License

MIT

