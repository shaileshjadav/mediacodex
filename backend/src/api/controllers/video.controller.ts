import { CookieOptions, Request, Response } from "express";
import {
  GetUploadUrlRequestBody,
  GetUploadUrlResponse,
  Video,
  GetPresigneUrlRequestBody,
  GetPresigneUrlResponse,
} from "../../types/video.types";
import * as videoService from "../services/video.service";
import { generateEmbedToken } from "../../utils/jwt";
import { CLOUDFRONT_DOMAIN_NAME } from "../../config/constants";
import { CloudfrontSignedCookiesOutput } from "@aws-sdk/cloudfront-signer";

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
  const videos = await videoService.getVideoList();
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
  if(!CLOUDFRONT_DOMAIN_NAME){
    throw new Error("CloudFront domain name is not configured");
  }
  const cookieOptions:CookieOptions = {
    httpOnly: true,
    // secure: true,       // MUST be true in production (HTTPS)
    sameSite: "none",   // REQUIRED if frontend & CF are on different domains
    path: "/",
    domain: CLOUDFRONT_DOMAIN_NAME.replace('https://', '') // must match CloudFront domain or parent
  };

  res
  // .cookie("CloudFront-Policy", cookies["CloudFront-Policy"], cookieOptions)
  .cookie("CloudFront-Signature", cookies["CloudFront-Signature"], cookieOptions)
  .cookie("CloudFront-Key-Pair-Id", cookies["CloudFront-Key-Pair-Id"], cookieOptions)
  .cookie("CloudFront-Expires", cookies["CloudFront-Expires"], cookieOptions)
  .status(200)
  .json({ url });
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
      userId: req.userId, 
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
