'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const BRAND = 'BCH BLAZE'; 

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/docs', label: 'Docs' },
  { href: '/blaze', label: 'BLAZE 2026' },
];

function LogoMark() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden>
      <defs>
        <linearGradient id="lg" x1="0" y1="0" x2="32" y2="32">
          <stop stopColor="#34d399" />
          <stop offset="1" stopColor="#0ac18e" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill="url(#lg)" />
      <path d="M18 5 9 18h6l-1 9 9-13h-6l1-9Z" fill="#03070a" />
    </svg>
  );
}

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const lastY = useRef(0);
  const ticking = useRef(false);

  // Hide on scroll down, show on scroll up
  useEffect(() => {
    lastY.current = window.scrollY;

    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;

      requestAnimationFrame(() => {
        const y = Math.max(window.scrollY, 0);
        const delta = y - lastY.current;

        setScrolled(y > 16);

        if (y < 80) {
          setHidden(false);
          lastY.current = y;
        } else if (delta > 8) {
          setHidden(true);
          lastY.current = y;
        } else if (delta < -8) {
          setHidden(false);
          lastY.current = y;
        }

        ticking.current = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setMobileOpen(false), [pathname]);

  const isHidden = hidden && !mobileOpen;

  return (
    <header
      onFocusCapture={() => setHidden(false)}
      className={`sticky top-0 z-50 px-3 pt-3 transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:px-6 ${
        isHidden ? 'translate-y-[-130%] opacity-0' : 'translate-y-0 opacity-100'
      }`}
    >
      <nav
        className={`mx-auto max-w-7xl rounded-2xl border backdrop-blur-xl transition-all duration-500 ${
          scrolled
            ? 'border-emerald-500/20 bg-[#05100d]/75 shadow-[0_8px_40px_-12px_rgba(16,185,129,0.35)]'
            : 'border-white/5 bg-white/2'
        }`}
      >
        <div className="flex h-14 items-center justify-between px-4 sm:px-5">
          {/* Brand */}
          <Link href="/" className="group flex items-center gap-2.5">
            <LogoMark />
            <span className="text-lg font-semibold tracking-tight text-white">
              {BRAND}
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden items-center gap-1 md:flex">
            {LINKS.map((l) => {
              const active = l.href === pathname;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                    active
                      ? 'bg-emerald-500/10 text-emerald-300'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </div>

          {/* Actions */}
          <div className="hidden items-center gap-2 md:flex">
            <Link
              href="/login"
              className="rounded-lg px-3.5 py-2 text-sm font-medium text-gray-300 transition-colors hover:text-white"
            >
              Login
            </Link>
            {/* <button
              type="button"
              // TODO: WizardConnect wallet connect এখানে কল করো
              className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-black shadow-[0_0_24px_rgba(16,185,129,0.35)] transition hover:bg-emerald-400"
            >
                 Get Started
            </button> */}
             <Link
            href="/register"
            className="rounded-xl bg-emerald-300 px-6 py-3.5 text-sm font-semibold text-black shadow-[0_0_32px_rgba(16,185,129,0.4)] transition hover:bg-emerald-400"
          >
            Get Started
          </Link>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-300 transition hover:bg-white/5 hover:text-white md:hidden"
          >
            <span className="relative block h-3.5 w-5">
              <span
                className={`absolute left-0 h-0.5 w-5 rounded bg-current transition-all duration-300 ${
                  mobileOpen ? 'top-1.5 rotate-45' : 'top-0'
                }`}
              />
              <span
                className={`absolute left-0 top-1.5 h-0.5 w-5 rounded bg-current transition-opacity duration-200 ${
                  mobileOpen ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <span
                className={`absolute left-0 h-0.5 w-5 rounded bg-current transition-all duration-300 ${
                  mobileOpen ? 'top-1.5 -rotate-45' : 'top-3'
                }`}
              />
            </span>
          </button>
        </div>

        {/* Mobile menu (smooth expand) */}
        <div
          className={`grid transition-[grid-template-rows] duration-300 ease-out md:hidden ${
            mobileOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
          }`}
        >
          <div className="overflow-hidden">
            <div className="space-y-1 border-t border-white/5 px-3 pb-4 pt-3">
              {LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    l.href === pathname
                      ? 'bg-emerald-500/10 text-emerald-300'
                      : 'text-gray-300 hover:bg-white/5'
                  }`}
                >
                  {l.label}
                </Link>
              ))}
              <div className="grid grid-cols-2 gap-2 pt-3">
                <Link
                  href="/login"
                  className="rounded-lg border border-white/10 bg-white/5 py-2.5 text-center text-sm font-medium text-white"
                >
                  Login
                </Link>

                <Link
            href="/register"
            className="rounded-xl bg-emerald-900 px-6 py-3.5 text-sm font-semibold text-black shadow-[0_0_32px_rgba(16,185,129,0.4)] transition hover:bg-emerald-400"
          >
            Get Started
          </Link>

              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};