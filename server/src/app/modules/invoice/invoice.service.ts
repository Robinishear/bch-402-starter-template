import { randomUUID } from "node:crypto";
import status from "http-status";
import { Invoice, InvoiceStatus, Usage } from "../../../generated/prisma";
import { envVars } from "../../config/env";
import AppError from "../../error-helpers/AppError";
import { prisma } from "../../lib/prisma";
import { AiService } from "../ai/ai.service";
import { chain } from "../chain/chain.service";
import { PricingService } from "../pricing/pricing.service";
import { isFeatureKey } from "../../config/pricing.config";
import {  toRunResult } from "./invoice.interface";
import { INVOICE_TTL_MS, MAX_PENDING_PER_USER, TRUNCATION_NOTE } from "./invoice.constants";
import { satsToBch } from "./invoice.utils";
import { notifyInvoiceCreated } from "../../../workers/signal";
import { mockChain } from "../chain/chain.mock";


const isUniqueViolation = (e: unknown) =>
  (e as { code?: string })?.code === "P2002";


const toPublic = (inv: Invoice) => ({
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


// * createInvoice 
const createInvoice = async (
  userId: string,
  payload: { feature: string; input: string },
) => {
  if (!isFeatureKey(payload.feature)) {
    throw new AppError(status.BAD_REQUEST, "Unknown feature.");
  }
  const input = AiService.validateInput(payload.input);

  const pending = await prisma.invoice.count({
    where: { userId, status: InvoiceStatus.PENDING, expiresAt: { gt: new Date() } },
  });
  if (pending >= MAX_PENDING_PER_USER) {
    throw new AppError(
      status.TOO_MANY_REQUESTS,
      "Too many unpaid invoices. Please pay or wait for them to expire.",
    );
  }

  const quote = await PricingService.quote(payload.feature); 

  const invoice = await prisma.$transaction(async (tx) => {
    const draft = await tx.invoice.create({
      data: {
        userId,
        feature: payload.feature,
        input,
        payAddress: `pending:${randomUUID()}`,
        priceUsdCents: quote.priceUsdCents,
        amountSats: quote.amountSats,
        expiresAt: new Date(Date.now() + INVOICE_TTL_MS),
      },
    });
    return tx.invoice.update({
      where: { id: draft.id },
      data: { payAddress: chain.deriveAddress(draft.derivIndex) },
    });
  });

  notifyInvoiceCreated();
  return toPublic(invoice);
};

const findOwned = async (userId: string, id: string) => {
  const inv = await prisma.invoice.findFirst({
    where: { id, userId },
    include: { usage: true },
  });
  if (!inv) throw new AppError(status.NOT_FOUND, "Invoice not found.");
  return inv;
};

// * getInvoice
const getInvoice = async (userId: string, id: string) => {
  let inv = await findOwned(userId, id);
  if (inv.status === InvoiceStatus.PENDING && inv.expiresAt <= new Date()) {
    await prisma.invoice.updateMany({
      where: { id: inv.id, status: InvoiceStatus.PENDING },
      data: { status: InvoiceStatus.EXPIRED },
    });
    inv = await findOwned(userId, id);
  }
  return toPublic(inv);
};


// * markPaid
const markPaid = async (invoiceId: string, txid: string): Promise<boolean> => {
  try {
    const r = await prisma.invoice.updateMany({
      where: {
        id: invoiceId,
        status: InvoiceStatus.PENDING,
        expiresAt: { gt: new Date() },
      },
      data: { status: InvoiceStatus.PAID, txid, paidAt: new Date() },
    });
    return r.count === 1;
  } catch (e) {
    if (isUniqueViolation(e)) {
      console.warn("[invoice] txid already used, ignored");
      return false;
    }
    throw e;
  }
};


const markUnderpaid = async (invoiceId: string, txid: string): Promise<boolean> => {
  const where = { id: invoiceId, status: InvoiceStatus.PENDING };
  try {
    const r = await prisma.invoice.updateMany({
      where,
      data: { status: InvoiceStatus.UNDERPAID, txid },
    });
    return r.count === 1;
  } catch (e) {
    if (!isUniqueViolation(e)) throw e;
    const r = await prisma.invoice.updateMany({
      where,
      data: { status: InvoiceStatus.UNDERPAID },
    });
    return r.count === 1;
  }
};

const inflight = new Map<string, Promise<ReturnType<typeof toRunResult>>>();

const execute = async (inv: Invoice) => {
  const ai = await AiService.run(inv.feature, inv.input); 
  const text = ai.truncated ? ai.text + TRUNCATION_NOTE : ai.text;
  try {
    const usage = await prisma.$transaction(async (tx) => {
      const u = await tx.usage.create({
        data: {
          userId: inv.userId,
          invoiceId: inv.id,
          feature: inv.feature,
          prompt: inv.input,
          result: text,
          tokens: ai.tokens,
        },
      });
      await tx.invoice.update({
        where: { id: inv.id },
        data: { status: InvoiceStatus.COMPLETED },
      });
      return u;
    });
    return toRunResult(inv, usage);
  } catch (e) {
    if (!isUniqueViolation(e)) throw e;
    const usage = await prisma.usage.findUniqueOrThrow({ where: { invoiceId: inv.id } });
    return toRunResult(inv, usage);
  }
};


// * run
const run = async (userId: string, invoiceId: string) => {
  const inv = await findOwned(userId, invoiceId);

  if (inv.usage) return toRunResult(inv, inv.usage); 

  if (inv.status === InvoiceStatus.PENDING || inv.status === InvoiceStatus.EXPIRED) {
    throw new AppError(status.PAYMENT_REQUIRED, "Payment required.");
  }
  if (inv.status === InvoiceStatus.UNDERPAID) {
    throw new AppError(status.PAYMENT_REQUIRED, "Payment was less than the required amount.");
  }

  const running = inflight.get(inv.id);
  if (running) return running;

  const p = execute(inv).finally(() => inflight.delete(inv.id));
  inflight.set(inv.id, p);
  return p;
};


// * simulatePayment
// const simulatePayment = async (invoiceId: string) => {
//   if (envVars.CHAIN_MODE !== "mock" || envVars.NODE_ENV === "production") {
//     throw new AppError(status.NOT_FOUND, "Not found.");
//   }
//   const inv = await prisma.invoice.findUnique({ where: { id: invoiceId } });
//   if (!inv) throw new AppError(status.NOT_FOUND, "Invoice not found.");
//   const paid = await markPaid(inv.id, `mock-tx-${randomUUID()}`);
//   return { invoiceId: inv.id, paid };
// };


const simulatePayment = async (
  invoiceId: string,
  opts: { amountSats?: bigint; txid?: string } = {},
) => {
  if (envVars.CHAIN_MODE !== "mock" || envVars.NODE_ENV === "production") {
    throw new AppError(status.NOT_FOUND, "Not found.");
  }
  const inv = await prisma.invoice.findUnique({ where: { id: invoiceId } });
  if (!inv) throw new AppError(status.NOT_FOUND, "Invoice not found.");

  const sats = opts.amountSats ?? inv.amountSats;
  const txid = mockChain.simulatePayment(inv.payAddress, sats, opts.txid);
  return {
    invoiceId: inv.id,
    payAddress: inv.payAddress,
    amountSats: sats.toString(),
    txid,
    note: "Added to mock chain. The watcher will pick it up within a few seconds.",
  };
};

export const InvoiceService = {
  createInvoice,
  getInvoice,
  markPaid,
  markUnderpaid,
  run,
  simulatePayment,
};