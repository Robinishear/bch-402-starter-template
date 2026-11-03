'use client';

import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

const EVENT = { name: 'BCH BLAZE 2026', track: 'Mainnet Track' };
const PRESENTATION_URL = 'https://docs.google.com/presentation/d/...';
const REPO_URL = 'https://github.com/Robinishear/your-repo';
const EMBER_ADDRESS = 'bitcoincash:qqcrvq0f7stvdqr3uu38vmykufluuuwk75h4cdl9e6';

const CHECKS = ['Live on BCH Mainnet', 'WizardConnect', 'Open source'];

type PreviousWork = { repoUrl: string; demoUrl: string };
const PREVIOUS = null as PreviousWork | null;


const short = (a: string) => `${a.slice(0, 18)}…${a.slice(-8)}`;

function Check() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m5 12 5 5L20 7" />
    </svg>
  );
}

function Arrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
      className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

export function BlazeBanner() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMBER_ADDRESS);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  return (
    <section className="mx-auto mt-5 max-w-7xl px-3 sm:px-6" aria-label={`${EVENT.name} submission`}>
      {/* Animated gradient border */}
      <div className="bb-reveal relative overflow-hidden rounded-3xl bg-white/8 p-px">
        <div className="bb-spin" aria-hidden />

        <div className="relative grid overflow-hidden rounded-[23px] bg-[#04100c]/80 backdrop-blur-xl lg:grid-cols-[1.45fr_1fr]">
          {/* Ambient glow */}
          <div aria-hidden className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-emerald-500/20 blur-[90px]" />
          <div aria-hidden className="pointer-events-none absolute -bottom-28 right-1/3 h-64 w-64 rounded-full bg-cyan-500/10 blur-[90px]" />

          {/* ───── LEFT: main message ───── */}
          <div className="relative p-6 sm:p-8">
            <div className="bb-in flex flex-wrap items-center gap-2" style={{ animationDelay: '80ms' }}>
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-300">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </span>
                Official submission
              </span>
              <span className="text-xs text-gray-400">
                {EVENT.name} · {EVENT.track}
              </span>
            </div>

            <h2 className="bb-in mt-4 text-2xl font-semibold tracking-tight text-white sm:text-3xl" style={{ animationDelay: '160ms' }}>
              Everything the judges need,
              <span className="bg-linear-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent"> in one place.</span>
            </h2>

            <p className="bb-in mt-2 max-w-xl text-sm text-gray-400" style={{ animationDelay: '220ms' }}>
              A quick overview, the full source code, and a way to back this project in the Community Choice vote.
            </p>

            {/* Eligibility checks */}
            <ul className="bb-in mt-5 flex flex-wrap gap-2" style={{ animationDelay: '280ms' }}>
              {CHECKS.map((c) => (
                <li
                  key={c}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/4 px-2.5 py-1.5 text-xs font-medium text-gray-200"
                >
                  <span className="text-emerald-400"><Check /></span>
                  {c}
                </li>
              ))}
            </ul>

            {/* CTAs */}
            <div className="bb-in mt-6 flex flex-wrap items-center gap-3" style={{ animationDelay: '340ms' }}>
              <a
                href={PRESENTATION_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-black shadow-[0_0_30px_rgba(16,185,129,0.35)] transition hover:bg-emerald-400"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="12" rx="2" />
                  <path d="M8 20h8M12 16v4" />
                </svg>
                View presentation
                <Arrow />
              </a>

              <a
                href={REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:border-emerald-500/40 hover:bg-emerald-500/10"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
                </svg>
                Source code
                <Arrow />
              </a>
            </div>

            {/* Pre-existing work disclosure (optional) */}
            {PREVIOUS && (
              <p className="bb-in mt-4 text-xs text-gray-500" style={{ animationDelay: '400ms' }}>
                Pre-existing work:{' '}
                <a href={PREVIOUS.repoUrl} target="_blank" rel="noopener noreferrer" className="text-gray-300 underline decoration-white/20 underline-offset-4 hover:text-emerald-300">
                  original repo
                </a>
                {' · '}
                <a href={PREVIOUS.demoUrl} target="_blank" rel="noopener noreferrer" className="text-gray-300 underline decoration-white/20 underline-offset-4 hover:text-emerald-300">
                  demo before the hackathon
                </a>
              </p>
            )}
          </div>

          {/* ───── RIGHT: Community Choice ───── */}
          <div className="bb-in relative border-t border-white/10 bg-emerald-500/4 p-6 sm:p-8 lg:border-l lg:border-t-0" style={{ animationDelay: '260ms' }}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-400/80">
              Community Choice
            </p>
            <h3 className="mt-1 text-lg font-semibold text-white">Back this project with EMBER2026</h3>

            <div className="mt-4 flex items-center gap-4">
              <div className="shrink-0 rounded-2xl bg-white p-2.5 shadow-[0_0_40px_-8px_rgba(16,185,129,0.6)] transition duration-300 hover:scale-[1.03]">
                <QRCodeSVG value={EMBER_ADDRESS} size={104} />
              </div>
              <p className="text-xs leading-relaxed text-gray-400">
                Scan with a CashTokens-compatible wallet, or copy the address and send your EMBER2026 tokens.
              </p>
            </div>

            <button
              type="button"
              onClick={copy}
              title={EMBER_ADDRESS}
              className="group mt-4 flex w-full items-center justify-between gap-3 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-3.5 py-2.5 text-left transition hover:bg-emerald-500/20"
            >
              <span className="truncate font-mono text-[11px] text-emerald-100/80" aria-live="polite">
                {copied ? 'Address copied ✓' : short(EMBER_ADDRESS)}
              </span>
              <span className="shrink-0 text-[11px] font-semibold text-emerald-300">
                {copied ? '' : 'Copy'}
              </span>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .bb-reveal { opacity: 0; animation: bb-up .8s cubic-bezier(.22,1,.36,1) .05s forwards; }
        .bb-in { opacity: 0; animation: bb-up .7s cubic-bezier(.22,1,.36,1) forwards; }
        @keyframes bb-up {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Rotating light along the border */
        .bb-spin {
          position: absolute; left: 50%; top: 50%;
          width: 220%; aspect-ratio: 1 / 1;
          background: conic-gradient(from 0deg,
            transparent 0 68%, rgba(52,211,153,.95) 84%, rgba(34,211,238,.6) 92%, transparent 100%);
          animation: bb-rotate 9s linear infinite;
        }
        @keyframes bb-rotate {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to   { transform: translate(-50%, -50%) rotate(360deg); }
        }

        @media (prefers-reduced-motion: reduce) {
          .bb-reveal, .bb-in { animation: none; opacity: 1; }
          .bb-spin { animation: none; }
        }
      `}</style>
    </section>
  );
}