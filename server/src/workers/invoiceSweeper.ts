import { InvoiceStatus } from "../generated/prisma";
import { prisma } from "../app/lib/prisma";

const INTERVAL_MS = 60_000;
let running = false;
let timer: NodeJS.Timeout | null = null;

const sweep = async () => {
  if (running) return; 
  running = true;
  try {
    const r = await prisma.invoice.updateMany({
      where: { status: InvoiceStatus.PENDING, expiresAt: { lte: new Date() } },
      data: { status: InvoiceStatus.EXPIRED },
    });
    if (r.count > 0) console.log(`[sweeper] expired ${r.count} invoice(s)`);
  } catch (e) {
    console.error("[sweeper] failed:", (e as Error).message);
  } finally {
    running = false;
  }
};

export const startInvoiceSweeper = () => {
  if (timer) return;
  timer = setInterval(sweep, INTERVAL_MS);
  timer.unref(); 
  void sweep();
};

export const stopInvoiceSweeper = () => {
  if (timer) clearInterval(timer);
  timer = null;
};