export const userSelect = {
  id: true,
  name: true,
  email: true,
  image: true,
  role: true,
  status: true,
  emailVerified: true,
  createdAt: true,
};

export type AnalyticsPoint = {
  date: string;
  users: number;
  invoices: number;
  paidInvoices: number;
  revenueUsd: number;
  aiUses: number;
  aiTokens: number;
};