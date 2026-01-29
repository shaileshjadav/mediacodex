import { Router } from "express";
import { createPlayerSession } from "../controllers/player.controller";
import { getPresignedUrlSchema } from "../validation/video"
import {
  getPresignedUrl,
} from "../controllers/video.controller";
import { validate } from "../middleware/validation";
import { z } from "zod";

const router = Router();

// Validation schema for player session
const playerSessionSchema = z.object({
  videoId: z.string().min(1, "Video ID is required"),
  token: z.string().min(1, "Token is required"),
});

// POST /api/player/session - Create player session with JWT token
router.post(
  "/session",
  validate({ body: playerSessionSchema }),
  createPlayerSession,
);

router.post(
  "/presigned-url",
  validate({ body: getPresignedUrlSchema }),
  getPresignedUrl,
);

export default router;
