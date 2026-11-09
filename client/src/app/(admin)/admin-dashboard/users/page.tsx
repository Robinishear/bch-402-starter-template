// import { AdminPageProps } from "@/features/admin_dashboard/admin/_core/admin.interface";
// import { AdminService } from "@/features/admin_dashboard/admin/_core/admin.service";
// import { UserManagementTable } from "@/features/admin_dashboard/admin/components/UserManagementTable";

// function LoadError() {
//   return (
//     <div className="p-6">
//       <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-6 text-sm text-red-200">
//         Could not load the admin dashboard. Please refresh or login again.
//       </div>
//     </div>
//   );
// }

// export default async function usersPage({ searchParams }: AdminPageProps) {
//   const params = await searchParams;

//   const usersResponse = await AdminService.getAllUsers(params).catch(() => null);
//   if (!usersResponse) return <LoadError />;

//   return (
//     <div className="space-y-8 p-6">
//       <header className="border-b border-white/10 pb-6">
//         <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
//           Admin{" "}
//           <span className="bg-linear-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">Dashboard</span>
//         </h1>
//         <p className="mt-1.5 max-w-2xl text-sm text-gray-400">Manage platform users.</p>
//       </header>

//       <section className="space-y-4">
//         <h2 className="text-lg font-semibold text-white">User management</h2>
//         <UserManagementTable users={usersResponse.data} />
//       </section>
//     </div>
//   );
// }