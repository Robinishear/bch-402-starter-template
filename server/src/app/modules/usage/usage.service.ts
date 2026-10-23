import { InvoiceStatus } from "../../../generated/prisma";
import { IQueryParams } from "../../interfaces/query.interface";
import { prisma } from "../../lib/prisma";
import { satsToBch } from "../invoice/invoice.utils";

const getMyUsage = async (userId: string, query: IQueryParams) => {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(query.limit) || 10));
  const where = { userId };

  const [rows, total] = await Promise.all([
    prisma.usage.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        invoice: { select: { txid: true, amountSats: true, priceUsdCents: true } },
      },
    }),
    prisma.usage.count({ where }),
  ]);

  const data = rows.map((u) => ({
    id: u.id,
    invoiceId: u.invoiceId,
    feature: u.feature,
    prompt: u.prompt,
    result: u.result,
    tokens: u.tokens,
    createdAt: u.createdAt,
    txid: u.invoice.txid,
    amountSats: u.invoice.amountSats.toString(),
    priceUsdCents: u.invoice.priceUsdCents,
  }));

  return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
};


const getMySummary = async (userId: string) => {
  const [uses, spent] = await Promise.all([
    prisma.usage.aggregate({
      where: { userId },
      _count: { _all: true },
      _sum: { tokens: true },
    }),
    prisma.invoice.aggregate({
      where: { userId, status: { in: [InvoiceStatus.PAID, InvoiceStatus.COMPLETED] } },
      _count: { _all: true },
      _sum: { amountSats: true, priceUsdCents: true },
    }),
  ]);

  const sats = spent._sum.amountSats ?? 0n;
  return {
    totalUses: uses._count._all,
    totalTokens: uses._sum.tokens ?? 0,
    paidInvoices: spent._count._all,
    totalSpentSats: sats.toString(),
    totalSpentBch: satsToBch(sats),
    totalSpentUsd: ((spent._sum.priceUsdCents ?? 0) / 100).toFixed(2),
  };
};
export const UsageService = { getMyUsage, getMySummary };