'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/_core/utils/utils';

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

function MenuIcon({ open }: { open: boolean }) {
  const bar = 'absolute left-0 h-0.5 w-5 rounded bg-current transition-all duration-300';
  return (
    <span className="relative block h-3.5 w-5">
      <span className={cn(bar, open ? 'top-1.5 rotate-45' : 'top-0')} />
      <span className={cn(bar, 'top-1.5', open && 'opacity-0')} />
      <span className={cn(bar, open ? 'top-1.5 -rotate-45' : 'top-3')} />
    </span>
  );
}

function NavLink({ href, label, active, className }: { href: string; label: string; active: boolean; className?: string }) {
  return (
    <Link
      href={href}
      className={cn(
        'rounded-lg px-3.5 py-2 text-sm font-medium transition-colors',
        active ? 'bg-emerald-500/10 text-emerald-300' : 'text-gray-400 hover:bg-white/5 hover:text-white',
        className,
      )}
    >
      {label}
    </Link>
  );
}

// Hide on scroll down, show on scroll up
function useScrollState() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    const update = () => {
      const y = Math.max(window.scrollY, 0);
      const delta = y - lastY;

      setScrolled(y > 16);

      if (y < 80) {
        setHidden(false);
        lastY = y;
      } else if (Math.abs(delta) > 8) {
        setHidden(delta > 0);
        lastY = y;
      }
      ticking = false;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return { hidden, scrolled, show: () => setHidden(false) };
}

export const Navbar = ({ authButtons }: { authButtons: React.ReactNode }) => {
  const pathname = usePathname();
  const { hidden, scrolled, show } = useScrollState();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      onFocusCapture={show}
      className={cn(
        'sticky top-0 z-50 px-3 pt-3 transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:px-6',
        hidden && !mobileOpen ? 'translate-y-[-130%] opacity-0' : 'translate-y-0 opacity-100',
      )}
    >
      <nav
        className={cn(
          'mx-auto max-w-7xl rounded-2xl border backdrop-blur-xl transition-all duration-500',
          scrolled
            ? 'border-emerald-500/20 bg-[#05100d]/75 shadow-[0_8px_40px_-12px_rgba(16,185,129,0.35)]'
            : 'border-white/5 bg-white/2',
        )}
      >
        <div className="flex h-14 items-center justify-between px-4 sm:px-5">
          <Link href="/" className="flex items-center gap-2.5">
            <LogoMark />
            <span className="text-lg font-semibold tracking-tight text-white">{BRAND}</span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {LINKS.map((l) => (
              <NavLink key={l.href} {...l} active={l.href === pathname} />
            ))}
          </div>

          <div className="hidden md:block">{authButtons}</div>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-300 transition hover:bg-white/5 hover:text-white md:hidden"
          >
            <MenuIcon open={mobileOpen} />
          </button>
        </div>

        {/* Mobile menu */}
        <div
          className={cn(
            'grid transition-[grid-template-rows] duration-300 ease-out md:hidden',
            mobileOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
          )}
        >
          <div className="overflow-hidden">
            <div className="space-y-1 border-t border-white/5 px-3 pb-4 pt-3">
              {LINKS.map((l) => (
                <NavLink key={l.href} {...l} active={l.href === pathname} className="block" />
              ))}
              <div className="pt-3">{authButtons}</div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};