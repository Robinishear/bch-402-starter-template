import { BackgroundFX } from "@/app/(public)/components/BackgroundFX";
import AdminSidebarContent from "./components/AdminSidebarContent";
import AdminMobileNav from "./components/AdminMobileNav";



export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-[#05080a] text-gray-100 selection:bg-emerald-400/30">
    <BackgroundFX />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-size-[48px_48px] mask-[radial-gradient(ellipse_80%_60%_at_50%_0%,black,transparent)]"
      />

      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 border-r border-white/10 bg-[#04100c]/90 lg:block">
        <AdminSidebarContent />
      </aside>

      <div className="relative z-10 flex min-h-screen flex-col lg:pl-64">
        <AdminMobileNav>
          <AdminSidebarContent />
        </AdminMobileNav>

        <main className="mx-auto w-full max-w-7xl flex-1">{children}</main>
      </div>
    </div>
  );
}