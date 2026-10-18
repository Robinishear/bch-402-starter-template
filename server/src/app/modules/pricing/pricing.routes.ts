import { Router } from "express";
import { PricingController } from "./pricing.controller";

const router = Router();
router.get("/", PricingController.getPricing); 

export const PricingRoutes = router;
