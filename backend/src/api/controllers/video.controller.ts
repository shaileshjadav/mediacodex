import { Request, Response } from "express";
import {
  GetUploadUrlRequestBody,
  GetUploadUrlResponse,
  Video,
  GetPresigneUrlRequestBody,
} from "../../types/video.types";
import * as videoService from "../services/video.service";
import { generateEmbedToken } from "../../utils/jwt";

export const getUploadUrl = async (
  req: Request<{}, {}, GetUploadUrlRequestBody>,
  res: Response<GetUploadUrlResponse>,
): Promise<void> => {
  const { fileName, contentType } = req.body;

  const { uploadUrl, key } = await videoService.getUploadUrl(
    fileName,
    contentType,
  );
  res.status(200).json({
    uploadUrl,
    key,
  });
};

export const getVideoList = async (
  req: Request<{}, {}, {}>,
  res: Response<Video[]>,
): Promise<void> => {
  const videos = await videoService.getVideoList();
  res.status(200).json(videos);
};

export const getPresignedUrl = async (
  req: Request<{}, {}, GetPresigneUrlRequestBody>,
  res: Response<{ url: string }>,
): Promise<void> => {
  const presignedUrl = await videoService.getPresignedUrl(
    req.body.videoId,
    req.body.quality,
  );
  res.status(200).json({ url: presignedUrl });
};
export const generateEmbedCode = async (
  req: Request<{ videoId: string }, {}, { domain?: string }>,
  res: Response,
): Promise<void> => {
  try {
    const { videoId } = req.params;
    const { domain } = req.body;

    if (!videoId) {
      res.status(400).json({ error: "Video ID is required" });
      return;
    }

    // Generate embed token
    const token = generateEmbedToken({
      videoId,
      domain,
      userId: "anonymous", // In real app, get from auth
    });

    // Generate embed code
    const embedUrl = `${process.env.VIDEO_PLAYER_HOST}/embed/${videoId}?token=${token}`;
    const embedCode = `<iframe src="${embedUrl}" width="640" height="360" frameborder="0" allowfullscreen></iframe>`;

    res.status(200).json({
      token,
      embedUrl,
      embedCode,
      expiresIn: 300,
    });
  } catch (error) {
    console.error("Generate embed code error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
