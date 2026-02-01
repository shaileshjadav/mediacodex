// Core types for the video platform

import type { VIDEO_STATUS } from "../utils/constants";

export interface User {
  id: string;
  clerkId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Video {
  id: string;
  videoId: string;
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

// as const + union type
export type VideoStatus = typeof VIDEO_STATUS[keyof typeof VIDEO_STATUS];

