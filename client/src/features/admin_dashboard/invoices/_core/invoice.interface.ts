export type InvoiceStatus = "PENDING" | "PAID" | "COMPLETED" | "EXPIRED" | "UNDERPAID";

export interface AdminInvoice {
  id: string;
  feature: string;
  status: InvoiceStatus;
  priceUsdCents: number;
  amountSats: string;
  payAddress: string;
  txid: string | null;
  paidAt: string | null;
  expiresAt: string;
  createdAt: string;
  user: { id: string; name: string; email: string } | null;
}

export type InvoiceListParams = {
  page?: string;
  limit?: string;
  status?: string;
  searchTerm?: string;
};

export interface InvoicePageProps {
  searchParams: Promise<InvoiceListParams>;
}
