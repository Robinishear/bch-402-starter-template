'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

const icon = 'h-6 w-6';

const STEPS = [
  {
    n: '01',
    title: 'Sign in',
    text: 'Create your account with a social login in one click. No passwords to remember.',
    icon: (
      <svg className={icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </svg>
    ),
  },
  {
    n: '02',
    title: 'Connect your wallet',
    text: 'Link your Bitcoin Cash wallet from your dashboard. Your keys always stay with you.',
    icon: (
      <svg className={icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 7a2 2 0 0 1 2-2h13v4" />
        <path d="M3 7v11a2 2 0 0 0 2 2h15V9H5a2 2 0 0 1-2-2Z" />
        <circle cx="16" cy="14.5" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    n: '03',
    title: 'Pay & get your insight',
    text: 'Ask a question, approve a tiny BCH payment, and get your AI insight right away.',
    icon: (
      <svg className={icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />
      </svg>
    ),
  },
];

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
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="how-it-works" className="mx-auto max-w-7xl scroll-mt-28 px-3 pb-24 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-400/80">
          How it works
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Three steps to your first insight
        </h2>
        <p className="mt-4 text-gray-400">
          No subscription. No credit card. You only pay for what you use.
        </p>
      </div>

      <div ref={ref} className="relative mt-14 grid gap-6 md:grid-cols-3">
        {/* Connector line (visible between cards) */}
        <div
          aria-hidden
          className="absolute left-[16%] right-[16%] top-13 hidden h-px bg-linear-to-r from-transparent via-emerald-500/50 to-transparent md:block"
        />

        {STEPS.map((s, i) => (
          <div
            key={s.n}
            style={{ transitionDelay: `${i * 140}ms` }}
            className={`group relative z-10 rounded-2xl border border-white/10 bg-[#050f0c]/80 p-6 text-center backdrop-blur-xl transition-all duration-700 ease-out hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-[0_16px_50px_-20px_rgba(16,185,129,0.5)] motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
              visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
            }`}
          >
            <span className="absolute right-4 top-4 font-mono text-xs text-white/20">{s.n}</span>

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 shadow-[0_0_30px_-6px_rgba(16,185,129,0.5)] transition group-hover:bg-emerald-500/20">
              {s.icon}
            </div>

            <h3 className="mt-5 text-lg font-semibold text-white">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-400">{s.text}</p>
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