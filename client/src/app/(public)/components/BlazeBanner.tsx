'use client';

import { useState, type ComponentProps } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { ArrowUpRight, Check, Copy, Presentation } from 'lucide-react';

import { cn } from '@/_core/utils/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const EVENT = { name: 'BCH BLAZE 2026', track: 'Mainnet Track' };
const PRESENTATION_URL = 'https://docs.google.com/presentation/d/...';
const REPO_URL = 'https://github.com/Robinishear/your-repo';
const EMBER_ADDRESS = 'bitcoincash:qqcrvq0f7stvdqr3uu38vmykufluuuwk75h4cdl9e6';

const CHECKS = ['Live on BCH Mainnet', 'WizardConnect', 'Open source'];

type PreviousWork = { repoUrl: string; demoUrl: string };
const PREVIOUS = null as PreviousWork | null;

const CORNERS = [
  'left-0 top-0 rounded-tl-lg border-l-2 border-t-2',
  'right-0 top-0 rounded-tr-lg border-r-2 border-t-2',
  'bottom-0 left-0 rounded-bl-lg border-b-2 border-l-2',
  'bottom-0 right-0 rounded-br-lg border-b-2 border-r-2',
];

const short = (a: string) => `${a.slice(0, 18)}…${a.slice(-8)}`;
const delay = (ms: number) => ({ animationDelay: `${ms}ms` });

const cta = 'group inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm transition [&>svg:first-child]:size-4';
const prevLink = 'text-gray-300 underline decoration-white/20 underline-offset-4 hover:text-emerald-300';

function GithubIcon(props: ComponentProps<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  );
}

function ArrowIcon() {
  return <ArrowUpRight className="size-4 opacity-80 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />;
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
      <div className="bb-reveal relative overflow-hidden rounded-3xl bg-white/8 p-px ">
        <div className="bb-spin" aria-hidden />

        <div className="relative grid overflow-hidden rounded-[23px]  lg:grid-cols-[1.45fr_1fr]">
          {/* Ambient light */}
          <div aria-hidden className="pointer-events-none absolute -left-24 -top-24 size-96 bg-[radial-gradient(circle,rgba(16,185,129,0.2),transparent_70%)]" />
          <div aria-hidden className="pointer-events-none absolute -bottom-32 right-1/3 size-80 bg-[radial-gradient(circle,rgba(6,182,212,0.1),transparent_70%)]" />
          <div aria-hidden className="absolute inset-x-10 top-0 h-px bg-linear-to-r from-transparent via-emerald-300/50 to-transparent" />

          {/* Left: main message */}
          <div className="relative p-6 sm:p-8">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[32px_32px] mask-[radial-gradient(ellipse_at_top_left,black,transparent_70%)]"
            />

            <div className="relative">
              <div className="bb-in flex flex-wrap items-center gap-2" style={delay(80)}>
                <Badge
                  variant="outline"
                  className="gap-2 rounded-full border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-300"
                >
                  <span className="relative flex size-1.5">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400/70" />
                    <span className="relative inline-flex size-1.5 rounded-full bg-emerald-400" />
                  </span>
                  Official submission
                </Badge>
                <span className="text-xs text-gray-400">
                  {EVENT.name} · {EVENT.track}
                </span>
              </div>

              <h2 className="bb-in mt-4 text-2xl font-semibold tracking-tight text-white sm:text-3xl" style={delay(160)}>
                Everything the judges need,
                <span className="bg-linear-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent"> in one place.</span>
              </h2>

              <p className="bb-in mt-2 max-w-xl text-sm text-gray-400" style={delay(220)}>
                A quick overview, the full source code, and a way to back this project in the Community Choice vote.
              </p>

              <ul className="bb-in mt-5 flex flex-wrap gap-2" style={delay(280)}>
                {CHECKS.map((check) => (
                  <li key={check}>
                    <Badge
                      variant="outline"
                      className="gap-2 rounded-lg border-white/10 bg-white/4 py-1.5 pl-1.5 pr-2.5 text-xs text-gray-200"
                    >
                      <span className="flex size-4 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
                        <Check className="size-3" strokeWidth={3} />
                      </span>
                      {check}
                    </Badge>
                  </li>
                ))}
              </ul>

              <div className="bb-in mt-6 flex flex-wrap items-center gap-3" style={delay(340)}>
                <a
                  href={PRESENTATION_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(cta, 'bg-emerald-500 font-semibold text-black shadow-[0_0_30px_rgba(16,185,129,0.35)] hover:bg-emerald-400')}
                >
                  <Presentation />
                  View presentation
                  <ArrowIcon />
                </a>

                <a
                  href={REPO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(cta, 'border border-white/15 bg-white/5 font-medium text-white hover:border-emerald-500/40 hover:bg-emerald-500/10')}
                >
                  <GithubIcon />
                  Source code
                  <ArrowIcon />
                </a>
              </div>

              {PREVIOUS && (
                <p className="bb-in mt-4 text-xs text-gray-500" style={delay(400)}>
                  Pre-existing work:{' '}
                  <a href={PREVIOUS.repoUrl} target="_blank" rel="noopener noreferrer" className={prevLink}>
                    original repo
                  </a>
                  {' · '}
                  <a href={PREVIOUS.demoUrl} target="_blank" rel="noopener noreferrer" className={prevLink}>
                    demo before the hackathon
                  </a>
                </p>
              )}
            </div>
          </div>

          {/* Right: Community Choice */}
          <div
            className="bb-in relative border-t border-white/10 bg-emerald-500/4 p-6 sm:p-8 lg:border-l lg:border-t-0"
            style={delay(260)}
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-400/80">Community Choice</p>
            <h3 className="mt-1 text-lg font-semibold text-white">Back this project with EMBER2026</h3>

            <div className="mt-5 flex items-center gap-5">
              {/* Scanner frame */}
              <div className="relative shrink-0 p-3">
                {CORNERS.map((corner) => (
                  <span key={corner} aria-hidden className={cn('absolute size-5 border-emerald-400', corner)} />
                ))}

                <div className="relative overflow-hidden rounded-xl bg-white p-2.5 shadow-[0_0_40px_-8px_rgba(16,185,129,0.6)]">
                  <QRCodeSVG value={EMBER_ADDRESS} size={104} />
                  <span
                    aria-hidden
                    className="bb-scan absolute inset-x-0 h-0.5 bg-linear-to-r from-transparent via-emerald-500 to-transparent shadow-[0_0_12px_rgba(16,185,129,0.9)]"
                  />
                </div>
              </div>

              <p className="text-xs leading-relaxed text-gray-400">
                Scan with a CashTokens-compatible wallet, or copy the address and send your EMBER2026 tokens.
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={copy}
              title={EMBER_ADDRESS}
              className="mt-5 h-auto w-full justify-between gap-3 rounded-xl border-emerald-500/25 bg-emerald-500/10 px-3.5 py-2.5 font-normal shadow-none hover:border-emerald-500/40 hover:bg-emerald-500/20"
            >
              <span className="truncate font-mono text-[11px] text-emerald-100/80" aria-live="polite">
                {copied ? 'Address copied' : short(EMBER_ADDRESS)}
              </span>
              <span className="flex shrink-0 items-center gap-1.5 text-[11px] font-semibold text-emerald-300">
                {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                {copied ? '' : 'Copy'}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}