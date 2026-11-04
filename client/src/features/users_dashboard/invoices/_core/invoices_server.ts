import { httpClient } from "@/_core/axios/httpClient";
import { CreateInvoicePayload, Invoice } from "./invoices_interface";

export const createInvoice = async (payload: CreateInvoicePayload) => {
  const response = await httpClient.post<Invoice>("/invoices", payload);
//   console.log("createInvoice response:", response.data);
  return response.data;
};