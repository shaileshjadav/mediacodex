import { Router } from "express";
import {
  getUploadUrl,
  getVideoList,
  getPresignedUrl,
  generateEmbedCode,
} from "../controllers/video.controller";
import { getPresignedUrlSchema, getUploadUrlSchema } from "../validation/video";
import { validate } from "../middleware/validation";
import { z } from "zod";

const router = Router();

// Validation schema for embed generation
const embedSchema = z.object({
  domain: z.string().optional(),
});

// Using the unified validation (can validate body, query, params together)
router.post(
  "/upload-url",
  validate({ body: getUploadUrlSchema }),
  getUploadUrl,
);

router.post(
  "/presigned-url",
  validate({ body: getPresignedUrlSchema }),
  getPresignedUrl,
);

// GET /api/videos - List all videos
router.get("/", getVideoList);

// GET /api/videos/:videoId/embed - Generate embed code and token (GET version)
router.get("/:videoId/embed", generateEmbedCode);

// POST /api/videos/:videoId/embed - Generate embed code and token (POST version with domain validation)
router.post(
  "/:videoId/embed",
  validate({ body: embedSchema }),
  generateEmbedCode,
);

export default router;
