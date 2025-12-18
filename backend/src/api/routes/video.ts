import { Router } from "express";
import { getUploadUrl, getVideoList, getPresignedUrl } from "../controllers/video.controller";
import { getPresignedUrlSchema, getUploadUrlSchema } from "../validation/video";
import { validate } from "../middleware/validation";

const router = Router();

// Using the unified validation (can validate body, query, params together)
router.post('/upload-url', validate({ body: getUploadUrlSchema }), getUploadUrl);

router.post('/presigned-url', validate({ body: getPresignedUrlSchema }), getPresignedUrl);
// GET /api/videos - List all videos
router.get('/', getVideoList);

export default router;