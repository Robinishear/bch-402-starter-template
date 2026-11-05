import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/_core/utils/utils";
import { buttonVariants } from "@/components/ui/button";
import { PaginationMeta } from "../_core/usage_interface.ts";

const pageBtn = cn(
  buttonVariants({ variant: "outline", size: "sm" }),
  "gap-1 border-white/10 bg-white/5 text-gray-200 hover:border-emerald-500/40 hover:bg-emerald-500/10 hover:text-white",
);

function PageButton({ page, disabled, children }: { page: number; disabled: boolean; children: ReactNode }) {
  if (disabled) {
    return (
      <span aria-disabled className={cn(pageBtn, "pointer-events-none opacity-40")}>
        {children}
      </span>
    );
  }

  return (
    <Link href={`?page=${page}`} className={pageBtn}>
      {children}
    </Link>
  );
}

export default function UsagePagination({ meta }: { meta: PaginationMeta }) {
  const { page, limit, total, totalPages } = meta;
  if (totalPages <= 1) return null;

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <nav className="mt-6 flex flex-wrap items-center justify-between gap-3" aria-label="Pagination">
      <p className="text-sm text-gray-400">
        Showing <span className="font-mono text-gray-200">{from}–{to}</span> of{" "}
        <span className="font-mono text-gray-200">{total}</span>
      </p>

      <div className="flex items-center gap-2">
        <PageButton page={page - 1} disabled={page <= 1}>
          <ChevronLeft /> Previous
        </PageButton>
        <span className="px-2 font-mono text-xs text-gray-500">
          {page} / {totalPages}
        </span>
        <PageButton page={page + 1} disabled={page >= totalPages}>
          Next <ChevronRight />
        </PageButton>
      </div>
    </nav>
  );
}