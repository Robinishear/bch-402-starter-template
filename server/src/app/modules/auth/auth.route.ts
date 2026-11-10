import { Router } from "express";
import { validateRequest } from "../../middleware/validateRequest";
import { AuthController } from "./auth.controller";
import { checkAuth } from "../../middleware/checkAuth";

import {
  forgotPasswordCooldown,
  forgotPasswordLimiter,
  loginLimiter,
  registerLimiter,
} from "../../config/rate-limit";
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from "./auth.validation";


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


router.post(
  "/forgot-password",
  forgotPasswordLimiter,
  forgotPasswordCooldown,
  validateRequest(forgotPasswordSchema),
  AuthController.forgotPassword,
);
router.post(
  "/reset-password",
  forgotPasswordLimiter,
  validateRequest(resetPasswordSchema),
  AuthController.resetPassword,
);
export const AuthRoutes = router;