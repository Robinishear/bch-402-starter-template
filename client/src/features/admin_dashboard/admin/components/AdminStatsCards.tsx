import { FileText, Sparkles, Users, Wallet, type LucideIcon } from "lucide-react";

import { cn } from "@/_core/utils/utils";
import { IStats } from "../_core/admin.interface";

type Stat = {
  label: string;
  value: string;
  sub: string;
  icon: LucideIcon;
  featured?: boolean;
};

const formatNumber = (value: number | string) => Number(value).toLocaleString("en-US");

export function AdminStatsCards({ stats }: { stats: IStats }) {
  const items: Stat[] = [
    {
      label: "Total users",
      value: formatNumber(stats.users.total),
      sub: `${formatNumber(stats.users.active)} active · ${formatNumber(stats.users.blocked)} blocked`,
      icon: Users,
    },
    {
      label: "Invoices",
      value: formatNumber(stats.invoices.total),
      sub: `${formatNumber(stats.invoices.paid)} paid · ${formatNumber(stats.invoices.pending)} pending`,
      icon: FileText,
    },
    {
      label: "Revenue",
      value: `$${stats.revenue.usd}`,
      sub: `${formatNumber(stats.revenue.paidInvoices)} paid invoices`,
      icon: Wallet,
      featured: true,
    },
    {
      label: "AI generations",
      value: formatNumber(stats.ai.totalUses),
      sub: `${formatNumber(stats.ai.totalTokens)} tokens used`,
      icon: Sparkles,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {items.map(({ label, value, sub, icon: Icon, featured }) => (
        <div
          key={label}
          className={cn(
            "relative overflow-hidden rounded-xl border p-4 transition-colors hover:border-white/20",
            featured ? "border-emerald-500/30 bg-emerald-500/5" : "border-white/10 bg-white/3",
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
          <p className="mt-1 font-mono text-xs text-gray-400">{sub}</p>
        </div>
      ))}
    </div>
  );
}