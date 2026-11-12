"use client";

import { useState, type KeyboardEvent } from "react";
import { ChevronRight, FileText, Sparkles, Users, Wallet, type LucideIcon } from "lucide-react";

import { cn } from "@/_core/utils/utils";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { IStats } from "../_core/admin.interface";
import { Row,TONE,StatCard,formatNumber } from "./constants";


function PreviewRows({ rows }: { rows: Row[] }) {
  return (
    <ul className="divide-y divide-white/5 rounded-lg bg-white/4 px-3">
      {rows.map((r) => (
        <li key={r.label} className="flex items-center justify-between gap-3 py-2">
          <span className="flex items-center gap-2 whitespace-nowrap text-[11px] text-gray-400">
            <span className={cn("size-1.5 shrink-0 rounded-full", TONE[r.tone].dot)} />
            {r.label}
          </span>
          <span className={cn("break-all text-right font-mono text-xs font-medium tabular-nums", TONE[r.tone].text)}>
            {r.value}
          </span>
        </li>
      ))}
    </ul>
  );
}

function DetailRows({ rows, base }: { rows: Row[]; base?: number }) {
  return (
    <ul className="space-y-2">
      {rows.map((r) => {
        const t = TONE[r.tone];
        const pct = base && r.raw !== undefined && !r.total ? (r.raw / base) * 100 : null;
        return (
          <li
            key={r.label}
            className={cn(
              "flex items-center justify-between gap-4 rounded-xl border px-4 py-3",
              r.total ? "border-white/15 bg-white/6" : "border-white/8 bg-white/3",
            )}
          >
            <span className="flex items-center gap-3 whitespace-nowrap text-sm text-gray-300">
              <span className={cn("flex size-7 items-center justify-center rounded-lg", t.soft)}>
                <span className={cn("size-2 rounded-full", t.dot)} />
              </span>
              <span className={cn(r.total && "font-semibold text-white")}>{r.label}</span>
            </span>
            <span className="flex items-baseline gap-2 text-right">
              {pct !== null && <span className="font-mono text-[11px] text-gray-500">{pct.toFixed(1)}%</span>}
              <span className={cn("break-all font-mono text-base font-semibold tabular-nums", t.text)}>{r.value}</span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}

function DistributionBar({ rows, base }: { rows: Row[]; base: number }) {
  const parts = rows.filter((r) => !r.total && (r.raw ?? 0) > 0);
  if (!base || parts.length === 0) return null;
  return (
    <div>
      <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-white/5">
        {parts.map((r) => (
          <div
            key={r.label}
            className={cn("h-full", TONE[r.tone].bar)}
            style={{ width: `${((r.raw ?? 0) / base) * 100}%` }}
            title={`${r.label}: ${r.value}`}
          />
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
        {parts.map((r) => (
          <span key={r.label} className="flex items-center gap-1.5 text-[11px] text-gray-400">
            <span className={cn("size-1.5 rounded-full", TONE[r.tone].dot)} />
            {r.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export function AdminStatsCards({ stats }: { stats: IStats }) {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const { users, invoices, revenue, ai } = stats;

  const avgTokens = ai.totalUses > 0 ? Math.round(ai.totalTokens / ai.totalUses) : 0;

  const cards: StatCard[] = [
    {
      key: "users",
      label: "Users",
      caption: "Registered accounts",
      value: formatNumber(users.total),
      icon: Users,
      distribution: true,
      preview: [
        { label: "Active", value: formatNumber(users.active), tone: "green" },
        { label: "Blocked", value: formatNumber(users.blocked), tone: "amber" },
        { label: "Deleted", value: formatNumber(users.deleted), tone: "red" },
      ],
      all: [
        { label: "Total", value: formatNumber(users.total), tone: "gray", total: true },
        { label: "Active", value: formatNumber(users.active), tone: "green", raw: users.active },
        { label: "Blocked", value: formatNumber(users.blocked), tone: "amber", raw: users.blocked },
        { label: "Deleted", value: formatNumber(users.deleted), tone: "red", raw: users.deleted },
      ],
    },
    {
      key: "invoices",
      label: "Invoices",
      caption: "All invoices created",
      value: formatNumber(invoices.total),
      icon: FileText,
      distribution: true,
      preview: [
        { label: "Paid", value: formatNumber(invoices.paid), tone: "green" },
        { label: "Completed", value: formatNumber(invoices.completed), tone: "blue" },
        { label: "Expired", value: formatNumber(invoices.expired), tone: "gray" },
      ],
      all: [
        { label: "Total", value: formatNumber(invoices.total), tone: "gray", total: true },
        { label: "Pending", value: formatNumber(invoices.pending), tone: "amber", raw: invoices.pending },
        { label: "Paid", value: formatNumber(invoices.paid), tone: "green", raw: invoices.paid },
        { label: "Completed", value: formatNumber(invoices.completed), tone: "blue", raw: invoices.completed },
        { label: "Expired", value: formatNumber(invoices.expired), tone: "gray", raw: invoices.expired },
        { label: "Underpaid", value: formatNumber(invoices.underpaid), tone: "red", raw: invoices.underpaid },
      ],
    },
    {
      key: "revenue",
      label: "Revenue",
      caption: "Paid + completed",
      value: `$${revenue.usd}`,
      icon: Wallet,
      featured: true,
      preview: [
        { label: "Paid invoices", value: formatNumber(revenue.paidInvoices), tone: "blue" },
        { label: "Sats", value: formatNumber(revenue.sats), tone: "amber" },
        { label: "BCH", value: String(revenue.bch), tone: "green" },
      ],
      all: [
        { label: "USD", value: `$${revenue.usd}`, tone: "green", total: true },
        { label: "Paid invoices", value: formatNumber(revenue.paidInvoices), tone: "blue" },
        { label: "Sats", value: formatNumber(revenue.sats), tone: "amber" },
        { label: "BCH", value: String(revenue.bch), tone: "green" },
      ],
    },
    {
      key: "ai",
      label: "AI generations",
      caption: "Total AI requests",
      value: formatNumber(ai.totalUses),
      icon: Sparkles,
      preview: [
        { label: "Total uses", value: formatNumber(ai.totalUses), tone: "gray" },
        { label: "Tokens used", value: formatNumber(ai.totalTokens), tone: "blue" },
        { label: "Avg / use", value: formatNumber(avgTokens), tone: "green" },
      ],
      all: [
        { label: "Total uses", value: formatNumber(ai.totalUses), tone: "gray", total: true },
        { label: "Tokens used", value: formatNumber(ai.totalTokens), tone: "blue" },
        { label: "Avg tokens / use", value: formatNumber(avgTokens), tone: "green" },
      ],
    },
  ];

  const open = cards.find((c) => c.key === openKey) ?? null;
  const openBase = open ? Number(open.value.replace(/[^0-9.]/g, "")) : 0;

  const onKey = (e: KeyboardEvent<HTMLDivElement>, key: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpenKey(key);
    }
  };

  return (
    <>
      <div className="grid auto-rows-fr grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ key, label, caption, value, icon: Icon, preview, featured }) => (
          <Card
            key={key}
            role="button"
            tabIndex={0}
            onClick={() => setOpenKey(key)}
            onKeyDown={(e) => onKey(e, key)}
            className={cn(
              "group relative h-full min-h-59 cursor-pointer gap-0 overflow-hidden rounded-2xl border bg-transparent py-0 p-4 text-left shadow-[0_8px_30px_-12px_rgba(0,0,0,0.6)] ring-0 transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50",
              featured
                ? "border-emerald-500/30 bg-emerald-500/5 hover:border-emerald-400/50"
                : "border-white/10 bg-white/3 hover:border-white/20",
            )}
          >
            {featured && (
              <div
                aria-hidden
                className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-emerald-400/70 to-transparent"
              />
            )}

            <CardHeader className="flex flex-row items-center gap-2.5 space-y-0 p-0">
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-lg border",
                  featured
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                    : "border-white/10 bg-white/5 text-gray-400",
                )}
              >
                <Icon className="size-4" />
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-300">{label}</p>
                <p className="text-[10px] text-gray-500">{caption}</p>
              </div>
            </CardHeader>

            <CardContent className="flex flex-1 flex-col p-0">
              <p className="mt-3 mb-3 break-all text-3xl font-semibold tabular-nums leading-none tracking-tight text-white">
                {value}
              </p>

              <div className="mt-auto">
                <PreviewRows rows={preview} />
              </div>
            </CardContent>

            <CardFooter className="mt-2 border-0 bg-transparent p-0">
              <span className="inline-flex items-center gap-0.8 text-[10px] font-medium text-gray-500 transition-colors group-hover:text-emerald-600">
                View details <ChevronRight className="size-3 transition-transform group-hover:translate-x-0.5" />
              </span>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={open !== null} onOpenChange={(next) => !next && setOpenKey(null)}>
        <DialogContent className="max-w-md gap-0 overflow-hidden rounded-2xl border-white/10 bg-[#0b0f0e] p-0 text-gray-200">
          {open && (
            <>
              <div className="border-b border-white/10 bg-linear-to-b from-emerald-500/8 to-transparent px-6 pb-5 pt-6">
                <DialogHeader className="space-y-1">
                  <DialogTitle className="flex items-center gap-3 text-base font-semibold text-white">
                    <span className="flex size-10 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
                      <open.icon className="size-5" />
                    </span>
                    <span>
                      {open.label}
                      <span className="block text-xs font-normal text-gray-400">{open.caption}</span>
                    </span>
                  </DialogTitle>
                  <DialogDescription className="sr-only">{open.label} details</DialogDescription>
                </DialogHeader>

                <p className="mt-4 break-all text-4xl font-semibold tabular-nums tracking-tight text-white">
                  {open.value}
                </p>

                {open.distribution && (
                  <div className="mt-4">
                    <DistributionBar rows={open.all} base={openBase} />
                  </div>
                )}
              </div>

              <div className="max-h-[55vh] overflow-y-auto px-6 py-5">
                <DetailRows rows={open.all} base={open.distribution ? openBase : undefined} />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}