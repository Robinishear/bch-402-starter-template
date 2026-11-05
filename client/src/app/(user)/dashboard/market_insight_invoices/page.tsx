import PlaygroundForm from "@/features/users_dashboard/invoices/components/PlaygroundForm";
import { getPricing } from "@/features/users_dashboard/pricing/_core/pricing_server";
import ConnectWalletButton from "@/features/users_dashboard/wallet/components/ConnectWalletButton";
import { WalletProvider } from "@/features/users_dashboard/wallet/components/WalletProvider";

export default async function market_insight_invoices() {
  let pricing;
  try {
    pricing = await getPricing();
  } catch {
    return <p className="p-6">Could not load pricing. Please try again.</p>;
  }

  return (
     <WalletProvider>
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Playground</h1>
        <ConnectWalletButton />
      </div>
      <PlaygroundForm pricing={pricing} />
    </div>
  </WalletProvider>

  );
}