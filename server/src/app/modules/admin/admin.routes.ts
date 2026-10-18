import { Router } from "express";
import { Role } from "../../../generated/prisma";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { AdminController } from "./admin.controller";
import { updateUserStatusSchema } from "./admin.validation";

const router = Router();

router.patch(
  "/users/:id/status",
  checkAuth(Role.ADMIN),
  validateRequest(updateUserStatusSchema),
  AdminController.updateUserStatus,
);
router.delete("/users/:id", checkAuth(Role.ADMIN), AdminController.deleteUser);

export const AdminRoutes = router;
