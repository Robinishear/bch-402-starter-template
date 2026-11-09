import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';

import { cn } from '@/_core/utils/utils';
import { Badge } from '@/components/ui/badge';

const SAMPLE = {
  prompt: 'What is driving BCH trading activity this week?',
  points: [
    { k: 'Momentum', v: 'Trading volume is running above its recent average.', dot: 'bg-emerald-400' },
    { k: 'Sentiment', v: 'Social mentions are trending up alongside price.', dot: 'bg-cyan-400' },
    { k: 'Watch', v: 'Price is testing the recent weekly high.', dot: 'bg-amber-400' },
  ],
  cost: '0.00003 BCH',
};

const TRUST = ['No subscription', 'No credit card', 'You approve every payment'];

const delay = (ms: number) => ({ animationDelay: `${ms}ms` });

const cta = 'inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm transition';

export function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-3 pb-20 pt-16 sm:px-6 lg:pb-28 lg:pt-24">
      <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        {/* Left */}
        <div className="text-center lg:text-left">
          <Badge
            variant="outline"
            className="hero-in gap-2.5 rounded-full border-white/15 bg-transparent py-1 pl-1 pr-4 text-xs font-medium text-gray-300"
            style={delay(0)}
          >
            <span className="rounded-full border border-emerald-500/40 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest text-emerald-300">
              BCH
            </span>
            Pay-per-use AI, powered by Bitcoin Cash
          </Badge>

          <h1
            className="hero-in mt-7 text-[2.6rem] font-semibold leading-[1.05] tracking-[-0.035em] text-white sm:text-6xl lg:text-[4.1rem]"
            style={delay(100)}
          >
            AI crypto insights,
            <br />
            <span className="bg-linear-to-r from-emerald-300 via-emerald-400 to-cyan-300 bg-clip-text text-transparent">
              paid per request in BCH.
            </span>
          </h1>

          <p
            className="hero-in mx-auto mt-6 max-w-xl text-base leading-relaxed text-gray-400 sm:text-lg lg:mx-0"
            style={delay(200)}
          >
            Ask the market a question and get an AI-generated insight in seconds. Pay only a{' '}
            <span className="text-gray-200">tiny BCH amount</span> for each request, straight from{' '}
            <span className="text-gray-200">your own wallet</span>.
          </p>

          <div className="hero-in mt-9 flex flex-wrap items-center justify-center gap-3 lg:justify-start" style={delay(300)}>
            <Link
              href="/register"
              className={cn(
                cta,
                'group bg-emerald-500 font-semibold text-black shadow-[0_8px_32px_-6px_rgba(16,185,129,0.55)] hover:bg-emerald-400',
              )}
            >
              Get Started
              <ArrowRight className="size-4 transition group-hover:translate-x-0.5" strokeWidth={2.4} />
            </Link>

            <a
              href="#how-it-works"
              className={cn(
                cta,
                'border border-white/20 font-medium text-gray-200 hover:border-emerald-500/50 hover:text-white',
              )}
            >
              See how it works
            </a>
          </div>

          <ul
            className="hero-in mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5 lg:justify-start"
            style={delay(380)}
          >
            {TRUST.map((item) => (
              <li key={item} className="flex items-center gap-2 text-[13px] text-gray-400">
                <span className="flex size-4 items-center justify-center rounded-full border border-emerald-500/40 text-emerald-300">
                  <Check className="size-2.5" strokeWidth={3.5} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="hero-in mx-auto w-full max-w-md lg:max-w-none" style={delay(250)}>
          <div className="hero-card hero-float relative rounded-3xl shadow-2xl shadow-emerald-500/10">
            <div aria-hidden className="absolute inset-x-8 top-0 h-px bg-linear-to-r from-transparent via-emerald-300/60 to-transparent" />

            <div className="flex items-center justify-between border-b border-white/10 px-5 py-3.5">
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="size-2.5 rounded-full border border-white/25" />
                ))}
              </div>
              <span className="rounded-full border border-white/15 px-2.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-widest text-gray-400">
                Sample output
              </span>
            </div>

            <div className="space-y-5 p-5 sm:p-6">
              {/* Prompt */}
              <div className="ml-auto w-fit max-w-[88%] rounded-2xl rounded-tr-md border border-emerald-500/30 px-4 py-2.5 text-sm leading-relaxed text-emerald-50">
                {SAMPLE.prompt}
              </div>

              <div className="rounded-2xl rounded-tl-md border border-white/10 p-4 sm:p-5">
                <div className="mb-4 flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-emerald-400" />
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-400/90">
                    Market insight
                  </p>
                </div>

                <ul className="space-y-4">
                  {SAMPLE.points.map(({ k, v, dot }) => (
                    <li
                      key={k}
                      className="relative pl-6 before:absolute before:-bottom-6 before:left-[2.5px] before:top-4 before:w-px before:bg-white/10 last:before:hidden"
                    >
                      <span className={cn('absolute left-0 top-2 size-1.5 rounded-full', dot)} />
                      <p className="text-sm leading-relaxed text-gray-400">
                        <span className="font-medium text-white">{k}</span>
                        <span className="mx-1.5 text-white/20">/</span>
                        {v}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-emerald-500/30 px-4 py-3.5">
                <div className="flex items-center gap-3">
                  <span className="flex size-7 items-center justify-center rounded-full bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.5)]">
                    <Check className="size-3.5" strokeWidth={3} />
                  </span>
                  <div className="leading-tight">
                    <p className="text-[13px] font-medium text-emerald-100">Payment confirmed</p>
                    <p className="mt-0.5 text-[11px] text-emerald-200/50">Paid from your wallet</p>
                  </div>
                </div>
                <span className="rounded-lg border border-emerald-500/25 px-2.5 py-1 font-mono text-xs text-emerald-100">
                  {SAMPLE.cost}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}