import { Activity, Coins, Cpu, Receipt, Wallet, type LucideIcon } from "lucide-react";

import { cn } from "@/_core/utils/utils";
import { UsageSummary } from "../_core/usage.interface";

type Stat = {
  label: string;
  value: string;
  sub?: string;
  icon: LucideIcon;
  featured?: boolean;
};

const formatNumber = (value: number | string) => Number(value).toLocaleString("en-US");

export default function StatCards({ summary }: { summary: UsageSummary }) {
  const stats: Stat[] = [
    { label: "Total uses", value: formatNumber(summary.totalUses), icon: Activity },
    { label: "Paid invoices", value: formatNumber(summary.paidInvoices), icon: Receipt },
    { label: "AI tokens used", value: formatNumber(summary.totalTokens), icon: Cpu },
    { label: "Sats spent", value: formatNumber(summary.totalSpentSats), icon: Coins },
    {
      label: "Total spent",
      value: `$${summary.totalSpentUsd}`,
      sub: `${summary.totalSpentBch} BCH`,
      icon: Wallet,
      featured: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
      {stats.map(({ label, value, sub, icon: Icon, featured }) => (
        <div
          key={label}
          className={cn(
            "relative overflow-hidden rounded-xl border p-4 transition-colors hover:border-white/20",
            featured
              ? "col-span-2 border-emerald-500/30 bg-emerald-500/5 lg:col-span-1"
              : "border-white/10 bg-white/3",
          )}
        >
          {featured && (
            <div
              aria-hidden
              className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-emerald-400/70 to-transparent"
            />
          )}

          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-400">{label}</p>
            <Icon className={cn("size-4 shrink-0", featured ? "text-emerald-300" : "text-gray-500")} />
          </div>

          <p className="mt-3 text-2xl font-semibold tabular-nums tracking-tight text-white">{value}</p>
          {sub && <p className="mt-1 font-mono text-xs text-gray-400">{sub}</p>}
        </div>
      ))}
    </div>
  );
}