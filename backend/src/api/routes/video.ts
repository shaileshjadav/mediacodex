import { Router } from "express";
import {
  getUploadUrl,
  getVideoList,
  getPresignedUrl,
  generateSharingUrl,
} from "../controllers/video.controller";
import { getPresignedUrlSchema, getUploadUrlSchema } from "../validation/video";
import { validate } from "../middleware/validation";
import { z } from "zod";

const router = Router();

// Validation schema for sharing URL generation
const shareVideoSchema = z.object({
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
// router.get("/:videoId/embed", generateSharingUrl);

// POST /api/videos/:videoId/embed - Generate embed code and token (POST version with domain validation)
router.post(
  "/:videoId/share",
  validate({ body: shareVideoSchema }),
  generateSharingUrl,
);

export default router;
