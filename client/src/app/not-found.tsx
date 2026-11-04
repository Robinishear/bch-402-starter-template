
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  Blocks,
  CircleDot,
  Cpu,
  Home,
  Radio,
  ShieldCheck,
  Zap,
} from "lucide-react";

export default function NotFound() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="bch-404 relative min-h-screen overflow-hidden bg-[#020807] text-white selection:bg-emerald-500/30">

      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.035)_1px,transparent_1px)] bg-size-[55px_55px]" />

        <div className="absolute left-1/2 top-1/2 h-162.5 w-162.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/[0.07] blur-[130px]" />

        <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-teal-500/6 blur-[120px]" />

        <div className="absolute -bottom-40 -right-20 h-96 w-96 rounded-full bg-cyan-500/5 blur-[120px]" />

        {/* Floating particles */}
        {mounted &&
          Array.from({ length: 24 }).map((_, i) => (
            <span
              key={i}
              className="particle absolute h-1 w-1 rounded-full bg-emerald-300/50"
              style={{
                left: `${(i * 37 + 11) % 100}%`,
                top: `${(i * 53 + 7) % 100}%`,
                animationDelay: `${(i % 7) * 0.5}s`,
                animationDuration: `${5 + (i % 5)}s`,
              }}
            />
          ))}
      </div>

      {/* Navbar */}
      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-6 sm:px-8 lg:px-12">

        <Link href="/" className="group flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-400/25 bg-emerald-400/8 text-xl font-black text-emerald-300 shadow-[0_0_25px_rgba(16,185,129,0.08)] transition group-hover:border-emerald-300/60">
            ₿
          </div>

          <div>
            <h1 className="text-sm font-black tracking-[0.22em] text-white">
              BCH <span className="text-emerald-400">BLAZE</span>
            </h1>
            <p className="mt-1 text-[9px] font-medium tracking-[0.25em] text-emerald-100/35">
              BLOCKCHAIN ECOSYSTEM
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/5 px-3 py-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <span className="text-[9px] font-bold tracking-[0.16em] text-emerald-300 sm:text-[10px]">
            NETWORK ONLINE
          </span>
        </div>
      </header>

      {/* Main Content */}
      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-100px)] w-full max-w-7xl flex-col items-center justify-center px-5 pb-16 pt-8 sm:px-8">

        {/* Top Label */}
        <div className="mb-5 flex items-center gap-3">
          <span className="h-px w-8 bg-emerald-500/40" />
          <span className="text-[9px] font-bold uppercase tracking-[0.35em] text-emerald-300/65 sm:text-[10px]">
            Blockchain Navigation Error
          </span>
          <span className="h-px w-8 bg-emerald-500/40" />
        </div>

        {/* 404 Visual */}
        <div className="relative mb-5 flex items-center justify-center">

          <div className="absolute h-64 w-64 rounded-full border border-emerald-400/8 sm:h-80 sm:w-80" />

          <div className="absolute h-52 w-52 rounded-full border border-dashed border-emerald-400/15 sm:h-64 sm:w-64" />

          <div className="absolute h-40 w-40 rounded-full bg-emerald-500/9 blur-3xl" />

          <h2 className="error-number relative select-none text-[clamp(100px,24vw,230px)] font-black leading-none tracking-[-0.09em]">
            <span>4</span>
            <span className="text-emerald-400">0</span>
            <span>4</span>
          </h2>

          <div className="absolute -right-3 top-4 flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-300/20 bg-[#071b17] text-cyan-300 shadow-[0_0_30px_rgba(34,211,238,0.12)] sm:right-2 sm:top-8 sm:h-12 sm:w-12">
            <Blocks size={22} />
          </div>

          <div className="absolute -left-5 bottom-5 flex h-9 w-9 items-center justify-center rounded-full border border-emerald-300/20 bg-[#071b17] text-emerald-300 sm:-left-8 sm:h-11 sm:w-11">
            <Zap size={18} />
          </div>
        </div>

        {/* Error Title */}
        <div className="text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/6 px-3 py-1.5">
            <CircleDot size={11} className="text-amber-400" />
            <span className="text-[9px] font-bold tracking-[0.2em] text-amber-300">
              ERROR CODE · BCH-404
            </span>
          </div>

          <h3 className="text-2xl font-black tracking-[0.08em] text-white sm:text-4xl">
            BLOCK <span className="text-emerald-400">NOT FOUND</span>
          </h3>

          <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-gray-400 sm:text-base">
            Looks like this block went off-chain. The page you're
            searching for doesn't exist, has been moved, or is no
            longer available on this network.
          </p>
        </div>

        {/* Network Status */}
        <div className="mt-9 grid w-full max-w-xl grid-cols-3 gap-2 sm:gap-3">

          <div className="status-card rounded-xl border border-white/[0.07] bg-white/2.5 p-3 text-center sm:p-4">
            <Radio className="mx-auto mb-2 text-emerald-400" size={17} />
            <p className="text-[8px] font-semibold tracking-[0.16em] text-gray-500 sm:text-[9px]">
              NETWORK
            </p>
            <p className="mt-1 text-[10px] font-bold text-emerald-300 sm:text-xs">
              ONLINE
            </p>
          </div>

          <div className="status-card rounded-xl border border-white/[0.07] bg-white/2.5 p-3 text-center sm:p-4">
            <Blocks className="mx-auto mb-2 text-amber-400" size={17} />
            <p className="text-[8px] font-semibold tracking-[0.16em] text-gray-500 sm:text-[9px]">
              BLOCK
            </p>
            <p className="mt-1 text-[10px] font-bold text-amber-300 sm:text-xs">
              MISSING
            </p>
          </div>

          <div className="status-card rounded-xl border border-white/[0.07] bg-white/2.5 p-3 text-center sm:p-4">
            <ShieldCheck className="mx-auto mb-2 text-cyan-400" size={17} />
            <p className="text-[8px] font-semibold tracking-[0.16em] text-gray-500 sm:text-[9px]">
              SECURITY
            </p>
            <p className="mt-1 text-[10px] font-bold text-cyan-300 sm:text-xs">
              SECURE
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex w-full max-w-xl flex-col items-center justify-center gap-3 sm:flex-row">

          <Link
            href="/"
            className="group flex w-full items-center justify-center gap-3 rounded-xl bg-emerald-400 px-7 py-4 text-xs font-black tracking-[0.15em] text-[#022c22] shadow-[0_0_30px_rgba(16,185,129,0.15)] transition-all duration-300 hover:-translate-y-1 hover:bg-emerald-300 hover:shadow-[0_0_40px_rgba(16,185,129,0.3)] sm:w-auto"
          >
            <Home size={16} />
            RETURN TO HOMEPAGE
            <ArrowUpRight size={15} className="transition group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>

          <button
            onClick={() => window.history.back()}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-7 py-4 text-xs font-bold tracking-[0.15em] text-gray-300 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-400/30 hover:bg-emerald-400/[0.07] hover:text-emerald-300 sm:w-auto"
          >
            <ArrowLeft size={15} />
            GO BACK
          </button>
        </div>

        {/* Footer */}
        <div className="mt-12 flex flex-col items-center gap-3">
          <div className="flex items-center gap-2 text-[9px] font-medium uppercase tracking-[0.3em] text-white/25">
            <span className="h-px w-6 bg-emerald-500/30" />
            SECURE · DECENTRALIZED · RELIABLE
            <span className="h-px w-6 bg-emerald-500/30" />
          </div>

          <p className="text-[9px] tracking-wider text-white/20">
            © 2026 BCH BLAZE. ALL RIGHTS RESERVED.
          </p>
        </div>
      </section>

      {/* Animations */}
      <style jsx>{`
        .bch-404 {
          isolation: isolate;
        }

        .error-number {
          color: transparent;
          -webkit-text-stroke: 1.5px rgba(110, 231, 183, 0.65);
          background: linear-gradient(
            180deg,
            #ecfdf5 5%,
            #6ee7b7 45%,
            #047857 100%
          );
          background-clip: text;
          -webkit-background-clip: text;
          filter: drop-shadow(0 0 35px rgba(16, 185, 129, 0.12));
          animation: numberReveal 1s ease both;
        }

        .error-number span:nth-child(2) {
          color: #10b981;
          -webkit-text-stroke: 0;
          text-shadow: 0 0 45px rgba(16, 185, 129, 0.35);
        }

        .particle {
          animation: floatParticle linear infinite;
        }

        .status-card {
          transition: all 0.3s ease;
          backdrop-filter: blur(12px);
        }

        .status-card:hover {
          border-color: rgba(52, 211, 153, 0.3);
          background: rgba(16, 185, 129, 0.055);
          transform: translateY(-4px);
        }

        @keyframes floatParticle {
          0%, 100% {
            transform: translateY(0) scale(0.7);
            opacity: 0.15;
          }
          50% {
            transform: translateY(-25px) scale(1.2);
            opacity: 0.8;
          }
        }

        @keyframes numberReveal {
          from {
            opacity: 0;
            transform: translateY(25px) scale(0.94);
            filter: blur(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .error-number,
          .particle {
            animation: none;
          }

          .status-card {
            transition: none;
          }
        }
      `}</style>
    </main>
  );
}
