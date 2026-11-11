import { Check, Copy, X } from "lucide-react";
import { InvoiceStatus } from "../_core/invoice.interface";

export const BORDER = "border-white/10";
export const ACCENT = "text-orange-400";
export const MUTED = "text-gray-500";
export const SUBTLE = "text-[11px] text-gray-400";
export const CELL = "px-3 py-3";

export const STATUS_STYLE: Record<InvoiceStatus, string> = {
  PENDING: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  PAID: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  COMPLETED: "border-cyan-500/30 bg-cyan-500/10 text-cyan-300",
  EXPIRED: "border-gray-500/30 bg-gray-500/10 text-gray-300",
  UNDERPAID: "border-red-500/30 bg-red-500/10 text-red-300",
};

export const COPY_STATE = {
  idle: {
    Icon: Copy,
    label: "Copy",
    style: `${BORDER} text-gray-300 hover:bg-white/10 hover:text-white`,
  },
  copied: {
    Icon: Check,
    label: "Copied",
    style: "border-emerald-500/40 bg-emerald-500/15 text-emerald-300",
  },
  failed: {
    Icon: X,
    label: "Failed",
    style: "border-red-500/40 bg-red-500/15 text-red-300",
  },
};

export const COLUMNS = [
  ["Created", "w-[9%]"],
  ["User", "w-[16%]"],
  ["Feature", "w-[10%]"],
  ["Status", "w-[9%]"],
  ["USD", "w-[7%]"],
  ["Sats", "w-[10%]"],
  ["Address", "w-[11%]"],
  ["Transaction", "w-[10%]"],
  ["Paid At", "w-[9%]"],
  ["Expires At", "w-[9%]"],
];

export const EXPLORER_TX_URL = "https://blockchair.com/bitcoin-cash/transaction/";