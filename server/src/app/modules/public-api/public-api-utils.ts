import { PublicInvoice } from "./public-api-interface";

export const paymentRequired = (inv: PublicInvoice) => ({
  error: "payment_required",
  message:
    "Send the exact amount to payTo, then call again with the X-Invoice-Id header.",
  invoiceId: inv.id,
  payTo: inv.payAddress,
  amountSats: inv.amountSats,
  amountBch: inv.amountBch,
  expiresAt: inv.expiresAt,
});