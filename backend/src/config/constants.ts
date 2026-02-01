export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
} as const;

export const RESOLUTION_MAP: Record<string, string> = {
  '1920x1080': '1080p',
  '1280x720': '720p',
  '854x480': '480p',
  '640x360': '360p',
};

export const AWS_PROCESSED_BUCKET: string|undefined = process.env.AWS_PROCESSED_BUCKET;

export const CLOUDFRONT_DOMAIN_NAME: string|undefined = process.env.CLOUDFRONT_DOMAIN_NAME;
export const CLOUDFRONT_PRIVATE_KEY_PATH: string|undefined = process.env.CLOUDFRONT_PRIVATE_KEY_PATH;
export const CLOUDFRONT_KEY_PAIR_ID: string|undefined = process.env.CLOUDFRONT_KEY_PAIR_ID;

export const VIDEO_STATUS = {
  UPLOADED: "UPLOADED",
  PROCESSING: "PROCESSING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
} as const;

export const VIDEO_STATUS_CRON_INTERVAL_MINUTES: number = process.env.VIDEO_STATUS_CRON_INTERVAL_MINUTES
  ? parseInt(process.env.VIDEO_STATUS_CRON_INTERVAL_MINUTES, 10)
  : 5;