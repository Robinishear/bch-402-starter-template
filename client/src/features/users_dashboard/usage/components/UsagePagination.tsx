import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PaginationMeta } from "../_core/usage_interface.ts";

function PageButton({ page, disabled, children }: { page: number; disabled: boolean; children: ReactNode }) {
  if (disabled) {
    return (
      <Button variant="outline" size="sm" disabled>
        {children}
      </Button>
    );
  }

  return (
    <Button asChild variant="outline" size="sm">
      <Link href={`?page=${page}`}>{children}</Link>
    </Button>
  );
}

export default function UsagePagination({ meta }: { meta: PaginationMeta }) {
  const { page, totalPages, total } = meta;
  if (totalPages <= 1) return null;

  return (
    <nav className="mt-6 flex items-center justify-between" aria-label="Pagination">
      <p className="text-sm text-gray-400">
        Page {page} of {totalPages} · {total} total
      </p>

      <div className="flex gap-2">
        <PageButton page={page - 1} disabled={page <= 1}>
          <ChevronLeft /> Previous
        </PageButton>
        <PageButton page={page + 1} disabled={page >= totalPages}>
          Next <ChevronRight />
        </PageButton>
      </div>
    </nav>
  );
}