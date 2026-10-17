import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route";


const router = Router();

// Add your API routes here
router.use("/auth", AuthRoutes);


export const apiRoutes = router;
