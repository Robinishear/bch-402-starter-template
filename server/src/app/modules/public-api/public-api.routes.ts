import { Router } from "express";
import { publicCreateLimiter, publicPollLimiter } from "../../config/rate-limit";
import { PublicApiController } from "./public-api.controller";

const router = Router();
router.post("/", publicCreateLimiter, publicPollLimiter, PublicApiController.insight);

export const PublicApiRoutes = router;