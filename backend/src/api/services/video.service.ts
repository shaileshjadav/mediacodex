import { ListObjectsV2Command, PutObjectCommand } from "@aws-sdk/client-s3";
import { generateUniqueS3Key } from "../../utils/aws";
import { s3Client } from "../../config/aws";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  InsertVideoPayload,
  InsertedVideo,
  Video,
  ProcessedUrls,
  GetPresigneUrlResponse,
} from "../../types/video.types";
import * as videoDal from "../dataAccess/video";
import { AWS_PROCESSED_BUCKET, RESOLUTION_MAP } from "../../config/constants";
import * as fs from 'fs';
import { CloudfrontSignedCookiesOutput, getSignedCookies } from "@aws-sdk/cloudfront-signer";
import {CLOUDFRONT_DOMAIN_NAME, CLOUDFRONT_PRIVATE_KEY_PATH, CLOUDFRONT_KEY_PAIR_ID } from "../../config/constants";



export const getUploadUrl = async (
  fileName: string,
  contentType: string,
  userId:string,
): Promise<{ uploadUrl: string; key: string }> => {
  const key = generateUniqueS3Key(fileName, userId);

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

export async function getProcessedUrlsFromS3(
  bucket: string,
  prefix: string, // videoId/
): Promise<ProcessedUrls> {
  const processedUrls: ProcessedUrls = {};

  console.log(
    `Searching for processed videos in bucket: ${bucket}, prefix: ${prefix}`,
  );

  const command = new ListObjectsV2Command({
    Bucket: bucket,
    Prefix: prefix,
  });

  try {
    const response = await s3Client.send(command);

    console.log(`S3 ListObjects response:`, {
      KeyCount: response.KeyCount,
      Contents: response.Contents?.map((obj) => obj.Key) || [],
    });

    if (!response.Contents || response.Contents.length === 0) {
      console.log(`No objects found in S3 for prefix: ${prefix}`);
      return processedUrls;
    }

    for (const object of response.Contents) {
      const key = object.Key;
      console.log(`Processing S3 object: ${key}`);

      if (!key || !key.endsWith("playlist.m3u8")) {
        console.log(`Skipping non-playlist file: ${key}`);
        continue;
      }

      // videoId/1280x720/playlist.m3u8
      const pathParts = key.split("/");
      console.log(`Key path parts:`, pathParts);

      if (pathParts.length < 3) {
        console.log(`Invalid key structure: ${key}`);
        continue;
      }

      const [, resolution] = pathParts;
      console.log(`Found resolution: ${resolution}`);

      const label = RESOLUTION_MAP[resolution];
      console.log(`Resolution mapping: ${resolution} -> ${label}`);

      if (!label) {
        console.log(`No label found for resolution: ${resolution}`);
        continue;
      }

      processedUrls[label] = key;
      console.log(`Added to processedUrls: ${label} = ${key}`);
    }

    return processedUrls;
  } catch (error) {
    console.error(`Error fetching processed URLs from S3:`, error);
    throw error;
  }
}

async function getVideoPresignedUrl(
  bucket: string,
  videoId: string,
  quality: string,
): Promise<GetPresigneUrlResponse | null> {

  // Find the resolution key that matches the quality label
  const resolutionEntry = Object.entries(RESOLUTION_MAP).find(([, value]) => {
    return value === quality;
  });

  if (!resolutionEntry) {
    return null;
  }

  const [resolution] = resolutionEntry;

  if(!CLOUDFRONT_PRIVATE_KEY_PATH || !CLOUDFRONT_KEY_PAIR_ID){
    throw new Error("config error");
  }
  const s3ObjectKey = `${videoId}/${resolution}/playlist.m3u8`;
  const url = `${CLOUDFRONT_DOMAIN_NAME}/${s3ObjectKey}`;
  const privateKey = fs.readFileSync(CLOUDFRONT_PRIVATE_KEY_PATH, 'utf-8');
  // const privateKey = CLOUDFRONT_PRIVATE_KEY;
  const cookies = getSignedCookies({
      url,
      keyPairId: CLOUDFRONT_KEY_PAIR_ID,
      dateLessThan: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      privateKey,
  });
  
  return { url , cookies};
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
): Promise<GetPresigneUrlResponse> => {
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

export const getVideoDetailsById = async (videoId: string): Promise<Video> => {
  const videoDetails = await videoDal.getVideoById(videoId);

  if (!videoDetails) {
    throw Error("Video id is invalid or resource not found");
  }
  return videoDetails;
};
