import type { LucideIcon } from "lucide-react";
import { ChevronDown, Coins, Cpu, ExternalLink, History, Receipt, Zap } from "lucide-react";

import { cn } from "@/_core/utils/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { UsageHistoryItem } from "../_core/usage.interface.js";

const EXPLORER_TX_URL = "https://blockchair.com/bitcoin-cash/transaction/";

const formatFeature = (feature: string) => {
  const text = feature.replace(/-/g, " ");
  return text.charAt(0).toUpperCase() + text.slice(1);
};
const formatUsd = (cents: number) => `$${(Number(cents) / 100).toFixed(2)}`;
const formatNumber = (value: number | string) => Number(value).toLocaleString("en-US");
const formatTime = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit" }).format(new Date(iso));
const formatDay = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(
    new Date(iso),
  );

const txUrl = (txid: string) => (txid.startsWith("http") ? txid : `${EXPLORER_TX_URL}${txid}`);
const txHash = (txid: string) => txid.split("/").filter(Boolean).pop() ?? txid;
const shortTx = (txid: string) => {
  const hash = txHash(txid);
  return `${hash.slice(0, 8)}…${hash.slice(-6)}`;
};

const groupByDay = (items: UsageHistoryItem[]) => {
  const groups: { day: string; items: UsageHistoryItem[] }[] = [];
  for (const item of items) {
    const day = formatDay(item.createdAt);
    const last = groups[groups.length - 1];
    if (last && last.day === day) last.items.push(item);
    else groups.push({ day, items: [item] });
  }
  return groups;
};

const renderInline = (text: string) =>
  text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") ? (
      <strong key={i} className="font-semibold text-white">
        {part.slice(2, -2)}
      </strong>
    ) : (
      part
    ),
  );

function ResultText({ text }: { text: string }) {
  return (
    <div className="space-y-2.5 text-sm leading-relaxed text-gray-300">
      {text
        .split("\n")
        .filter(Boolean)
        .map((line, i) => {
          if (/^\*\*[^*]+\*\*$/.test(line)) {
            return (
              <p key={i} className="pt-3 text-sm font-semibold text-emerald-300 first:pt-0">
                {line.slice(2, -2).replace(/:$/, "")}
              </p>
            );
          }
          if (line.startsWith("* ")) {
            return (
              <p key={i} className="flex gap-2.5 pl-1">
                <span className="mt-2 size-1 shrink-0 rounded-full bg-emerald-400" />
                <span>{renderInline(line.slice(2))}</span>
              </p>
            );
          }
          if (/^\*[^*\s].*[^*]\*$/.test(line)) {
            return (
              <p key={i} className="pt-1 text-xs italic text-gray-500">
                {line.slice(1, -1)}
              </p>
            );
          }
          return <p key={i}>{renderInline(line)}</p>;
        })}
    </div>
  );
}

const cardBase = "gap-0 rounded-xl border border-white/10 bg-transparent py-0 shadow-none ring-0";

