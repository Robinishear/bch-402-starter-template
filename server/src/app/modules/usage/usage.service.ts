import { IQueryParams } from "../../interfaces/query.interface";
import { prisma } from "../../lib/prisma";

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

export const UsageService = { getMyUsage };