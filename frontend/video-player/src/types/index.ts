// Core types for the video platform

export interface Video {
  id: string;
  videoId?: string;
  userId?: string;
  title: string;
  description?: string;
  filename: string;
  originalUrl: string;
  processedUrls: {
    [resolution: string]: string;
  };
  thumbnailUrl?: string;
  duration?: number;
  fileSize: number;
  status: VideoStatus;
  uploadedAt: Date;
  processedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export type VideoStatus =
  | 'uploading'
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed';

export interface ProcessingLog {
  id: string;
  videoId: string;
  level: 'info' | 'warn' | 'error';
  message: string;
  timestamp: Date;
  stage: string;
}

export interface ProcessingStatus {
  videoId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  currentStage: string;
  logs: ProcessingLog[];
  createdAt: Date;
  updatedAt: Date;
}
