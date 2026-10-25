import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { AdminRoutes } from "../modules/admin/admin.routes";
import { PricingRoutes } from "../modules/pricing/pricing.routes";
import { InvoiceRoutes } from "../modules/invoice/invoice.routes";
import { UsageRoutes } from "../modules/usage/usage.routes";
import { envVars } from "../config/env";
import { InvoiceDevRoutes } from "../modules/invoice/invoice.dev.route";
import { PublicApiRoutes } from "../modules/public-api/public-api.routes";


const router = Router();

router.use("/auth", AuthRoutes);
router.use("/admin", AdminRoutes);
router.use("/pricing", PricingRoutes);

router.use("/invoices", InvoiceRoutes);
router.use("/usage", UsageRoutes);

router.use("/insight", PublicApiRoutes);

if (envVars.CHAIN_MODE === "mock" && envVars.NODE_ENV !== "production") {
  router.use("/dev", InvoiceDevRoutes);
}

export const apiRoutes = router;
