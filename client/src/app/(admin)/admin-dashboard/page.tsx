import { AdminPageProps } from "@/features/admin_dashboard/admin/_core/admin.interface";
import { AdminService } from "@/features/admin_dashboard/admin/_core/admin.service";
import { AdminStatsCards } from "@/features/admin_dashboard/admin/components/AdminStatsCards";
import { AnalyticsChart } from "@/features/admin_dashboard/admin/components/AnalyticsChart";
import Pagination from "@/features/admin_dashboard/components/Pagination";
import SearchFilter from "@/features/admin_dashboard/components/SearchFilter";
import { UserManagementTable } from "@/features/admin_dashboard/admin/components/UserManagementTable";
import { PaginationProvider, TableLoading } from "@/components/shared/pagination-provider";

const RANGE_OPTIONS = [7, 30, 90];

function LoadError() {
  return (
    <div className="p-6">
      <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-6 text-sm text-red-200">
        Could not load the admin dashboard. Please refresh or login again.
      </div>
    </div>
  );
}

export default async function AdminDashboardPage({ searchParams }: AdminPageProps) {
  const params = await searchParams;

  const daysParam = Number(Array.isArray(params.days) ? params.days[0] : params.days);
  const days = RANGE_OPTIONS.includes(daysParam) ? daysParam : 30;
  const searchTerm = Array.isArray(params.searchTerm) ? params.searchTerm[0] : params.searchTerm;

  const data = await Promise.all([AdminService.getAnalytics(days), AdminService.getAllUsers(params)]).catch(() => null);
  if (!data) return <LoadError />;

  const [analytics, usersResponse] = data;

  return (
    <div className="space-y-8 p-6">
      <header className="border-b border-white/10 pb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          User{" "}
          <span className="bg-linear-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">Management</span>
        </h1>
        <p className="mt-1.5 max-w-2xl text-sm text-gray-400">Platform overview and user management.</p>
      </header>

      <AdminStatsCards stats={analytics.totals} />
      <AnalyticsChart analytics={analytics} />

      <section className="space-y-4">
        <SearchFilter
          action="/admin-dashboard"
          placeholder="Search by name or email"
          searchTerm={searchTerm}
          keep={{ days: String(days) }}
        />

        <PaginationProvider>
          <TableLoading>
            <UserManagementTable users={usersResponse.data} />
          </TableLoading>
          <Pagination meta={usersResponse.meta} searchParams={params} />
        </PaginationProvider>
      </section>
    </div>
  );
}