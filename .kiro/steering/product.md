# Product Overview

## Video Transcoding Pipeline

A minimal demo project showcasing an event-driven video processing system using LocalStack. The system demonstrates cloud-based video transcoding workflows in a local development environment.

### Core Functionality
- **Video Upload**: Users upload videos to S3 bucket (`raw-videos`)
- **Event Processing**: S3 events trigger SQS messages for processing
- **Video Transcoding**: Docker containers transcode videos to multiple HLS formats
- **Streaming**: React frontend provides HLS video playback with quality selection

### Architecture Pattern
Event-driven microservices architecture simulating AWS cloud services:
1. S3 upload triggers event
2. SQS queues processing jobs
3. Containerized workers process videos
4. Results stored in processed bucket
5. Frontend streams transcoded content

### Target Use Case
Demonstrates scalable video processing pipelines for educational purposes and local development of cloud-native video applications.