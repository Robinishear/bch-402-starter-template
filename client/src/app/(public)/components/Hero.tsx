import Link from 'next/link';

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

function Check({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="m5 12 5 5L20 7" />
    </svg>
  );
}

export function Hero() {
  return (
    <section className="relative isolate mx-auto max-w-7xl px-3 pb-20 pt-16 sm:px-6 lg:pb-28 lg:pt-24">
      {/* background glow + grid */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-120 w-225 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[56px_56px] mask-[radial-gradient(ellipse_at_center,black_30%,transparent_72%)]" />
      </div>

      <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        {/* ───── Left ───── */}
        <div className="text-center lg:text-left">
          <span
            className="hero-in inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/4 py-1 pl-1 pr-4 text-xs font-medium text-gray-300 backdrop-blur"
            style={{ animationDelay: '0ms' }}
          >
            <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-widest text-emerald-300">
              BCH
            </span>
            Pay-per-use AI, powered by Bitcoin Cash
          </span>

          <h1
            className="hero-in mt-7 text-[2.6rem] font-semibold leading-[1.05] tracking-[-0.035em] text-white sm:text-6xl lg:text-[4.1rem]"
            style={{ animationDelay: '100ms' }}
          >
            AI crypto insights,
            <br />
            <span className="bg-linear-to-r from-emerald-300 via-emerald-400 to-cyan-300 bg-clip-text text-transparent">
              paid per request in BCH.
            </span>
          </h1>

          <p
            className="hero-in mx-auto mt-6 max-w-xl text-base leading-relaxed text-gray-400 sm:text-lg lg:mx-0"
            style={{ animationDelay: '200ms' }}
          >
            Ask the market a question and get an AI-generated insight in seconds. Pay only a{' '}
            <span className="text-gray-200">tiny BCH amount</span> for each request, straight from{' '}
            <span className="text-gray-200">your own wallet</span>.
          </p>

          <div
            className="hero-in mt-9 flex flex-wrap items-center justify-center gap-3 lg:justify-start"
            style={{ animationDelay: '300ms' }}
          >
            <Link
              href="/register"
              className="group inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3.5 text-sm font-semibold text-black shadow-[0_8px_32px_-6px_rgba(16,185,129,0.55)] transition hover:bg-emerald-400"
            >
              Get Started
              <svg className="transition group-hover:translate-x-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
            <a
              href="#how-it-works"
              className="rounded-xl border border-white/12 bg-white/4 px-6 py-3.5 text-sm font-medium text-gray-200 backdrop-blur transition hover:border-emerald-500/40 hover:bg-emerald-500/10 hover:text-white"
            >
              See how it works
            </a>
          </div>

          <ul
            className="hero-in mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5 lg:justify-start"
            style={{ animationDelay: '380ms' }}
          >
            {TRUST.map((t) => (
              <li key={t} className="flex items-center gap-2 text-[13px] text-gray-400">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
                  <Check />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>

        {/* ───── Right: sample output card ───── */}
        <div className="hero-in relative mx-auto w-full max-w-md lg:max-w-none" style={{ animationDelay: '250ms' }}>
          <div aria-hidden className="absolute -inset-8 rounded-[2.5rem] bg-emerald-500/15 blur-3xl" />

          <div className="hero-float relative overflow-hidden rounded-3xl border border-white/10 bg-[#06120e]/60 shadow-2xl shadow-emerald-500/10 backdrop-blur-xl">
            {/* top hairline highlight */}
            <div aria-hidden className="absolute inset-x-8 top-0 h-px bg-linear-to-r from-transparent via-emerald-300/50 to-transparent" />

            {/* Window bar */}
            <div className="flex items-center justify-between border-b border-white/8 px-5 py-3.5">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
              </div>
              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-widest text-gray-400">
                Sample output
              </span>
            </div>

            <div className="space-y-4 p-5 sm:p-6">
              {/* Prompt */}
              <div className="ml-auto w-fit max-w-[88%] rounded-2xl rounded-tr-md border border-emerald-500/20 bg-emerald-500/12 px-4 py-2.5 text-sm leading-relaxed text-emerald-50">
                {SAMPLE.prompt}
              </div>

              {/* AI answer */}
              <div className="rounded-2xl rounded-tl-md border border-white/10 bg-white/4 p-4 sm:p-5">
                <div className="mb-4 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-400/90">
                    Market insight
                  </p>
                </div>
                <ul className="space-y-3.5">
                  {SAMPLE.points.map((p) => (
                    <li key={p.k} className="flex gap-3">
                      <span className={`mt-1.75 h-1.5 w-1.5 shrink-0 rounded-full ${p.dot}`} />
                      <p className="text-sm leading-relaxed text-gray-400">
                        <span className="font-medium text-white">{p.k}</span>
                        <span className="mx-1.5 text-white/20">/</span>
                        {p.v}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Payment row */}
              <div className="flex items-center justify-between rounded-2xl border border-emerald-500/25 bg-emerald-500/8 px-4 py-3.5">
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.5)]">
                    <Check />
                  </span>
                  <div className="leading-tight">
                    <p className="text-[13px] font-medium text-emerald-100">Payment confirmed</p>
                    <p className="mt-0.5 text-[11px] text-emerald-200/50">Paid from your wallet</p>
                  </div>
                </div>
                <span className="rounded-lg border border-emerald-500/20 bg-black/20 px-2.5 py-1 font-mono text-xs text-emerald-100">
                  {SAMPLE.cost}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .hero-in { opacity: 0; animation: hero-up .8s cubic-bezier(.22,1,.36,1) forwards; }
        @keyframes hero-up {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .hero-float { animation: hero-bob 7s ease-in-out infinite; }
        @keyframes hero-bob {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-in { animation: none; opacity: 1; }
          .hero-float { animation: none; }
        }
      `}</style>
    </section>
  );
}