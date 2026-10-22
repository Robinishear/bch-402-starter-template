import { Invoice, Usage } from "../../../generated/prisma";

export const toRunResult = (inv: Invoice, usage: Usage) => ({
  invoiceId: inv.id,
  feature: usage.feature,
  result: usage.result,
  tokens: usage.tokens,
  txid: inv.txid,
  createdAt: usage.createdAt,
});