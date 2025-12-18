import { ListObjectsV2Command, PutObjectCommand } from "@aws-sdk/client-s3";
import { generateUniqueS3Key } from "../../utils/aws";
import { s3Client } from "../../config/aws";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  InsertVideoPayload,
  InsertedVideo,
  Video,
  ProcessedUrls,
} from "../../types/video.types";
import * as videoDal from "../dataAccess/video";
import { AWS_PROCESSED_BUCKET, RESOLUTION_MAP } from "../../config/constants";

export const getUploadUrl = async (
  fileName: string,
  contentType: string,
): Promise<{ uploadUrl: string; key: string }> => {
  const key = generateUniqueS3Key(fileName, "uploads");

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_RAW_BUCKET!,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(s3Client, command, {
    expiresIn: 300, // 5 minutes
  });

  return { uploadUrl, key };
};

export const insertVideo = async (
  insertVideoPayload: InsertVideoPayload,
): Promise<InsertedVideo> => {
  return await videoDal.insertVideo(insertVideoPayload);
};

async function getProcessedUrlsFromS3(
  bucket: string,
  prefix: string, // videoId/
): Promise<ProcessedUrls> {
  const processedUrls: ProcessedUrls = {};

  const command = new ListObjectsV2Command({
    Bucket: bucket,
    Prefix: prefix,
  });

  const response = await s3Client.send(command);

  if (!response.Contents) return processedUrls;

  for (const object of response.Contents) {
    const key = object.Key;
    if (!key || !key.endsWith("playlist.m3u8")) continue;

    // videoId/1280x720/playlist.m3u8
    const [, resolution] = key.split("/");

    const label = RESOLUTION_MAP[resolution];
    if (!label) continue;

    processedUrls[label] = key;
  }

  return processedUrls;
}

async function getVideoPresignedUrl(
  bucket: string,
  videoId: string,
  quality: string,
): Promise<string | null> {
  // Find the resolution key that matches the quality label
  const resolutionEntry = Object.entries(RESOLUTION_MAP).find(([, value]) => {
    return value === quality;
  });

  if (!resolutionEntry) {
    return null;
  }

  const [resolution] = resolutionEntry;
  const fullPrefix = `${videoId}/${resolution}/`;

  const command = new ListObjectsV2Command({
    Bucket: bucket,
    Prefix: fullPrefix,
  });

  const response = await s3Client.send(command);

  if (!response.Contents) return null;

  for (const object of response.Contents) {
    const key = object.Key;
    if (!key || !key.endsWith("playlist.m3u8")) continue;

    // Join with aws bucket full link
    const s3Endpoint = process.env.AWS_ENDPOINT_URL || "http://localhost:4566";
    const fullUrl = `${s3Endpoint}/${bucket}/${key}`;
    return fullUrl;
  }

  return null;
}

export const getVideoList = async (): Promise<Video[]> => {
  const videoList = await videoDal.getVideoList();
  if (!AWS_PROCESSED_BUCKET) {
    throw Error("AWS config is not valid");
  }
  for (const video of videoList) {
    const processedURLs = await getProcessedUrlsFromS3(
      AWS_PROCESSED_BUCKET,
      video.videoId,
    );
    video.processedUrls = processedURLs;
  }
  return videoList;
};

export const getPresignedUrl = async (
  videoId: string,
  quality: string,
): Promise<string> => {
  const videoDetails = await videoDal.getVideoById(videoId);

  if (!videoDetails) {
    throw Error("Video id is invalid or resource not found");
  }
  if (!AWS_PROCESSED_BUCKET) {
    throw Error("AWS config is not valid");
  }

  const presignedUrl = await getVideoPresignedUrl(
    AWS_PROCESSED_BUCKET,
    videoId,
    quality,
  );
  if (!presignedUrl) {
    throw new Error("can not generate presigned URL for " + videoId);
  }

  return presignedUrl;
};
