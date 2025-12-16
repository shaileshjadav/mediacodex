import { Router } from "express";
import { getUploadUrl } from "../controllers/video.controller";
import { getUploadUrlSchema } from "../validation/video";
import { validate } from "../middleware/validation";

const router = Router();

// Using the unified validation (can validate body, query, params together)
router.post('/upload-url', validate({ body: getUploadUrlSchema }), getUploadUrl);

export default router;