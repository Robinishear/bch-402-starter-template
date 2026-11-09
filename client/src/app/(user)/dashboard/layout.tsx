import { BackgroundFX } from "@/app/(public)/components/BackgroundFX";
import SidebarContent from "./components/SidebarContent";
import MobileNav from "./components/MobileNav";
import { WalletProvider } from "@/features/users_dashboard/wizard/components/WalletProvider";


export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-[#03070a] text-gray-100 selection:bg-emerald-400/30">
      <BackgroundFX />

      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 border-r border-white/10 bg-[#04100c]/90 lg:block">
        <SidebarContent />
      </aside>

      <div className="relative z-10 flex min-h-screen flex-col lg:pl-64">
        <MobileNav>
          <SidebarContent />
        </MobileNav>
        
        <WalletProvider>
          <main className="mx-auto w-full max-w-6xl flex-1">{children}</main>
        </WalletProvider>

      </div>
    </div>
  );
}