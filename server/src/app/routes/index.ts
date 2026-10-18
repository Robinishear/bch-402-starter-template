import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { AdminRoutes } from "../modules/admin/admin.routes";


const router = Router();

// Add your API routes here
router.use("/auth", AuthRoutes);
router.use("/admin", AdminRoutes);


export const apiRoutes = router;
