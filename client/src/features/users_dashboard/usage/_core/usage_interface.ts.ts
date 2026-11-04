export interface UsageSummary {
  totalUses: number;
  totalTokens: number;
  paidInvoices: number;
  totalSpentSats: string;
  totalSpentBch: string;
  totalSpentUsd: string;
}

export interface UsageHistoryItem {
  id: string;
  invoiceId: string;
  feature: string;
  prompt: string;
  result: string;
  tokens: number;
  createdAt: string;
  txid: string;
  amountSats: string;
  priceUsdCents: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface UsageHistory {
  items: UsageHistoryItem[];
  meta: PaginationMeta;
}