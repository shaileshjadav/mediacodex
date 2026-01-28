import { AWS_PROCESSED_BUCKET, VIDEO_STATUS } from "../../config/constants";
import { getProcessingVideos, updateVideoStatus } from "../dataAccess/cron";
import { getProcessedUrlsFromS3 } from "./video.service";

/**
 * Main cron job function
 * Checks S3 processed video bucket and updates database status accordingly
 */
export const updateVideoStatusCron = async (): Promise<void> => {

  try {
    const processingVideos = await getProcessingVideos();

    if (processingVideos.length === 0) {
      console.log("No videos in PROCESSING status");
      return;
    }

    console.log(`Found ${processingVideos.length} videos in PROCESSING status`);
    if (!AWS_PROCESSED_BUCKET) {
      throw Error("AWS config is not valid");
    }
    
    for (const video of processingVideos) {
      try {
        // Check if processed video folder exists in S3
        const processedUrls = await getProcessedUrlsFromS3(
            AWS_PROCESSED_BUCKET,
            video.videoId,
        );
        if (Object.keys(processedUrls).length > 0) {
          console.log(
            `Processed videos found for video ${video.videoId}, updating status to COMPLETED`
          );
          await updateVideoStatus(video.videoId, VIDEO_STATUS.COMPLETED);
        }
      } catch (error) {
        console.error(
          `Error processing video ${video.videoId}:`,
          error instanceof Error ? error.message : String(error)
        );
        // Continue processing other videos even if one fails
      }
    }
    console.log(
      `[${new Date().toISOString()}] Video status update cron completed`
    );
  } catch (error) {
    console.error("Fatal error in video status cron:", error);
  }
};