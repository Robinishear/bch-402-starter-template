import { Coins } from "lucide-react";

import { FeaturePricing, PricingData } from "../_core/pricing_interface";

const formatFeatureName = (name: string) => {
  const text = name.replace(/-/g, " ");
  return text.charAt(0).toUpperCase() + text.slice(1);
};
const formatUsd = (cents: number) => `$${(cents / 100).toFixed(2)}`;
const formatNumber = (value: number | string) => Number(value).toLocaleString("en-US");

export default function PricingSection({ data }: { data: PricingData }) {
  const rate = Number(data.bchUsdRate).toLocaleString("en-US", { maximumFractionDigits: 2 });

  return (
    <section className="rounded-2xl border border-white/10 bg-white/3 p-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <h2 className="text-xl font-semibold text-white">Service pricing</h2>
          <p className="mt-1 text-sm text-gray-400">Pay per request. Rates follow the live BCH price.</p>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 font-mono text-xs text-emerald-200">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400/70" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
          </span>
          1 BCH = ${rate}
        </div>
      </div>

      {data.features.length === 0 ? (
        <p className="mt-5 text-sm text-gray-400">No services are available right now.</p>
      ) : (
        <ul className="mt-5 grid gap-4 md:grid-cols-2">
          {data.features.map((item: FeaturePricing) => (
            <li
              key={item.feature}
              className="rounded-xl border border-white/10 bg-black/30 p-5 transition-colors hover:border-emerald-500/40"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-wider text-gray-500">Feature</p>
                  <h3 className="mt-1 text-lg font-semibold text-white">{formatFeatureName(item.feature)}</h3>
                </div>
                <span className="flex size-9 items-center justify-center rounded-lg border border-emerald-500/25 bg-emerald-500/10 text-emerald-300">
                  <Coins className="size-4" />
                </span>
              </div>

              <div className="mt-6 flex items-end justify-between gap-3 border-t border-white/10 pt-4">
                <div>
                  <p className="text-3xl font-semibold tabular-nums tracking-tight text-white">
                    {formatUsd(item.priceUsdCents)}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-500">per request</p>
                </div>
                <p className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-sm text-emerald-300">
                  {formatNumber(item.amountSats)} <span className="text-gray-400">sats</span>
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}