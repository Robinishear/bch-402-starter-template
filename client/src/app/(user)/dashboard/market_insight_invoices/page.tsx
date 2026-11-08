import PlaygroundForm from "@/features/users_dashboard/invoices/components/PlaygroundForm";
import { getPricing } from "@/features/users_dashboard/pricing/_core/pricing.service";
import ConnectWalletButton from "@/features/users_dashboard/wizard/components/ConnectWalletButton";
import { WalletProvider } from "@/features/users_dashboard/wizard/components/WalletProvider";

function LoadError() {
  return (
    <div className="p-6">
      <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-6 text-sm text-red-200">
        Could not load pricing. Please refresh the page and try again.
      </div>
    </div>
  );
}

export default async function MarketInsightPage() {
  const pricing = await getPricing().catch(() => null);
  if (!pricing) return <LoadError />;

  return (
    <WalletProvider>
      <div className="space-y-8 p-6">
        <header className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              AI{" "}
              <span className="bg-linear-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">Playground</span>
            </h1>
            <p className="mt-1.5 max-w-2xl text-sm text-gray-400">
              Ask a question, pay a tiny BCH amount and get your insight.
            </p>
          </div>
{/* <WalletCheck /> */}
          <ConnectWalletButton />
        </header>

        <PlaygroundForm pricing={pricing} />
      </div>
    </WalletProvider>
  );
}


