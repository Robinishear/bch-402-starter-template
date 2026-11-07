"use server";

import { CreateInvoicePayload, CreateInvoiceState, GetInvoiceState, RunInvoiceState } from "./invoices.interface";
import { createInvoice, getInvoice, runInvoice } from "./invoices.service";
import { createInvoiceValidationSchema } from "./invoices.validation";


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

export async function handleGetInvoice(id: string): Promise<GetInvoiceState> {
  try {
    const invoice = await getInvoice(id);
    return { success: true, data: invoice };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Could not load invoice",
    };
  }
}

export async function handleRunInvoice(id: string): Promise<RunInvoiceState> {
  try {
    const result = await runInvoice(id);
    return { success: true, data: result };
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Could not run the AI",
    };
  }
}