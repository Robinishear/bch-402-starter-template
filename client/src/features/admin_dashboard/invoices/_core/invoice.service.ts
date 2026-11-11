import { httpClient } from "@/_core/axios/httpClient";
import { AdminInvoice, InvoiceListParams } from "./invoice.interface";

export const InvoiceService = {
  getAllInvoices: (params: InvoiceListParams) =>
    httpClient.get<AdminInvoice[]>("/admin/invoices", { params }),
};