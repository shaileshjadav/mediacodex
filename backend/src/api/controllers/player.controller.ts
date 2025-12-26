import { Request, Response } from "express";
import { verifyEmbedToken, generateSignedHLS } from "../../utils/jwt";

interface PlayerSessionRequest {
  videoId: string;
  token: string;
}

interface PlayerSessionResponse {
  playbackUrl: string;
  expiresIn: number;
}

export const createPlayerSession = async (
  req: Request<{}, {}, PlayerSessionRequest>,
  res: Response<PlayerSessionResponse>,
): Promise<void> => {
  try {
    const { videoId, token } = req.body;

    if (!videoId || !token) {
      res.status(400).json({
        error: "videoId and token are required",
      } as any);
      return;
    }

    // 1. Verify JWT token
    const payload = verifyEmbedToken(token);

    // 2. Validate video access
    if (payload.videoId !== videoId) {
      res.status(403).json({
        error: "Token does not match video ID",
      } as any);
      return;
    }

    // 3. Optional domain validation
    const origin = req.headers.origin;
    if (payload.domain && origin && payload.domain !== origin) {
      res.status(403).json({
        error: "Domain not authorized",
      } as any);
      return;
    }

    // 4. Generate signed HLS URL
    const signedUrl = await generateSignedHLS(videoId);

    // 5. Return playback session
    res.status(200).json({
      playbackUrl: signedUrl,
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