function Stat({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <Card className={cn(cardBase, "transition-colors hover:border-emerald-500/30")}>
      <CardContent className="flex items-center gap-3.5 p-4">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-emerald-500/25 bg-emerald-500/10 text-emerald-300">
          <Icon className="size-4.5" />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-500">{label}</p>
          <p className="truncate font-mono text-xl font-semibold tabular-nums text-white">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function Summary({ items }: { items: UsageHistoryItem[] }) {
  const totalCents = items.reduce((sum, i) => sum + Number(i.priceUsdCents), 0);
  const totalSats = items.reduce((sum, i) => sum + Number(i.amountSats), 0);
  const totalTokens = items.reduce((sum, i) => sum + Number(i.tokens), 0);

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <Stat icon={Receipt} label="Requests" value={formatNumber(items.length)} />
      <Stat icon={Coins} label="Total paid" value={formatUsd(totalCents)} />
      <Stat icon={Zap} label="Total sats" value={formatNumber(totalSats)} />
      <Stat icon={Cpu} label="Total tokens" value={formatNumber(totalTokens)} />
    </div>
  );
}

function UsageItem({ item }: { item: UsageHistoryItem }) {
  return (
    <li className="relative pl-8">
      {/* timeline dot */}
      <span className="absolute left-0 top-7 flex size-4 -translate-x-1/2 items-center justify-center rounded-full border border-emerald-400/60 ring-4 ring-emerald-500/5">
        <span className="size-1.5 rounded-full bg-emerald-400" />
      </span>

      <Card className={cn(cardBase, "overflow-hidden transition-colors hover:border-emerald-500/30")}>
        <CardContent className="flex items-start justify-between gap-6 p-5">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <Badge
                variant="outline"
                className="rounded-full border-emerald-500/30 bg-emerald-500/10 px-2.5 text-emerald-300"
              >
                {formatFeature(item.feature)}
              </Badge>
              <time dateTime={item.createdAt} className="font-mono text-xs text-gray-500">
                {formatTime(item.createdAt)}
              </time>
            </div>
            <h3 className="mt-3 line-clamp-2 text-base font-semibold leading-snug text-white sm:text-lg" title={item.prompt}>
              {item.prompt}
            </h3>
          </div>

          <div className="shrink-0 text-right">
            <p className="font-mono text-2xl font-semibold tabular-nums tracking-tight text-white">
              {formatUsd(item.priceUsdCents)}
            </p>
            <p className="mt-0.5 font-mono text-xs tabular-nums text-gray-500">{formatNumber(item.amountSats)} sats</p>
          </div>
        </CardContent>

        <Separator className="bg-white/10" />

        <details className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-3 text-sm font-medium text-gray-300 transition-colors hover:bg-white/3 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50 [&::-webkit-details-marker]:hidden">
            <span className="group-open:hidden">View result</span>
            <span className="hidden group-open:inline">Hide result</span>
            <ChevronDown className="size-4 text-gray-500 transition-transform duration-200 group-open:rotate-180" />
          </summary>
          <Separator className="bg-white/10" />
          <div className="px-5 py-5">
            <ResultText text={item.result} />
          </div>
        </details>

        <Separator className="bg-white/10" />

        <CardFooter className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-0 bg-transparent px-5 py-3 text-xs text-gray-500">
          <span className="inline-flex items-center gap-1.5">
            <Cpu className="size-3.5" />
            <span className="font-mono tabular-nums text-gray-300">{formatNumber(item.tokens)}</span> tokens
          </span>

          <a
            href={txUrl(item.txid)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md font-mono text-gray-400 transition-colors hover:text-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50"
          >
            Tx {shortTx(item.txid)}
            <ExternalLink className="size-3.5" />
          </a>
        </CardFooter>
      </Card>
    </li>
  );
}

export default function UsageHistoryList({ items }: { items: UsageHistoryItem[] }) {
  if (items.length === 0) {
    return (
      <Card className={cn(cardBase, "border-dashed border-white/15")}>
        <CardContent className="flex flex-col items-center px-6 py-16 text-center">
          <span className="flex size-12 items-center justify-center rounded-xl border border-emerald-500/25 bg-emerald-500/10 text-emerald-300">
            <History className="size-5" />
          </span>
          <p className="mt-4 text-base font-semibold text-white">No requests yet</p>
          <p className="mt-1 max-w-xs text-sm text-gray-500">
            Use any AI feature and it will appear here with its price and transaction.
          </p>
        </CardContent>
      </Card>
    );
  }

  const groups = groupByDay(items);

  return (
    <div className="space-y-8">
      <Summary items={items} />

      {groups.map((group) => (
        <section key={group.day} aria-label={group.day}>
          <h2 className="mb-4 flex items-center gap-4 text-xs font-medium uppercase tracking-wider text-gray-400">
            {group.day}
            <Separator className="h-px flex-1 bg-white/10" />
          </h2>

          <ul className="space-y-4 border-l border-white/10">
            {group.items.map((item) => (
              <UsageItem key={item.id} item={item} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}