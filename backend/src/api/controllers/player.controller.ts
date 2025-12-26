import { Request, Response } from "express";
import { verifyEmbedToken } from "../../utils/jwt";
import { AWS_PROCESSED_BUCKET } from "../../config/constants";
import { getProcessedUrlsFromS3 } from "../services/video.service";
import { ProcessedUrls } from "../../types/video.types";

interface PlayerSessionRequest {
  videoId: string;
  token: string;
}

interface PlayerSessionResponse {
  processedUrls: ProcessedUrls;
  expiresIn: number;
}

export const createPlayerSession = async (
  req: Request<{}, {}, PlayerSessionRequest>,
  res: Response<PlayerSessionResponse>,
): Promise<void> => {
  try {
    const { videoId, token } = req.body;
    console.log(`Creating player session for video: ${videoId}`);

    if (!videoId || !token) {
      console.log("Missing videoId or token in request");
      res.status(400).json({
        error: "videoId and token are required",
      } as any);
      return;
    }

    // 1. Verify JWT token
    console.log("Verifying JWT token...");
    const payload = verifyEmbedToken(token);
    console.log("Token verified successfully:", {
      videoId: payload.videoId,
      domain: payload.domain,
    });

    // 2. Validate video access
    if (payload.videoId !== videoId) {
      console.log(
        `Token video ID mismatch: token=${payload.videoId}, requested=${videoId}`,
      );
      res.status(403).json({
        error: "Token does not match video ID",
      } as any);
      return;
    }

    // 3. Optional domain validation
    const origin = req.headers.origin;
    if (payload.domain && origin && payload.domain !== origin) {
      console.log(
        `Domain validation failed: expected=${payload.domain}, actual=${origin}`,
      );
      res.status(403).json({
        error: "Domain not authorized",
      } as any);
      return;
    }

    // 4. Generate signed HLS URL
    console.log(`Generating signed HLS URL for video: ${videoId}`);
    if (!AWS_PROCESSED_BUCKET) {
      throw Error("AWS config is not valid");
    }
    const processedUrls = await getProcessedUrlsFromS3(
      AWS_PROCESSED_BUCKET,
      videoId,
    );
    console.log("processed Url", processedUrls);

    // 5. Return playback session
    res.status(200).json({
      processedUrls,
      expiresIn: 300, // 5 minutes
    });
  } catch (error) {
    console.error("Player session error:", error);

    if (
      error instanceof Error &&
      error.message === "Invalid or expired token"
    ) {
      res.status(401).json({
        error: "Invalid or expired token",
      } as any);
      return;
    }

    res.status(500).json({
      error: "Internal server error",
    } as any);
  }
};
