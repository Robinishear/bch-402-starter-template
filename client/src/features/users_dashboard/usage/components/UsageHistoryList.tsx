import { Coins, Cpu, ExternalLink, History } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { UsageHistoryItem } from "../_core/usage_interface.ts";

const EXPLORER_TX_URL = "https://blockchair.com/bitcoin-cash/transaction/";

const formatFeature = (feature: string) => {
  const text = feature.replace(/-/g, " ");
  return text.charAt(0).toUpperCase() + text.slice(1);
};
const formatUsd = (cents: number) => `$${(cents / 100).toFixed(2)}`;
const formatNumber = (value: number | string) => Number(value).toLocaleString("en-US");
const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" }).format(new Date(iso));

const txUrl = (txid: string) => (txid.startsWith("http") ? txid : `${EXPLORER_TX_URL}${txid}`);
const txHash = (txid: string) => txid.split("/").filter(Boolean).pop() ?? txid;
const shortTx = (txid: string) => {
  const hash = txHash(txid);
  return `${hash.slice(0, 10)}…${hash.slice(-6)}`;
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
    <div className="space-y-2 text-sm leading-relaxed text-gray-300">
      {text
        .split("\n")
        .filter(Boolean)
        .map((line, i) => {
          if (/^\*\*[^*]+\*\*$/.test(line)) {
            return (
              <p key={i} className="pt-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-emerald-400/90 first:pt-0">
                {line.slice(2, -2).replace(/:$/, "")}
              </p>
            );
          }
          if (line.startsWith("* ")) {
            return (
              <p key={i} className="flex gap-2 pl-1">
                <span className="text-emerald-400">•</span>
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

function Chip({ icon: Icon, children }: { icon: typeof Cpu; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2 py-1 font-mono text-xs text-gray-300">
      <Icon className="size-3.5 text-gray-500" />
      {children}
    </span>
  );
}

function UsageItem({ item }: { item: UsageHistoryItem }) {
  return (
    <li className="rounded-xl border border-white/10 bg-white/3 p-5 transition-colors hover:border-white/20">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
              {formatFeature(item.feature)}
            </Badge>
            <span className="text-xs text-gray-500">{formatDate(item.createdAt)}</span>
          </div>
          <h3 className="mt-3 truncate text-lg font-semibold text-white">{item.prompt}</h3>
        </div>

        <div className="text-right">
          <p className="text-2xl font-semibold tabular-nums tracking-tight text-white">{formatUsd(item.priceUsdCents)}</p>
          <p className="text-xs text-gray-500">paid</p>
        </div>
      </div>

      <details className="group mt-4 overflow-hidden rounded-lg border border-white/10 bg-black/20">
        <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-2.5 text-sm font-medium text-gray-300 transition-colors hover:text-white [&::-webkit-details-marker]:hidden">
          <span className="group-open:hidden">View result</span>
          <span className="hidden group-open:inline">Hide result</span>
          <span aria-hidden className="text-gray-500 transition-transform group-open:rotate-180">
            ▾
          </span>
        </summary>
        <div className="border-t border-white/10 p-4">
          <ResultText text={item.result} />
        </div>
      </details>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
        <div className="flex flex-wrap gap-2">
          <Chip icon={Cpu}>{formatNumber(item.tokens)} tokens</Chip>
          <Chip icon={Coins}>{formatNumber(item.amountSats)} sats</Chip>
        </div>

        <a
          href={txUrl(item.txid)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-gray-400 transition-colors hover:text-emerald-300"
        >
          {shortTx(item.txid)}
          <ExternalLink className="size-3.5" />
        </a>
      </div>
    </li>
  );
}

export default function UsageHistoryList({ items }: { items: UsageHistoryItem[] }) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-xl border border-dashed border-white/15 bg-white/2 px-6 py-14 text-center">
        <span className="flex size-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-400">
          <History className="size-5" />
        </span>
        <p className="mt-4 text-sm font-medium text-white">No requests yet</p>
        <p className="mt-1 text-sm text-gray-500">Your AI usage will show up here.</p>
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {items.map((item) => (
        <UsageItem key={item.id} item={item} />
      ))}
    </ul>
  );
}