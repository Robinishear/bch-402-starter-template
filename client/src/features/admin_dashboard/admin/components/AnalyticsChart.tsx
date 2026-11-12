"use client";

import { useMemo, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { cn } from "@/_core/utils/utils";
import type { IAnalytics } from "../_core/admin.interface";
import { Metric, MetricKey, METRICS, RANGES } from "./constants";

const formatDate = (date: string, long = false) =>
  new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", {
    timeZone: "UTC",
    month: "short",
    day: "numeric",
    ...(long && { weekday: "short", year: "numeric" }),
  });

function ChartTooltip({
  active,
  payload,
  label,
  metric,
}: {
  active?: boolean;
  payload?: ReadonlyArray<{ value?: number | string }>;
  label?: string | number;
  metric: Metric;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-white/10 bg-[#0b0f0e]/95 px-3 py-2 shadow-xl backdrop-blur">
      <p className="text-xs text-gray-400">{formatDate(String(label), true)}</p>
      <p className="mt-1 flex items-center gap-2 text-sm font-medium text-white">
        <span className="size-2 rounded-full" style={{ background: metric.color }} />
        {metric.label}:<span className="font-mono">{metric.format(Number(payload[0].value ?? 0))}</span>
      </p>
    </div>
  );
}

export function AnalyticsChart({ analytics }: { analytics: IAnalytics }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [activeKey, setActiveKey] = useState<MetricKey>("users");

  const { series, range } = analytics;
  const metric = METRICS.find((m) => m.key === activeKey) ?? METRICS[0];

  const totals = useMemo(() => {
    const sums = {} as Record<MetricKey, number>;
    for (const m of METRICS) sums[m.key] = series.reduce((n, p) => n + p[m.key], 0);
    return sums;
  }, [series]);

  const changeRange = (days: number) => {
    if (pending || days === range.days) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("days", String(days));
    startTransition(() => router.replace(`${pathname}?${params.toString()}`, { scroll: false }));
  };

  const empty = totals[metric.key] === 0;
  const gradientId = `fill-${metric.key}`;

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">Activity overview</h2>
          <p className="text-sm text-gray-500">
            {formatDate(range.from)} – {formatDate(range.to)} · last {range.days} days
          </p>
        </div>

        <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 p-1">
          {pending && <Loader2 className="mx-1.5 size-4 animate-spin text-emerald-300" />}
          {RANGES.map((d) => (
            <button
              key={d}
              type="button"
              disabled={pending}
              onClick={() => changeRange(d)}
              className={cn(
                "rounded-md px-3 py-1 text-xs font-medium transition-colors disabled:cursor-wait",
                d === range.days
                  ? "bg-emerald-500/20 text-emerald-300"
                  : "text-gray-400 hover:bg-white/5 hover:text-white",
              )}
            >
              {d}D
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-white/10 bg-white/3 shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_8px_30px_-12px_rgba(0,0,0,0.6)]">
        {/* metric tabs */}
        <div className="grid grid-cols-2 divide-x divide-y divide-white/10 border-b border-white/10 sm:grid-cols-3 lg:grid-cols-6 lg:divide-y-0">
          {METRICS.map((m) => {
            const selected = m.key === activeKey;
            return (
              <button
                key={m.key}
                type="button"
                onClick={() => setActiveKey(m.key)}
                className={cn(
                  "relative px-4 py-3 text-left transition-colors hover:bg-white/3",
                  selected && "bg-white/5",
                )}
              >
                <span className="flex items-center gap-2 text-xs text-gray-400">
                  <span className="size-2 rounded-full" style={{ background: m.color }} />
                  {m.label}
                </span>
                <span className="mt-1 block font-mono text-lg font-semibold text-white">{m.format(totals[m.key])}</span>
                {selected && <span className="absolute inset-x-0 bottom-0 h-0.5" style={{ background: m.color }} />}
              </button>
            );
          })}
        </div>

        {/* chart */}
        <div className="relative h-72 px-2 pb-2 pt-5 sm:px-4" aria-busy={pending}>
          <div className={cn("h-full transition-all duration-200", pending && "pointer-events-none opacity-40 blur-[1px]")}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={series} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={metric.color} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={metric.color} stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.06)" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(d) => formatDate(String(d))}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  minTickGap={28}
                  tick={{ fill: "#6b7280", fontSize: 11 }}
                />
                <YAxis
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                  width={44}
                  tickFormatter={(v) => (metric.key === "revenueUsd" ? `$${v}` : Intl.NumberFormat("en-US", { notation: "compact" }).format(v))}
                  tick={{ fill: "#6b7280", fontSize: 11 }}
                />
                <Tooltip
                  cursor={{ stroke: metric.color, strokeOpacity: 0.3, strokeDasharray: "4 4" }}
                  content={<ChartTooltip metric={metric} />}
                />
                <Area
                  key={metric.key}
                  type="monotone"
                  dataKey={metric.key}
                  stroke={metric.color}
                  strokeWidth={2}
                  fill={`url(#${gradientId})`}
                  activeDot={{ r: 4, strokeWidth: 0, fill: metric.color }}
                  animationDuration={500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {empty && !pending && (
            <p className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm text-gray-500">
              No {metric.label.toLowerCase()} in this period.
            </p>
          )}

          {pending && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-black/70 px-4 py-2 text-sm text-emerald-300 shadow-lg backdrop-blur">
                <Loader2 className="size-4 animate-spin" />
                Loading...
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}