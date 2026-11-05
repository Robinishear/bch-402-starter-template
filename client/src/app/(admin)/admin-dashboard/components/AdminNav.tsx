"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, LayoutDashboard, Users, type LucideIcon } from "lucide-react";

import { cn } from "@/_core/utils/utils";

type NavItem = { href: string; label: string; icon: LucideIcon; exact?: boolean };

// Overview holds everything; add or remove the other pages here
const NAV: NavItem[] = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/invoices", label: "Invoices", icon: FileText },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex-1 space-y-1 p-3" aria-label="Admin">
      <p className="px-3 pb-2 pt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-gray-500">Management</p>

      {NAV.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);

        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active ? "bg-emerald-500/10 text-emerald-300" : "text-gray-400 hover:bg-white/5 hover:text-white",
            )}
          >
            {active && <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-emerald-400" />}
            <Icon className="size-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}