import { InvoiceStatus } from "@/features/admin_dashboard/invoices/_core/invoice.interface";
import { cva, type VariantProps } from "class-variance-authority";
import { Check, Copy, X } from "lucide-react";


//* admin-dashboard/invoices/components/InvoiceTable.tsx
export const EXPLORER_TX_URL = "https://blockchair.com/bitcoin-cash/transaction/";

export const COLUMNS = [
  ["Created", "w-[10%]"],
  ["User", "w-[18%]"],
  ["Feature", "w-[11%]"],
  ["Status", "w-[10%]"],
  ["Amount", "w-[11%]"],
  ["Address", "w-[10%]"],
  ["Transaction", "w-[10%]"],
  ["Paid At", "w-[10%]"],
  ["Expires At", "w-[10%]"],
] as const;

export const COPY_ICON = { idle: Copy, copied: Check, failed: X } as const;
export const COPY_LABEL = { idle: "Copy", copied: "Copied", failed: "Failed" } as const;

export type CopyState = keyof typeof COPY_ICON;


const STATUS: Record<InvoiceStatus, string> = {
  PENDING: "border-amber-400/30 bg-amber-400/10 text-amber-300",
  PAID: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  COMPLETED: "border-cyan-400/30 bg-cyan-400/10 text-cyan-300",
  EXPIRED: "border-gray-400/30 bg-gray-400/10 text-gray-300",
  UNDERPAID: "border-red-400/30 bg-red-400/10 text-red-300",
};

export const statusBadge = cva(
  "gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium capitalize",
  { variants: { status: STATUS } },
);

export const copyButton = cva("h-7 gap-1 bg-transparent px-2 text-[10px]", {
  variants: {
    state: {
      idle: "border-white/10 text-gray-300 hover:bg-white/10 hover:text-white",
      copied: "border-emerald-500/40 bg-emerald-500/15 text-emerald-300",
      failed: "border-red-500/40 bg-red-500/15 text-red-300",
    },
  },
  defaultVariants: { state: "idle" },
});

export const hoverTrigger = cva("block truncate", {
  variants: {
    mono: { true: "font-mono text-xs", false: "" },
    tone: {
      default: "",
      strong: "font-medium text-white",
      subtle: "text-[11px] text-gray-400",
      accent: "text-orange-400",
      muted: "text-gray-400",
    },
    link: { true: "hover:underline", false: "cursor-default" },
  },
  defaultVariants: { mono: false, tone: "default", link: false },
});

export const dot = cva("size-1.5 rounded-full", {
  variants: { status: { live: "bg-current" } },
  defaultVariants: { status: "live" },
});

export const amountUsd = cva("font-semibold tabular-nums text-white");

export type HoverTriggerProps = VariantProps<typeof hoverTrigger>;
export type StatusBadgeProps = VariantProps<typeof statusBadge>;

export const UI = {
  // layout
  empty:
    "flex flex-col items-center gap-1 rounded-2xl border border-white/10 bg-white/2 p-12 text-center",
  emptyTitle: "text-sm font-medium text-gray-200",
  emptyHint: "text-xs text-gray-500",
  wrapper:
    "w-full overflow-hidden rounded-2xl border border-white/10 bg-white/2 shadow-xl shadow-black/30",
  table: "table-fixed text-xs max-lg:min-w-275",

  // head
  headRow: "border-white/10 bg-white/4 hover:bg-white/4",
  headCell: "px-4 py-3 text-[11px] font-medium tracking-wide text-gray-400",

  // body
  bodyRow: "border-white/5 transition-colors hover:bg-white/4",
  cell: "px-4 py-3.5 align-middle",

  // text
  muted: "text-gray-500",
  dateDay: "text-gray-200",
  dateTime: "text-[11px] text-gray-500",

  // user
  userWrap: "flex min-w-0 items-center gap-2.5",
  avatar:
    "flex size-8 shrink-0 items-center justify-center rounded-full bg-orange-400/15 text-[11px] font-semibold uppercase text-orange-300",
  avatarAnon:
    "flex size-8 shrink-0 items-center justify-center rounded-full bg-white/5 text-[11px] font-semibold text-gray-400",
  userText: "min-w-0 flex-1",
  anonName: "truncate font-medium text-gray-300",
  anonHint: "truncate text-[11px] text-gray-500",

  // feature chip
  feature:
    "inline-flex max-w-full rounded-md bg-white/5 px-2 py-1 text-[11px] capitalize text-gray-200",

  // amount
  sats: "mt-0.5 whitespace-nowrap text-[11px] tabular-nums text-gray-400",
  satsUnit: "ml-1 text-gray-500",

  // hover card
  hoverContent:
    "flex w-auto max-w-85 items-center gap-2 border-white/10 bg-black/70 p-2 shadow-2xl shadow-black/60 backdrop-blur-xl",
  hoverText: "break-all px-1 text-[11px] leading-relaxed text-gray-100",
  hoverTextMono: "font-mono",
  hoverActions: "flex shrink-0 items-center gap-1 border-l border-white/10 pl-2",
  copyIcon: "size-3.5",
  explorerLink:
    "flex size-7 items-center justify-center rounded-md border border-white/10 text-gray-300 transition-colors hover:bg-white/10 hover:text-white",
} as const;




export const isRealTxid = (txid: string) => /^[0-9a-f]{64}$/i.test(txid);
export const formatUsd = (cents: number) => `$${(cents / 100).toFixed(2)}`;
export const formatSats = (sats: string) => Number(sats).toLocaleString("en-US");


export const Icon = COPY_ICON[status];