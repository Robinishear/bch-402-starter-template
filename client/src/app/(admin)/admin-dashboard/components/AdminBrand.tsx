import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function AdminBrand() {
  return (
    <Link href="/admin" aria-label="Admin console" className="group flex items-center gap-2.5">
      <span className="flex size-9 items-center justify-center rounded-xl border border-emerald-400/25 bg-emerald-400/10 text-emerald-300 shadow-[0_0_24px_rgba(16,185,129,0.12)] transition-colors group-hover:border-emerald-300/60">
        <ShieldCheck className="size-4.5" />
      </span>
      <span className="leading-tight">
        <span className="block text-sm font-semibold tracking-tight text-white">BCH BLAZE</span>
        <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-400/80">
          Admin console
        </span>
      </span>
    </Link>
  );
}