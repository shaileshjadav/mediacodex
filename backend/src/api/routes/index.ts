import { Router } from "express";
import videoRouter from "./video";
import playerRouter from "./player";
import authMiddleware from "../middleware/auth";

const router = Router();

router.use("/player", playerRouter);

router.use(authMiddleware);

// protected routes
router.use("/videos", videoRouter);


export default router;
