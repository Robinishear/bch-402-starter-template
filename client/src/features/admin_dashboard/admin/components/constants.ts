import { LucideIcon } from "lucide-react";
import { IAnalyticsPoint } from "../_core/admin.interface";

// TODO : Add more metrics as needed AnalyticsChart.tsx 
export const RANGES = [7, 30, 90] as const;

export type MetricKey = Exclude<keyof IAnalyticsPoint, "date">;

export type Metric = {
  key: MetricKey;
  label: string;
  color: string;
  format: (n: number) => string;
};

export const int = (n: number) => Math.round(n).toLocaleString("en-US");

export const METRICS: Metric[] = [
  { key: "users", label: "New users", color: "#34d399", format: int },
  { key: "invoices", label: "Invoices", color: "#22d3ee", format: int },
  { key: "paidInvoices", label: "Paid invoices", color: "#a78bfa", format: int },
  {
    key: "revenueUsd",
    label: "Revenue",
    color: "#fbbf24",
    format: (n) => `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
  },
  { key: "aiUses", label: "AI uses", color: "#38bdf8", format: int },
  { key: "aiTokens", label: "AI tokens", color: "#f472b6", format: (n) => Intl.NumberFormat("en-US", { notation: "compact" }).format(n) },
];
//* DONE */


// TODO : Add more metrics as needed AdminStatsCards.tsx
export type Tone = "green" | "red" | "amber" | "blue" | "gray";

export type Row = {
  label: string;
  value: string;
  tone: Tone;
  raw?: number;
  total?: boolean;
};

export type StatCard = {
  key: string;
  label: string;
  caption: string;
  value: string;
  icon: LucideIcon;
  preview: Row[];
  all: Row[];
  distribution?: boolean;
  featured?: boolean;
};

export const formatNumber = (value: number | string) => Number(value).toLocaleString("en-US");

export const TONE: Record<Tone, { dot: string; text: string; bar: string; soft: string }> = {
  green: { dot: "bg-emerald-400", text: "text-emerald-300", bar: "bg-emerald-400", soft: "bg-emerald-500/10" },
  red: { dot: "bg-red-400", text: "text-red-300", bar: "bg-red-400", soft: "bg-red-500/10" },
  amber: { dot: "bg-amber-400", text: "text-amber-300", bar: "bg-amber-400", soft: "bg-amber-500/10" },
  blue: { dot: "bg-sky-400", text: "text-sky-300", bar: "bg-sky-400", soft: "bg-sky-500/10" },
  gray: { dot: "bg-gray-400", text: "text-gray-300", bar: "bg-gray-500", soft: "bg-white/5" },
};
//* DONE */

// TODO : Add more metrics as needed UserManagementTable.tsx

export type ActionResult = { success: boolean; message: string };
export const CONFIRM_TIMEOUT_MS = 3000;
export const headCell = "h-11 text-xs font-medium uppercase tracking-wider text-gray-500";
export const actionBtn = "h-8 gap-1.5 rounded-lg px-3 text-xs shadow-none transition-colors";


