'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { Check, ShieldCheck, Sparkles, UserRound, Wallet } from 'lucide-react';

import { cn } from '@/_core/utils/utils';


function PreviewShell({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/30 p-4 text-left">
      <div className="mb-3 flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-gray-500">{label}</span>
        <span className="font-mono text-[10px] uppercase tracking-wider text-gray-600">Sample</span>
      </div>
      {children}
    </div>
  );
}

const iconBox =
  'flex size-10 shrink-0 items-center justify-center rounded-lg border border-emerald-500/25 bg-emerald-500/10 text-emerald-300';

function AccountPreview() {
  return (
    <PreviewShell label="Account">
      <div className="flex items-center gap-3">
        <span className={cn(iconBox, 'rounded-full')}>
          <UserRound className="size-5" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-white">Your account</p>
          <p className="truncate text-xs text-gray-500">you@example.com</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between rounded-lg border border-emerald-500/25 bg-emerald-500/10 px-3 py-2">
        <span className="text-xs font-medium text-emerald-200">Signed in</span>
        <Check className="size-4 text-emerald-300" />
      </div>
    </PreviewShell>
  );
}

function WalletPreview() {
  return (
    <PreviewShell label="Wallet">
      <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/3 p-3">
        <span className={iconBox}>
          <Wallet className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-white">Electron Cash</p>
          <p className="truncate font-mono text-[11px] text-gray-500">bitcoincash:qz8f…k3m2</p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
          <span className="size-1.5 rounded-full bg-emerald-400" />
          Connected
        </span>
      </div>

      <p className="mt-3 flex items-center gap-1.5 text-xs text-gray-500">
        <ShieldCheck className="size-3.5" />
        Non-custodial · keys stay in your wallet
      </p>
    </PreviewShell>
  );
}

function PayPreview() {
  return (
    <PreviewShell label="Request">
      <div className="rounded-lg border border-white/10 bg-white/3 px-3 py-2.5 text-sm text-gray-300">
        What is driving BCH volume this week?
      </div>

      <div className="mt-2.5 flex items-center justify-between rounded-lg border border-emerald-500/25 bg-emerald-500/10 px-3 py-2">
        <span className="font-mono text-xs text-emerald-100">0.00042 BCH</span>
        <span className="rounded-md bg-emerald-500 px-2.5 py-1 text-[11px] font-semibold text-black">Approve</span>
      </div>

      <div className="mt-3 space-y-1.5">
        <p className="mb-2 flex items-center gap-1.5 text-xs text-emerald-300">
          <Sparkles className="size-3.5" />
          Insight ready
        </p>
        <span className="block h-1.5 w-full rounded bg-white/10" />
        <span className="block h-1.5 w-5/6 rounded bg-white/10" />
        <span className="block h-1.5 w-2/3 rounded bg-white/10" />
      </div>
    </PreviewShell>
  );
}

/* ---------- Steps ---------- */

const STEPS = [
  {
    title: 'Sign in',
    text: 'Create your account with a social login in one click. No passwords to remember.',
    preview: <AccountPreview />,
  },
  {
    title: 'Connect your wallet',
    text: 'Link your Bitcoin Cash wallet from your dashboard. Your keys always stay with you.',
    preview: <WalletPreview />,
  },
  {
    title: 'Pay & get your insight',
    text: 'Ask a question, approve a tiny BCH payment, and get your AI insight right away.',
    preview: <PayPreview />,
  },
];

function StepBadge({ n, first, last }: { n: number; first: boolean; last: boolean }) {
  return (
    <div className="relative hidden h-10 items-center justify-center md:flex">
      {!first && <span aria-hidden className="absolute left-0 right-1/2 top-1/2 h-px bg-emerald-500/30" />}
      {!last && <span aria-hidden className="absolute left-1/2 right-0 top-1/2 h-px bg-emerald-500/30" />}
      <span className="relative flex size-10 items-center justify-center rounded-full border border-emerald-500/40 bg-[#04100c] font-mono text-sm font-semibold text-emerald-300 shadow-[0_0_24px_-6px_rgba(16,185,129,0.6)]">
        {n}
      </span>
    </div>
  );
}

export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="how-it-works" className="mx-auto max-w-7xl scroll-mt-28 px-3 pb-24 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-400/80">How it works</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Three steps to your first insight
        </h2>
        <p className="mt-4 text-gray-400">No subscription. No credit card. You only pay for what you use.</p>
      </div>

      <div ref={ref} className="mt-14 grid gap-y-6 md:grid-cols-3">
        {STEPS.map((step, i) => (
          <div key={step.title} className="flex flex-col">
            <StepBadge n={i + 1} first={i === 0} last={i === STEPS.length - 1} />

            <div className="flex-1 md:px-3 md:pt-6">
              <div
                style={{ transitionDelay: `${i * 140}ms` }}
                className={cn(
                  'group h-full rounded-2xl border border-white/10 bg-[#050f0c]/90 p-3 transition-all duration-700 ease-out',
                  'hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-[0_16px_50px_-20px_rgba(16,185,129,0.5)]',
                  'motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none',
                  visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0',
                )}
              >
                {step.preview}

                <div className="px-2 pb-2 pt-5">
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-emerald-400/80 md:hidden">
                    Step {i + 1}
                  </p>
                  <h3 className="mt-1 text-lg font-semibold text-white md:mt-0">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-400">{step.text}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link
          href="/register"
          className="inline-block rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-black shadow-[0_0_28px_rgba(16,185,129,0.35)] transition hover:bg-emerald-400"
        >
          Start your first request
        </Link>
      </div>
    </section>
  );
}