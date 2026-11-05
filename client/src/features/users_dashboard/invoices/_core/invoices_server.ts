import { httpClient } from "@/_core/axios/httpClient";
import { CreateInvoicePayload, Invoice, RunResult } from "./invoices_interface";

export const createInvoice = async (payload: CreateInvoicePayload) => {
  const response = await httpClient.post<Invoice>("/invoices", payload);
//   console.log("createInvoice response:", response.data);
  return response.data;
};

export const getInvoice = async (id: string) => {
  const response = await httpClient.get<Invoice>(`/invoices/${id}`);
  return response.data;
};

export const runInvoice = async (id: string) => {
  const response = await httpClient.post<RunResult>(`/invoices/${id}/run`, {});
  return response.data;
};