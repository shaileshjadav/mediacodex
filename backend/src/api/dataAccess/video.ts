import { pool } from "../../config/db";
import {
  InsertVideoPayload,
  InsertedVideo,
  Video,
} from "../../types/video.types";

export const insertVideo = async (
  insertVideoPayload: InsertVideoPayload,
): Promise<InsertedVideo> => {
  const client = await pool.connect();
  const currentDateTime = new Date().toISOString();
  try {
    const { userId, videoId, status } = insertVideoPayload;
    const query = `
      INSERT INTO "videos" ("userId", "videoId", "status", "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id;
    `;

    const values = [userId, videoId, status, currentDateTime, currentDateTime];

    const result = await client.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
};

export const getVideoList = async (userId:string): Promise<Video[]> => {
  const client = await pool.connect();
  try {
    const query = `
      SELECT id, "userId", "videoId", "status", "createdAt", "updatedAt"
      FROM "videos"
      WHERE "userId" = $1;
    `;
    const params = [userId]
    const result = await client.query(query, params);
    return result.rows;
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
};

export const getVideoById = async (videoId: string): Promise<Video> => {
  const client = await pool.connect();
  try {
    const query = `
      SELECT id, "userId", "videoId", "status", "createdAt", "updatedAt"
      FROM "videos"
      WHERE "videoId" = $1;
    `;

    const result = await client.query(query, [videoId]);
    return result.rows[0];
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
};
