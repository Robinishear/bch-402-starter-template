export type InvoiceStatus = "PENDING" | "PAID" | "COMPLETED" | "EXPIRED" | "UNDERPAID";

// backend-এর invoice-এর "public" রূপ
export interface Invoice {
  id: string;
  feature: string;
  status: InvoiceStatus;
  payAddress: string;
  priceUsdCents: number;
  amountSats: string;
  amountBch: string;
  txid: string | null;
  paidAt: string | null;
  expiresAt: string;
  createdAt: string;
}

export interface CreateInvoicePayload {
  feature: string;
  input: string;
}

export type CreateInvoiceState =
  | { success: true; message: string; data: Invoice }
  | { success: false; message: string };