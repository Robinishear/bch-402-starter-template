import { z } from "zod";

export const createInvoiceValidationSchema = z.object({
  feature: z.string().min(1, "Please select a feature"),
  input: z
    .string()
    .trim()
    .min(1, "Please enter some text")
    .max(500, "Text must be 500 characters or less"),
});