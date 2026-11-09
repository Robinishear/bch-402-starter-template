"use client";

import { createContext, useContext, useTransition, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { cn } from "@/_core/utils/utils";

type Ctx = { pending: boolean; navigate: (href: string) => void };

const PaginationContext = createContext<Ctx | null>(null);

export const usePaginationNav = () => {
  const ctx = useContext(PaginationContext);
  if (!ctx) throw new Error("usePaginationNav must be used inside <PaginationProvider>");
  return ctx;
};

export function PaginationProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const navigate = (href: string) => startTransition(() => router.push(href, { scroll: false }));

  return (
    <PaginationContext.Provider value={{ pending, navigate }}>
      <div className="space-y-4">
        {/* top progress bar */}
        <div
          className={cn(
            "fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-emerald-400 transition-opacity duration-200",
            pending ? "animate-pulse opacity-100" : "opacity-0",
          )}
        />
        {children}
      </div>
    </PaginationContext.Provider>
  );
}

export function TableLoading({ children }: { children: ReactNode }) {
  const { pending } = usePaginationNav();

  return (
    <div className="relative" aria-busy={pending}>
      <div className={cn("transition-all duration-200", pending && "pointer-events-none opacity-40 blur-[1px]")}>
        {children}
      </div>

      {pending && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-black/70 px-4 py-2 text-sm text-emerald-300 shadow-lg backdrop-blur">
            <Loader2 className="size-4 animate-spin" />
            Loading...
          </div>
        </div>
      )}
    </div>
  );
}