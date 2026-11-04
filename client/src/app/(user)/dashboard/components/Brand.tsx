import Link from "next/link";

const BRAND = "BCH BLAZE";

export default function Brand({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} aria-label={`${BRAND} home`} className="group flex items-center gap-2.5">
      <span className="flex size-9 items-center justify-center rounded-xl border border-emerald-400/25 bg-emerald-400/10 text-lg font-black leading-none text-emerald-300 shadow-[0_0_24px_rgba(16,185,129,0.12)] transition-colors group-hover:border-emerald-300/60">
        ₿
      </span>
      <span className="text-lg font-semibold tracking-tight text-white">{BRAND}</span>
    </Link>
  );
}