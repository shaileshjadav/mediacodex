import { CookieOptions, Request, Response } from "express";
import {
  GetUploadUrlRequestBody,
  GetUploadUrlResponse,
  Video,
  GetPresigneUrlRequestBody,
  GetPresigneUrlResponse,
} from "../../types/video.types";
import * as videoService from "../services/video.service";
import { generateToken } from "../../utils/jwt";
import {  DOMAIN_NAME } from "../../config/constants";

export const getUploadUrl = async (
  req: Request<{}, {}, GetUploadUrlRequestBody>,
  res: Response<GetUploadUrlResponse>,
): Promise<void> => {
  const { fileName, contentType } = req.body;
  const {userId} = req;
  const { uploadUrl, key } = await videoService.getUploadUrl(
    fileName,
    contentType,
    userId,
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
  const videos = await videoService.getVideoList(req.userId);
  res.status(200).json(videos);
};

export const getPresignedUrl = async (
  req: Request<{}, {}, GetPresigneUrlRequestBody>,
  res: Response<{ url: string }>,
): Promise<void> => {
  const {url, cookies}: GetPresigneUrlResponse = await videoService.getPresignedUrl(
    req.body.videoId,
    req.body.quality,
  );
  if(!cookies){
    throw new Error("Could not generate signed cookies");
  }
  if(!DOMAIN_NAME){
    throw new Error("Domain name is not configured");
  }
  const cookieOptions:CookieOptions = {
    httpOnly: true,
    secure: true,       // MUST be true in production (HTTPS)
    sameSite: "none",   // REQUIRED if frontend & CF are on different domains
    path: "/",
    domain: `.${DOMAIN_NAME}` // Leading dot allows subdomains (e.g., .mediacodex.cloud works for both mediacodex.cloud and stream.mediacodex.cloud)
  };

  res
  .cookie("CloudFront-Policy", cookies["CloudFront-Policy"], cookieOptions)
  .cookie("CloudFront-Signature", cookies["CloudFront-Signature"], cookieOptions)
  .cookie("CloudFront-Key-Pair-Id", cookies["CloudFront-Key-Pair-Id"], cookieOptions)
  // .cookie("CloudFront-Expires", cookies["CloudFront-Expires"], cookieOptions)
  .status(200)
  .json({ url });
};
export const generateSharingUrl = async (
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

    // Generate sharing token
    const token = generateToken({
      videoId,
      domain,
      userId: req.userId, 
    });

    // Generate sharing code
    const sharingURL = `${process.env.VIDEO_PLAYER_HOST}/share/${videoId}?token=${token}`;

    res.status(200).json({
      token,
      url:sharingURL,
    });
  } catch (error) {
    console.error("Generate sharing URL error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
