import { Router } from "express";
import { getUploadUrl, getVideoList } from "../controllers/video.controller";
import { getUploadUrlSchema } from "../validation/video";
import { validate } from "../middleware/validation";

const router = Router();

// Using the unified validation (can validate body, query, params together)
router.post('/upload-url', validate({ body: getUploadUrlSchema }), getUploadUrl);

// GET /api/videos - List all videos
router.get('/', getVideoList);

export default router;