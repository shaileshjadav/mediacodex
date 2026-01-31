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
  | "UPLOADED"
  | "QUEUED"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED";

