'use client';

import { useState } from 'react';
import Link from 'next/link';

const LINKS = {
  github: 'https://github.com/your-username/your-repo',
  presentation: 'https://docs.google.com/presentation/d/your-deck-id',
  hackathon: 'https://dorahacks.io/hackathon/bch-blaze-2026',
};
const DONATION_ADDRESS = 'bitcoincash:zq...your-cashtokens-address';

const WALLETS = [
  { name: 'Electron Cash', color: 'bg-emerald-400' },
  { name: 'Selene Wallet', color: 'bg-teal-400' },
  { name: 'Bitcoin.com Wallet', color: 'bg-green-400' },
];

const headCls = 'font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-400/80';
const linkCls =
  'group inline-flex items-center gap-1.5 text-sm text-gray-400 transition hover:text-white';

function Arrow() {
  return (
    <svg
      className="-translate-x-1 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100"
      width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

const iconBtn =
  'flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/4 text-gray-400 backdrop-blur transition hover:border-emerald-500/40 hover:bg-emerald-500/10 hover:text-emerald-300';

export function Footer() {
  const [copied, setCopied] = useState(false);

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(DONATION_ADDRESS);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked */
    }
  }

  return (
    <footer className="relative mt-10 overflow-hidden border-t border-white/10 bg-white/3 backdrop-blur-xl">
      {/* top glow line */}
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-emerald-400/60 to-transparent" />
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 h-40 w-2xl -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-3 pt-16 sm:px-6">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-lg font-extrabold text-black shadow-[0_0_28px_rgba(16,185,129,0.45)]">
                B
              </span>
              <span className="text-lg font-semibold tracking-tight text-white">Pay-per-use AI</span>
            </div>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-gray-400">
              AI crypto insights, paid per request in Bitcoin Cash. No subscription, no credit card.
            </p>

            <div className="mt-6 flex items-center gap-2.5">
              <a href={LINKS.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub repository" className={iconBtn}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
                </svg>
              </a>
              <a href={LINKS.presentation} target="_blank" rel="noopener noreferrer" aria-label="Presentation" className={iconBtn}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="12" rx="2" />
                  <path d="M12 16v4M8 20h8" />
                </svg>
              </a>
              <a href={LINKS.hackathon} target="_blank" rel="noopener noreferrer" aria-label="BCH BLAZE on DoraHacks" className={iconBtn}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 4h6v6M20 4l-9 9" />
                  <path d="M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4" />
                </svg>
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <p className={headCls}>Product</p>
            <ul className="mt-5 space-y-3">
              <li><a href="#how-it-works" className={linkCls}>How it works<Arrow /></a></li>
              <li><Link href="/register" className={linkCls}>Get started<Arrow /></Link></li>
              <li><Link href="/login" className={linkCls}>Sign in<Arrow /></Link></li>
            </ul>
          </div>

          {/* Wallets */}
          <div>
            <p className={headCls}>Supported wallets</p>
            <ul className="mt-5 space-y-3">
              {WALLETS.map((w) => (
                <li key={w.name} className="flex items-center gap-2.5 text-sm text-gray-400">
                  <span className={`h-1.5 w-1.5 rounded-full ${w.color} shadow-[0_0_8px_currentColor]`} />
                  {w.name}
                </li>
              ))}
            </ul>
          </div>

          {/* Project */}
          <div>
            <p className={headCls}>Project</p>
            <ul className="mt-5 space-y-3">
              <li><a href={LINKS.github} target="_blank" rel="noopener noreferrer" className={linkCls}>GitHub repository<Arrow /></a></li>
              <li><a href={LINKS.presentation} target="_blank" rel="noopener noreferrer" className={linkCls}>Presentation<Arrow /></a></li>
              <li><a href={LINKS.hackathon} target="_blank" rel="noopener noreferrer" className={linkCls}>BCH BLAZE on DoraHacks<Arrow /></a></li>
            </ul>
          </div>
        </div>

        {/* Community choice */}
        <div className="mt-14 flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/3 p-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="flex min-w-0 items-center gap-4">
            <span className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-500/25 bg-emerald-500/10 text-emerald-300 sm:flex">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 21s-7-4.35-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.65-9.5 9-9.5 9Z" />
              </svg>
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white">Community Choice · EMBER2026</p>
              <p className="mt-1 truncate font-mono text-xs text-gray-500">{DONATION_ADDRESS}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={copyAddress}
            className="shrink-0 rounded-xl border border-white/12 bg-white/4 px-4 py-2.5 text-xs font-medium text-gray-200 transition hover:border-emerald-500/40 hover:bg-emerald-500/10 hover:text-white"
          >
            {copied ? 'Copied ✓' : 'Copy address'}
          </button>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-gray-500 sm:flex-row">
          <p>© 2026 Pay-per-use AI. Built on Bitcoin Cash.</p>
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/8 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-emerald-300">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            Built for BCH BLAZE 2026
          </span>
        </div>

        <div aria-hidden className="pointer-events-none select-none overflow-hidden pt-6">
          <p className="bg-linear-to-b from-white/32 to-transparent bg-clip-text text-center text-[22vw] font-bold leading-[0.8] tracking-tighter text-transparent sm:text-[11rem]">
            BCH BLAZE
          </p>
        </div>
      </div>
    </footer>
  );
}