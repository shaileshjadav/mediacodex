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

  const command = new ListObjectsV2Command({
    Bucket: bucket,
    Prefix: prefix,
  });

  try {
    const response = await s3Client.send(command);


    if (!response.Contents || response.Contents.length === 0) {
      console.log(`No objects found in S3 for prefix: ${prefix}`);
      return processedUrls;
    }

    for (const object of response.Contents) {
      const key = object.Key;
      

      if (!key || !key.endsWith("playlist.m3u8")) {
        continue;
      }

      // videoId/1280x720/playlist.m3u8
      const pathParts = key.split("/");

      if (pathParts.length < 3) {
        console.log(`Invalid key structure: ${key}`);
        continue;
      }

      const [, resolution] = pathParts;

      const label = RESOLUTION_MAP[resolution];

      if (!label) {
        console.log(`No label found for resolution: ${resolution}`);
        continue;
      }

      processedUrls[label] = key;
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
  
  // The base path for which you want to grant access to all subdirectories and files
  // Use a wildcard (*) to cover all contents of the directory.
  const resourcePath = `${CLOUDFRONT_DOMAIN_NAME}/${videoId}/${resolution}/`; // Note: A trailing slash is often implied for a directory, but the * makes it explicit
  const expiresIn = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  const nowEpoch = Math.floor(Date.now() / 1000);
  const expiryEpoch = nowEpoch + 10 * 60;

  console.log("Server now (UTC):", new Date(nowEpoch * 1000).toISOString());
  console.log("Expiry (UTC):", new Date(expiryEpoch * 1000).toISOString());


  const s3ObjectKey = `${videoId}/${resolution}/playlist.m3u8`;
  const url = `${CLOUDFRONT_DOMAIN_NAME}/${s3ObjectKey}`;
  const privateKey = fs.readFileSync(CLOUDFRONT_PRIVATE_KEY_PATH, 'utf-8');

  const unixTime = Math.floor(expiresIn.getTime() / 1000);
  
  // A more precise custom policy with a wildcard resource:
  const customPolicy = {
    Statement: [
      {
        Resource: `${resourcePath}*`, 
        Condition: {
          DateLessThan: { "AWS:EpochTime": unixTime },
        },
      },
    ],
  };
    const customPolicyString = JSON.stringify(customPolicy);
    console.log("Custom Policy:", customPolicyString);
    // const privateKey = CLOUDFRONT_PRIVATE_KEY;
    const cookies = getSignedCookies({
      keyPairId: CLOUDFRONT_KEY_PAIR_ID,
      privateKey,
      policy: customPolicyString,
  });
  
  return { url , cookies};
}

export const getVideoList = async (userId:string): Promise<Video[]> => {
  const videoList = await videoDal.getVideoList(userId);
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
