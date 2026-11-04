"use server";

import { CreateInvoicePayload, CreateInvoiceState } from "./invoices_interface";
import { createInvoice } from "./invoices_server";
import { createInvoiceValidationSchema } from "./invoices_validation";


export async function handleCreateInvoice(
  payload: CreateInvoicePayload,
): Promise<CreateInvoiceState> {
  const parsed = createInvoiceValidationSchema.safeParse(payload);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Invalid input data",
    };
  }

  try {
    const invoice = await createInvoice(parsed.data);
    return { success: true, message: "Invoice created", data: invoice };
  } catch (error: any) {
    return {
      success: false,
      message:
        error.response?.data?.message || error.message || "Could not create invoice",
    };
  }
}