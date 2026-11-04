import { getPricing } from "@/features/users_dashboard/pricing/_core/pricing_server";
import PricingSection from "@/features/users_dashboard/pricing/components/PricingSection";
import { getUsageHistory, getUsageSummary } from "@/features/users_dashboard/usage/_core/usage_server";
import StatCards from "@/features/users_dashboard/usage/components/StatCards";
import UsageHistoryList from "@/features/users_dashboard/usage/components/UsageHistoryList";
import UsagePagination from "@/features/users_dashboard/usage/components/UsagePagination";


type Props = { searchParams: Promise<{ page?: string }> };
export default async function DashboardPage({ searchParams }: Props) {
  const { page } = await searchParams;
  const currentPage = Math.max(Number(page) || 1, 1);

  let summary, history;
  try {
    [summary, history] = await Promise.all([
      getUsageSummary(),
      getUsageHistory(currentPage),
    ]);
  } catch {
    return <p className="p-6">Could not load your summary. Please login again.</p>;
  }

  const pricingData = await getPricing();

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-2xl font-bold">Overview & Usage</h1>
        <p className="mt-1 text-sm text-gray-400">Your AI requests and what each one cost.</p>
      </div>

      <StatCards summary={summary} />
      <PricingSection data={pricingData} />
      

      <section>
        <h2 className="mb-4 text-lg font-semibold">History</h2>
        <UsageHistoryList items={history.items} />
        <UsagePagination meta={history.meta} />
      </section>
    </div>
  );
}