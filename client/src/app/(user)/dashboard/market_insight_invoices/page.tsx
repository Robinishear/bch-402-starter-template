import PlaygroundForm from "@/features/users_dashboard/invoices/components/PlaygroundForm";
import { getPricing } from "@/features/users_dashboard/pricing/_core/pricing_server";

export default async function market_insight_invoices() {
  let pricing;
  try {
    pricing = await getPricing();
  } catch {
    return <p className="p-6">Could not load pricing. Please try again.</p>;
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Playground</h1>
      <PlaygroundForm pricing={pricing} />
    </div>
  );
}