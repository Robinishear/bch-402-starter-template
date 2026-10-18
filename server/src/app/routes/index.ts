import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { AdminRoutes } from "../modules/admin/admin.routes";
import { PricingRoutes } from "../modules/pricing/pricing.routes";


const router = Router();

// Add your API routes here
router.use("/auth", AuthRoutes);
router.use("/admin", AdminRoutes);
router.use("/pricing", PricingRoutes);



export const apiRoutes = router;
