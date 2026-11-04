import { FeaturePricing, PricingData } from "../_core/pricing_interface";
import { Coins, Zap, RefreshCw } from "lucide-react";

const formatFeatureName = (name: string) => {
  return name.replace(/-/g, " ").toUpperCase();
};

export default function PricingSection({ data }: { data: PricingData }) {
  return (
    <div className="space-y-6 rounded-2xl border border-white/10 bg-white/2 p-6 backdrop-blur-xl">
      {/* Top Header & Live Rate Badge */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Zap className="size-5 text-orange-400" /> Real-Time Service Pricing
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Dynamic rates calculated via live BCH market data
          </p>
        </div>

        {/* Live BCH/USD Rate Badge */}
        <div className="flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-semibold text-orange-300">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
          </span>
          1 BCH = ${data.bchUsdRate} USD
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.features.map((item: FeaturePricing) => (
          <div
            key={item.feature}
            className="group relative overflow-hidden rounded-xl border border-white/10 bg-black/40 p-5 transition-all hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/10"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-mono tracking-wider text-gray-400 uppercase">
                  Feature
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  {formatFeatureName(item.feature)}
                </h3>
              </div>
              <Coins className="size-6 text-emerald-400 group-hover:scale-110 transition-transform" />
            </div>

            <div className="mt-6 flex items-baseline justify-between border-t border-white/5 pt-4">
              <div>
                <span className="text-2xl font-black text-emerald-400">
                  {item.amountSats}
                </span>
                <span className="ml-1 text-xs text-gray-400 font-mono">sats</span>
              </div>
              <span className="text-sm font-semibold text-gray-300 bg-white/5 px-2.5 py-1 rounded-md">
                ${(item.priceUsdCents / 100).toFixed(2)} USD
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}