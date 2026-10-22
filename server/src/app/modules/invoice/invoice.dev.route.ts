import { Router } from "express";
import { Role } from "../../../generated/prisma";
import { checkAuth } from "../../middleware/checkAuth";
import { InvoiceController } from "./invoice.controller";

const router = Router();
router.post("/invoices/:id/simulate-pay", checkAuth(Role.ADMIN), InvoiceController.simulatePay);

export const InvoiceDevRoutes = router;