import Link from "next/link";

import { getPricing } from "@/features/users_dashboard/pricing/_core/pricing.service";
import PricingSection from "@/features/users_dashboard/pricing/components/PricingSection";
import { getUsageSummary } from "@/features/users_dashboard/usage/_core/usage.service";
import StatCards from "@/features/users_dashboard/usage/components/StatCards";
// history: import { getUsageHistory } from "@/features/users_dashboard/usage/_core/usage_server";
// history: import UsageHistoryList from "@/features/users_dashboard/usage/components/UsageHistoryList";
// history: import UsagePagination from "@/features/users_dashboard/usage/components/UsagePagination";

// history: type Props = { searchParams: Promise<{ page?: string }> };

function LoadError() {
  return (
    <div className="p-6">
      <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-6 text-sm text-red-200">
        Could not load your dashboard. Please{" "}
        <Link href="/login" className="font-medium underline underline-offset-4">
          login again
        </Link>
        .
      </div>
    </div>
  );
}

// history: export default async function DashboardPage({ searchParams }: Props) {
export default async function DashboardPage() {
  // history: const { page } = await searchParams;
  // history: const currentPage = Math.max(Number(page) || 1, 1);

  let data;
  try {
    data = await Promise.all([
      getUsageSummary(),
      getPricing(),
      // history: getUsageHistory(currentPage),
    ]);
  } catch {
    return <LoadError />;
  }

  const [summary, pricingData] = data;
  // history: const [summary, pricingData, history] = data;

  return (
    <div className="space-y-8 p-6">
      <header className="border-b border-white/10 pb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Overview{" "}
          <span className="bg-linear-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">& Usage</span>
        </h1>
        <p className="mt-1.5 max-w-2xl text-sm text-gray-400">Your AI requests and what each one cost.</p>
      </header>

      <StatCards summary={summary} />
      <PricingSection data={pricingData} />

      {/* history:
      <section>
        <h2 className="mb-4 text-lg font-semibold">History</h2>
        <UsageHistoryList items={history.items} />
        <UsagePagination meta={history.meta} />
      </section>
      */}
    </div>
  );
}