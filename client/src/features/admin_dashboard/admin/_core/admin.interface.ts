export interface IUser {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: string;
  status: string;
  emailVerified?: boolean;
  createdAt: string;
}

export interface IUserSummary {
  total: number;
  active: number;
  blocked: number;
  deleted: number;
}

export interface IInvoice {
  id: string;
  feature: string;
  status: string;
  priceUsdCents: number;
  amountSats: string;
  payAddress: string;
  txid?: string | null;
  paidAt?: string | null;
  expiresAt: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface IStats {
  users: IUserSummary;
  invoices: {
    total: number;
    pending: number;
    paid: number;
    completed: number;
    expired: number;
    underpaid: number;
  };
  revenue: {
    paidInvoices: number;
    sats: string;
    bch: string | number;
    usd: string;
  };
  ai: {
    totalUses: number;
    totalTokens: number;
  };
}