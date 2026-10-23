import { Router } from "express";
import { validateRequest } from "../../middleware/validateRequest";
import { AuthController } from "./auth.controller";
import { loginSchema, registerSchema } from "./auth.validation";
import { checkAuth } from "../../middleware/checkAuth";
import { loginLimiter, registerLimiter } from "../../config/rate-limit";

const router = Router();
router.post(
  "/register",
  registerLimiter,
  validateRequest(registerSchema),
  AuthController.register,
);
router.post("/login", loginLimiter, validateRequest(loginSchema), AuthController.login);
router.get("/me", checkAuth(), AuthController.getMe);
router.post("/logout", AuthController.logout);
router.get("/social/success", AuthController.socialSuccess);

export const AuthRoutes = router;