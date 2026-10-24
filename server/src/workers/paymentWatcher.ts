import { InvoiceStatus } from "../generated/prisma";
import { prisma } from "../app/lib/prisma";
import { chain } from "../app/modules/chain/chain.service";
import { InvoiceService } from "../app/modules/invoice/invoice.service";
import { onInvoiceCreated } from "./signal";

const ACTIVE_INTERVAL_MS = 3_000; 
const IDLE_INTERVAL_MS = 30_000; 
const BATCH_SIZE = 50;

let timer: NodeJS.Timeout | null = null;
let unsubscribe: (() => void) | null = null;
let running = false;
let kicked = false;
let stopped = true;

const ignored = new Set<string>();
const keyOf = (invoiceId: string, txid: string) => `${invoiceId}:${txid}`;

const schedule = (ms: number) => {
  if (stopped) return;
  if (timer) clearTimeout(timer);
  timer = setTimeout(() => void tick(), ms);
  timer.unref();
};

const kick = () => {
  if (running) {
    kicked = true; 
    return;
  }
  schedule(0);
};

const tick = async () => {
  if (running) return; 
  running = true;
  let next = IDLE_INTERVAL_MS;

  try {
    if (ignored.size > 1000) ignored.clear();

    const pending = await prisma.invoice.findMany({
      where: { status: InvoiceStatus.PENDING, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: "asc" },
      take: BATCH_SIZE,
      select: { id: true, payAddress: true, amountSats: true },
    });

    if (pending.length > 0) {
      next = ACTIVE_INTERVAL_MS;
      const found = await chain.findPaymentsToMany(pending.map((i) => i.payAddress));

      for (const inv of pending) {
        const payments = found[inv.payAddress];
        if (!payments?.length) continue;

        const full = payments.filter((p) => p.valueSats >= inv.amountSats);
        if (full.length > 0) {
          const candidate = full.find((p) => !ignored.has(keyOf(inv.id, p.txid)));
          if (!candidate) continue;
          const ok = await InvoiceService.markPaid(inv.id, candidate.txid);
          if (ok) {
            console.log(`[watcher] PAID invoice=${inv.id} tx=${candidate.txid} sats=${candidate.valueSats}`);
          } else {
            ignored.add(keyOf(inv.id, candidate.txid));
          }
          continue;
        }

        const biggest = payments.reduce((a, b) => (a.valueSats >= b.valueSats ? a : b));
        if (ignored.has(keyOf(inv.id, biggest.txid))) continue;
        const ok = await InvoiceService.markUnderpaid(inv.id, biggest.txid);
        if (ok) {
          console.warn(`[watcher] UNDERPAID invoice=${inv.id} got=${biggest.valueSats} need=${inv.amountSats}`);
        }
        ignored.add(keyOf(inv.id, biggest.txid));
      }
    }
  } catch (e) {
    console.error("[watcher] tick failed:", (e as Error).message);
    next = ACTIVE_INTERVAL_MS;
  } finally {
    running = false;
    const delay = kicked ? ACTIVE_INTERVAL_MS : next;
    kicked = false;
    schedule(delay);
  }
};

export const startPaymentWatcher = () => {
  if (!stopped) return;
  stopped = false;
     console.log("[watcher] started");
  unsubscribe = onInvoiceCreated(kick);
  schedule(0);
};

export const stopPaymentWatcher = () => {
  stopped = true;
  if (timer) clearTimeout(timer);
  timer = null;
  unsubscribe?.();
  unsubscribe = null;
};