import { Request, Response } from "express";
import { GetUploadUrlRequestBody, GetUploadUrlResponse, Video, VideoList } from "../../types/video.types";
import * as videoService from "../services/video.service";

export const getUploadUrl = async(req: Request<{}, {}, GetUploadUrlRequestBody>, res: Response<GetUploadUrlResponse>) : Promise<void> => {
 const { fileName, contentType } = req.body;
  
  const { uploadUrl, key } = await videoService.getUploadUrl(fileName, contentType);
  res.status(200).json({
    uploadUrl,
    key
  });
};

export const getVideoList = async(req: Request<{}, {}, {}>, res: Response<Video[]>) : Promise<void> => {
 
  const  videos= await videoService.getVideoList();
  res.status(200).json(videos);
};