export type InvoiceStatus = "PENDING" | "PAID" | "COMPLETED" | "EXPIRED" | "UNDERPAID";

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


  export type GetInvoiceState =
  | { success: true; data: Invoice }
  | { success: false; message: string };

  export interface RunResult {
  invoiceId: string;
  feature: string;
  result: string;
  tokens: number;
  txid: string | null;
  createdAt: string;
}

export type RunInvoiceState =
  | { success: true; data: RunResult }
  | { success: false; message: string };

  export interface Props {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}
