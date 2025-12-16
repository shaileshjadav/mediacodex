import { Router } from "express";
import videoRouter from "./video";

const router = Router();

router.use('/videos', videoRouter);

export default router;