import { Invoice } from "../../../generated/prisma";

export const satsToBch = (sats: bigint) =>
  `${sats / 100000000n}.${(sats % 100000000n).toString().padStart(8, "0")}`;



export const isUniqueViolation = (e: unknown) =>
  (e as { code?: string })?.code === "P2002";


export const toPublic = (inv: Invoice) => ({
  id: inv.id,
  feature: inv.feature,
  status: inv.status,
  payAddress: inv.payAddress,
  priceUsdCents: inv.priceUsdCents,
  amountSats: inv.amountSats.toString(), 
  amountBch: satsToBch(inv.amountSats),
  txid: inv.txid,
  paidAt: inv.paidAt,
  expiresAt: inv.expiresAt,
  createdAt: inv.createdAt,
});