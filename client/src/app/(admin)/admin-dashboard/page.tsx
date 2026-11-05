import { AdminService } from "@/features/admin_dashboard/admin/_core/admin.service";
import { AdminStatsCards } from "@/features/admin_dashboard/admin/components/AdminStatsCards";
import { UserManagementTable } from "@/features/admin_dashboard/admin/components/InvoiceManagementTable";


interface AdminPageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    status?: string;
    role?: string;
    searchTerm?: string;
  }>;
}

export default async function AdminDashboardPage({ searchParams }: AdminPageProps) {
  const resolvedParams = await searchParams;

  const [statsData, usersResponse] = await Promise.all([
    AdminService.getStats(),
    AdminService.getAllUsers(resolvedParams),
  ]);

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
      </div>

      <AdminStatsCards stats={statsData} />

      <div className="space-y-4">
        <h3 className="text-xl font-semibold tracking-tight">User Management</h3>
        <UserManagementTable users={usersResponse.data} />
      </div>
    </div>
  );
}