import { ChevronDown, ExternalLink } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { UsageHistoryItem } from "../_core/usage_interface.ts";


const formatFeature = (feature: string) => {
  const text = feature.replace(/-/g, " ");
  return text.charAt(0).toUpperCase() + text.slice(1);
};
const formatUsd = (cents: number) => `$${(cents / 100).toFixed(2)}`;
const formatNumber = (value: number | string) => Number(value).toLocaleString("en-US");
const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { dateStyle: "medium", timeStyle: "short" }).format(new Date(iso));
const shortTx = (txid: string) => `${txid.slice(0, 10)}…${txid.slice(-6)}`;

const renderInline = (text: string) =>
  text
    .split(/(\*\*[^*]+\*\*)/g)
    .map((part, i) =>
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
    <div className="space-y-1.5 text-sm leading-relaxed text-gray-300">
      {text
        .split("\n")
        .filter(Boolean)
        .map((line, i) => {
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
              <p key={i} className="text-xs italic text-gray-500">
                {line.slice(1, -1)}
              </p>
            );
          }
          return <p key={i}>{renderInline(line)}</p>;
        })}
    </div>
  );
}

function UsageItem({ item }: { item: UsageHistoryItem }) {
  return (
    <li className="rounded-lg border p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
            {formatFeature(item.feature)}
          </Badge>
          <p className="mt-2 truncate text-lg font-semibold">{item.prompt}</p>
          <p className="mt-1 text-xs text-gray-400">
            {formatDate(item.createdAt)} · {formatNumber(item.tokens)} tokens
          </p>
        </div>

        <div className="text-right">
          <p className="text-lg font-bold">{formatUsd(item.priceUsdCents)}</p>
          <p className="text-xs text-gray-400">{formatNumber(item.amountSats)} sats</p>
        </div>
      </div>

      <details className="group mt-4 rounded-md border border-white/10 bg-white/2">
        <summary className="flex cursor-pointer list-none items-center justify-between px-3 py-2 text-sm text-gray-300 [&::-webkit-details-marker]:hidden">
          View result
          <ChevronDown className="size-4 transition-transform group-open:rotate-180" />
        </summary>
        <div className="border-t border-white/10 p-3">
          <ResultText text={item.result} />
        </div>
      </details>

      <a
        href={item.txid}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex items-center gap-1.5 font-mono text-xs text-gray-400 transition-colors hover:text-emerald-300"
      >
        <ExternalLink className="size-3.5" />
        {shortTx(item.txid)}
      </a>
    </li>
  );
}

export default function UsageHistoryList({ items }: { items: UsageHistoryItem[] }) {
  if (items.length === 0) {
    return (
      <p className="rounded-lg border p-8 text-center text-sm text-gray-400">
        No requests yet. Your AI usage will show up here.
      </p>
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