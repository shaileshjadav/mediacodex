import { sign, verify, SignOptions } from "jsonwebtoken";

const JWT_SECRET: string = process.env.JWT_SECRET || "your-secret-key";
const JWT_EXPIRES_IN_SECONDS = 300; // 5 minutes

export interface EmbedTokenPayload {
  videoId: string;
  domain?: string;
  userId?: string;
  iat?: number;
  exp?: number;
}

export const generateEmbedToken = (
  payload: Omit<EmbedTokenPayload, "iat" | "exp">,
): string => {
  const options: SignOptions = {
    expiresIn: JWT_EXPIRES_IN_SECONDS,
  };
  return sign(payload, JWT_SECRET, options);
};

export const verifyEmbedToken = (token: string): EmbedTokenPayload => {
  try {
    return verify(token, JWT_SECRET) as EmbedTokenPayload;
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};

export const generateSignedHLS = async (videoId: string): Promise<string> => {
  // For now, return a mock URL - this would be replaced with actual S3 presigned URL logic
  // In a real implementation, you'd generate presigned URLs for the HLS playlist and segments
  const baseUrl =
    process.env.HLS_BASE_URL || "http://localhost:4566/processed-videos";
  return `${baseUrl}/${videoId}/playlist.m3u8`;
};
