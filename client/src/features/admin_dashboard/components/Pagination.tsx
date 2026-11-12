"use client";

import { Check, ChevronDown, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

import { cn } from "@/_core/utils/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePaginationNav } from "@/components/shared/pagination-provider";

interface Meta {
  page: number;
  limit?: number;
  totalPages: number;
  total: number;
}

interface Props {
  meta: Meta;
  searchParams: object;
  label?: string;
}

const hrefFor = (searchParams: object, page: number) => {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams as Record<string, unknown>)) {
    if (key === "page" || value === undefined || value === "") continue;
    query.set(key, String(Array.isArray(value) ? value[0] : value));
  }
  query.set("page", String(page));
  return `?${query.toString()}`;
};

const btn =
  "h-9 gap-1.5 rounded-lg border-white/10 bg-white/5 px-3 text-sm text-gray-200 shadow-none transition-colors " +
  "hover:border-emerald-500/40 hover:bg-emerald-500/10 hover:text-white disabled:opacity-40";

const num = (value: number) => <span className="font-mono text-gray-200">{value.toLocaleString("en-US")}</span>;

export default function Pagination({ meta, searchParams, label = "users" }: Props) {
  const { pending, navigate } = usePaginationNav();
  const { page, limit, totalPages, total } = meta;
  if (totalPages <= 1) return null;

  const from = limit ? (page - 1) * limit + 1 : null;
  const to = limit ? Math.min(page * limit, total) : null;

  const go = (target: number) => {
    if (pending || target === page || target < 1 || target > totalPages) return;
    navigate(hrefFor(searchParams, target));
  };

  return (
    <nav
      className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/3 px-4 py-3"
      aria-label="Pagination"
    >
      <p className="text-sm text-gray-400">
        {from !== null && to !== null ? (
          <>
            Showing {num(from)}–{num(to)} of {num(total)} {label}
          </>
        ) : (
          <>
            {num(total)} {label}
          </>
        )}
      </p>

      <div className="flex items-center gap-2">
        <Button variant="outline" disabled={pending || page <= 1} onClick={() => go(page - 1)} className={btn}>
          <ChevronLeft className="size-4" /> Previous
        </Button>

<DropdownMenu>
  <DropdownMenuTrigger
    disabled={pending}
    render={<Button variant="outline" className={cn(btn, "min-w-32 justify-between")} />}
  >
    {pending ? (
      <Loader2 className="size-4 animate-spin text-emerald-300" />
    ) : (
      <span>
        Page <span className="font-mono text-emerald-300">{page}</span>
        <span className="text-gray-500"> / {totalPages}</span>
      </span>
    )}
    <ChevronDown className="size-4 text-gray-400" />
  </DropdownMenuTrigger>

  <DropdownMenuContent
    align="center"
    className="max-h-64 w-44 overflow-y-auto rounded-xl border-white/10 bg-[#0b0f0e] p-1.5 text-gray-200 shadow-xl"
  >
    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
      const current = p === page;
      return (
        <DropdownMenuItem
          key={p}
          onClick={() => go(p)}
          ref={(el) => {
            if (current && el) el.scrollIntoView({ block: "center" });
          }}
          className={cn(
            "cursor-pointer justify-between rounded-lg px-3 py-2 text-sm focus:bg-emerald-500/10 focus:text-white",
            current && "bg-emerald-500/15 font-medium text-emerald-300",
          )}
        >
          Page {p}
          {current && <Check className="size-4" />}
        </DropdownMenuItem>
      );
    })}
  </DropdownMenuContent>
</DropdownMenu>

        <Button variant="outline" disabled={pending || page >= totalPages} onClick={() => go(page + 1)} className={btn}>
          Next <ChevronRight className="size-4" />
        </Button>
      </div>
    </nav>
  );
}