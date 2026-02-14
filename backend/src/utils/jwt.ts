import { sign, verify, SignOptions } from "jsonwebtoken";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "../config/aws";

const JWT_SECRET: string = process.env.JWT_SECRET || "your-secret-key";
const JWT_EXPIRES_IN_SECONDS = 24 * 60 * 60; // 24 hours

export interface EmbedTokenPayload {
  videoId: string;
  domain?: string;
  userId?: string;
  iat?: number;
  exp?: number;
}

export const generateToken = (
  payload: Omit<EmbedTokenPayload, "iat" | "exp">,
): string => {
  const options: SignOptions = {
    expiresIn: JWT_EXPIRES_IN_SECONDS,
  };
  return sign(payload, JWT_SECRET, options);
};

export const verifyToken = (token: string): EmbedTokenPayload => {
  try {
    return verify(token, JWT_SECRET) as EmbedTokenPayload;
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};


// Function to generate signed URLs for all available qualities
export const generateSignedHLSQualities = async (
  videoId: string,
): Promise<{
  [quality: string]: string;
}> => {
  const bucket = process.env.AWS_PROCESSED_BUCKET || "processed-videos";
  const qualities = ["1920x1080", "1280x720", "854x480", "640x360"];
  const signedUrls: { [quality: string]: string } = {};

  for (const quality of qualities) {
    try {
      const playlistKey = `${videoId}/${quality}/playlist.m3u8`;

      const command = new GetObjectCommand({
        Bucket: bucket,
        Key: playlistKey,
      });

      const signedUrl = await getSignedUrl(s3Client, command, {
        expiresIn: JWT_EXPIRES_IN_SECONDS,
      });

      signedUrls[quality] = signedUrl;
    } catch (error) {
      console.log(`Quality ${quality} not available for video ${videoId}`);
    }
  }

  return signedUrls;
};
