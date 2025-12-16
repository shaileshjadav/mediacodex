import { PutObjectCommand } from "@aws-sdk/client-s3";
import { generateUniqueS3Key } from "../../utils/aws";
import { s3Client } from "../../config/aws";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { InsertVideoPayload, InsertedVideo, Video } from "../../types/video.types";
import * as videoDal from "../dataAccess/video";

export const getUploadUrl = async(fileName: string, contentType: string): Promise<{ uploadUrl: string; key: string }> => {
  const key = generateUniqueS3Key(fileName, 'uploads');

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_RAW_BUCKET!,
    Key: key,
    ContentType: contentType
  });

  const uploadUrl = await getSignedUrl(s3Client, command, {
    expiresIn: 300 // 5 minutes
  });
  
  return { uploadUrl, key };
};

export const insertVideo = async(insertVideoPayload: InsertVideoPayload): Promise<InsertedVideo> => {
  return await videoDal.insertVideo(insertVideoPayload);
};

export const getVideoList = async(): Promise<Video[]> => {
  return await videoDal.getVideoList();
};