import Link from "next/link";

import { PaginationProvider, TableLoading } from "@/components/ui/shared/pagination-provider";
import { getUsageHistory } from "@/features/users_dashboard/usage/_core/usage.service";
import UsageHistoryList from "@/features/users_dashboard/usage/components/UsageHistoryList";
import UsagePagination from "@/features/users_dashboard/usage/components/UsagePagination";

type Props = { searchParams: Promise<{ page?: string }> };

function LoadError() {
  return (
    <div className="p-6">
      <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-6 text-sm text-red-200">
        Could not load your history. Please{" "}
        <Link href="/login" className="font-medium underline underline-offset-4">
          login again
        </Link>
        .
      </div>
    </div>
  );
}

export default async function HistoryPage({ searchParams }: Props) {
  const { page } = await searchParams;
  const currentPage = Math.max(Number(page) || 1, 1);

  const history = await getUsageHistory(currentPage).catch(() => null);
  if (!history) return <LoadError />;

  return (
    <div className="space-y-8 p-6">
      <header className="border-b border-white/10 pb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          AI Usage{" "}
          <span className="bg-linear-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">History</span>
        </h1>
        <p className="mt-1.5 max-w-2xl text-sm text-gray-400">Every AI request you made and what it cost.</p>
      </header>

      <section>
        <PaginationProvider>
          <TableLoading>
            <UsageHistoryList items={history.items} />
          </TableLoading>
          <UsagePagination meta={history.meta} />
        </PaginationProvider>
      </section>
    </div>
  );
}