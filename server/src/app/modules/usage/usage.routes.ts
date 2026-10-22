import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { UsageController } from "./usage.controller";

const router = Router();
router.get("/", checkAuth(), UsageController.getMyUsage);

export const UsageRoutes = router;