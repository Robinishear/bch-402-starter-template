import { z } from "zod";

export const createInvoiceSchema = z.object({
  feature: z.string().min(1),
  input: z.string().min(1).max(2000),
});