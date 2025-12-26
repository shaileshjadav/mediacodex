import { Router } from "express";
import videoRouter from "./video";
import playerRouter from "./player";

const router = Router();

router.use("/videos", videoRouter);
router.use("/player", playerRouter);

export default router;
