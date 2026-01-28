import { VIDEO_STATUS } from "../../config/constants";
import { pool } from "../../config/db";
import { Video } from "../../types/video.types";

/**
 * Get all videos in PROCESSING status
 */
export const getProcessingVideos = async (): Promise<Video[]> => {
  const client = await pool.connect();
  try {
    const query = `
      SELECT id, "userId", "videoId", "status", "createdAt", "updatedAt"
      FROM "videos"
      WHERE "status" = $1
      ORDER BY "updatedAt" ASC;
    `;

    const result = await client.query(query, [VIDEO_STATUS.PROCESSING]);
    return result.rows;
  } catch (error) {
    console.error("Error fetching processing videos:", error);
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Update video status in database
 */
export const updateVideoStatus = async (
  videoId: string,
  status: string
): Promise<void> => {
  const client = await pool.connect();
  try {
    const query = `
      UPDATE "videos"
      SET "status" = $1, "updatedAt" = NOW()
      WHERE "videoId" = $2;
    `;

    await client.query(query, [status, videoId]);
  } catch (error) {
    console.error(`Error updating video status for ${videoId}:`, error);
    throw error;
  } finally {
    client.release();
  }
};