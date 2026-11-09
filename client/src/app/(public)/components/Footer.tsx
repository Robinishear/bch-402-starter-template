'use client';

import { useState, type ComponentProps } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Check, Copy, ExternalLink, Heart, Presentation } from 'lucide-react';

// 👉 আসল লিংক বসাও (EMBER অ্যাড্রেস ব্যানারের সাথে একই রাখো)
const LINKS = {
  github: 'https://github.com/Robinishear/your-repo',
  presentation: 'https://docs.google.com/presentation/d/your-deck-id',
  hackathon: 'https://dorahacks.io/hackathon/bch-blaze-2026',
};
const DONATION_ADDRESS = 'bitcoincash:qqcrvq0f7stvdqr3uu38vmykufluuuwk75h4cdl9e6';

type FooterLink = { label: string; href: string; external?: boolean };

const PRODUCT: FooterLink[] = [
  { label: 'How it works', href: '/#how-it-works' },
  { label: 'Get started', href: '/register' },
  { label: 'Sign in', href: '/login' },
];

const PROJECT: FooterLink[] = [
  { label: 'GitHub repository', href: LINKS.github, external: true },
  { label: 'Presentation', href: LINKS.presentation, external: true },
  { label: 'BCH BLAZE on DoraHacks', href: LINKS.hackathon, external: true },
];

const WALLETS = [
  { name: 'Electron Cash', color: '#34d399' },
  { name: 'Selene Wallet', color: '#22d3ee' },
  { name: 'Bitcoin.com Wallet', color: '#a78bfa' },
];

const headCls = 'font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-400/80';
const linkCls = 'group inline-flex items-center gap-1.5 text-sm text-gray-400 transition-colors hover:text-white';
const iconBtn =
  'flex size-9 items-center justify-center rounded-xl border border-white/10 text-gray-400 transition hover:border-emerald-500/40 hover:bg-emerald-500/10 hover:text-emerald-300 [&>svg]:size-4.5';

const short = (a: string) => `${a.slice(0, 22)}…${a.slice(-8)}`;

function GithubIcon(props: ComponentProps<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  );
}

const SOCIALS = [
  { label: 'GitHub repository', href: LINKS.github, icon: GithubIcon },
  { label: 'Presentation', href: LINKS.presentation, icon: Presentation },
  { label: 'BCH BLAZE on DoraHacks', href: LINKS.hackathon, icon: ExternalLink },
];

function FooterAnchor({ label, href, external }: FooterLink) {
  const Arrow = external ? ArrowUpRight : ArrowRight;
  const content = (
    <>
      {label}
      <Arrow className="size-3 -translate-x-1 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100" strokeWidth={2.4} />
    </>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={linkCls}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={linkCls}>
      {content}
    </Link>
  );
}

function Column({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div>
      <p className={headCls}>{title}</p>
      <ul className="mt-5 space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <FooterAnchor {...link} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const [copied, setCopied] = useState(false);

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(DONATION_ADDRESS);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  return (
    <footer className="relative mt-10 border-t border-white/10">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-emerald-400/60 to-transparent" />

      <div className="mx-auto max-w-7xl px-3 pt-16 sm:px-6">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <Link href="/" aria-label="BCH BLAZE home" className="group inline-flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-xl border border-emerald-400/25 bg-emerald-400/10 text-lg font-black leading-none text-emerald-300 shadow-[0_0_24px_rgba(16,185,129,0.12)] transition-colors group-hover:border-emerald-300/60">
                ₿
              </span>
              <span className="text-lg font-semibold tracking-tight text-white">BCH BLAZE</span>
            </Link>

            <p className="mt-5 max-w-xs text-sm leading-relaxed text-gray-400">
              AI crypto insights, paid per request in Bitcoin Cash. No subscription, no credit card.
            </p>

            <div className="mt-6 flex items-center gap-2.5">
              {SOCIALS.map(({ label, href, icon: Icon }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className={iconBtn}>
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          <Column title="Product" links={PRODUCT} />

          {/* Wallets */}
          <div>
            <p className={headCls}>Supported wallets</p>
            <ul className="mt-5 space-y-3">
              {WALLETS.map(({ name, color }) => (
                <li key={name} className="flex items-center gap-2.5 text-sm text-gray-400">
                  <span className="size-1.5 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }} />
                  {name}
                </li>
              ))}
            </ul>
          </div>

          <Column title="Project" links={PROJECT} />
        </div>

        {/* Community Choice */}
        <div className="relative mt-14 flex flex-col gap-4 rounded-2xl border border-white/10 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div aria-hidden className="absolute inset-x-8 top-0 h-px bg-linear-to-r from-transparent via-emerald-300/40 to-transparent" />

          <div className="flex min-w-0 items-center gap-4">
            <span className="hidden size-10 shrink-0 items-center justify-center rounded-xl border border-emerald-500/30 text-emerald-300 sm:flex">
              <Heart className="size-4.5" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white">Community Choice · EMBER2026</p>
              <p className="mt-1 truncate font-mono text-xs text-gray-500" title={DONATION_ADDRESS}>
                {short(DONATION_ADDRESS)}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={copyAddress}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-xs font-medium text-gray-200 transition hover:border-emerald-500/40 hover:bg-emerald-500/10 hover:text-white"
          >
            {copied ? <Check className="size-4 text-emerald-300" /> : <Copy className="size-4" />}
            {copied ? 'Copied' : 'Copy address'}
          </button>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-gray-500 md:flex-row">
          <div className="space-y-1 text-center md:text-left">
            <p>© {new Date().getFullYear()} BCH BLAZE. Built on Bitcoin Cash.</p>
            <p className="text-gray-600">AI-generated insights are for information only and are not financial advice.</p>
          </div>

          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-emerald-300">
            <span className="size-1.5 animate-pulse rounded-full bg-emerald-400" />
            Built for BCH BLAZE 2026
          </span>
        </div>

        <div aria-hidden className="pointer-events-none select-none overflow-hidden pt-6">
          <p className="bg-linear-to-b from-white/30 to-transparent bg-clip-text text-center text-[22vw] font-bold leading-[0.8] tracking-tighter text-transparent sm:text-[11rem]">
            BCH BLAZE
          </p>
        </div>
      </div>
    </footer>
  );
}