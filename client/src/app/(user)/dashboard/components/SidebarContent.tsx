

import Link from "next/link";
import { Home } from "lucide-react";

import LogoutButton from "@/features/auth/components/LogoutButton";
import Brand from "./Brand";
import DashboardNav from "./DashboardNav";

export default function SidebarContent() {
  return (
    <div className="flex h-full flex-col">
     <div className="flex h-16 shrink-0 items-center border-b border-white/10 px-5">
  <Brand />
</div>

      <DashboardNav />

      <div className="space-y-1 border-t border-white/10 p-3">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
        >
          <Home className="size-4" />
          Back to home
        </Link>

        <div className="[&_button]:w-full [&_button]:justify-start [&_form]:w-full">
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}