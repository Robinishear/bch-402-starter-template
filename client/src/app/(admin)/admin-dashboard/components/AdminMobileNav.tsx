"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import AdminBrand from "./AdminBrand";

export default function AdminMobileNav({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-white/10 bg-[#04100c]/95 px-4 lg:hidden">
      <AdminBrand />

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          aria-label="Open menu"
          className="flex size-9 items-center justify-center rounded-lg text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
        >
          <Menu className="size-5" />
        </SheetTrigger>

        <SheetContent side="left" className="w-64 border-white/10 bg-[#04100c] p-0 text-gray-100">
          <SheetTitle className="sr-only">Admin menu</SheetTitle>
          <SheetDescription className="sr-only">Navigate the admin console</SheetDescription>
          {children}
        </SheetContent>
      </Sheet>
    </header>
  );
}