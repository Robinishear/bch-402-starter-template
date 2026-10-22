import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { InvoiceController } from "./invoice.controller";
import { createInvoiceSchema } from "./invoice.validation";

const router = Router();

router.post("/", checkAuth(), validateRequest(createInvoiceSchema), InvoiceController.create);
router.get("/:id", checkAuth(), InvoiceController.getOne);
router.post("/:id/run", checkAuth(), InvoiceController.run);

export const InvoiceRoutes = router;