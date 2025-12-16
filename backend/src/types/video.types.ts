/**
 * Request body for generating S3 pre-signed upload URL
 */
export interface GetUploadUrlRequestBody {
  fileName: string;
  contentType: string;
}

/**
 * Response returned to frontend for direct S3 upload
 */
export interface GetUploadUrlResponse {
  uploadUrl: string;
  key: string;
}

/**
 * Video processing status lifecycle
 */
export type VideoStatus =
  | "UPLOADED"
  | "QUEUED"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED";

/**
 * Video metadata stored in DB
 */
export interface VideoEntity {
  id: string;
  originalName: string;
  s3Bucket: string;
  s3Key: string;
  contentType: string;
  size?: number;
  status: VideoStatus;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Payload sent to SQS for transcoding
 */
export interface TranscodingJobPayload {
  videoId: string;
  s3Bucket: string;
  s3Key: string;
  outputFormats: Array<{
    resolution: "720p" | "1080p" | "4k";
    codec: "h264" | "h265";
  }>;
}

export interface Video {
  id:string;
  userId:string;
  videoId:string;
  status:string;
  createdAt:string;
  updatedAt:string;
}

/**
 * Payload for insert new video into db
 */
export interface InsertVideoPayload {
    userId: string;
    videoId:string;
    status: string;
}

/** When inserts new video into db  */
export interface InsertedVideo {
    id:number;
}


export interface VideoList {
  videos: Video[];
  // total: number;
  // page: number;
  // limit: number;
}