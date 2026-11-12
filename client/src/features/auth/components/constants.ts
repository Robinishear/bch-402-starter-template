import { ReactNode } from "react";

export const authBtn = {
  ghost:
    'rounded-lg px-3.5 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-white/5 hover:text-white',
  primary:
    'rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-black shadow-[0_0_24px_rgba(16,185,129,0.35)] transition hover:bg-emerald-400',
};


export type AuthCardProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  footerText: string;
  footerLabel: string;
  footerHref: string;
  children: ReactNode;
};


export const RESEND_SECONDS = 60;
export type Step = "email" | "reset";

