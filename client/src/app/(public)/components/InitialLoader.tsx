
'use client';

import React, { useEffect, useState } from 'react';
import { BackgroundFX } from './BackgroundFX';

interface InitialLoaderProps {
  contentReady: boolean;
}

const FADE_DURATION = 600;

export const InitialLoader: React.FC<InitialLoaderProps> = ({
  contentReady,
}) => {
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [animationDone, setAnimationDone] = useState(false);

  useEffect(() => {
    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setAnimationDone(true);
    }
  }, []);

  useEffect(() => {
    if (!loading) return;
    if (!contentReady || !animationDone) return;

    setFadeOut(true);

    const timer = window.setTimeout(() => {
      setLoading(false);
    }, FADE_DURATION);

    return () => window.clearTimeout(timer);
  }, [contentReady, animationDone, loading]);

  if (!loading) return null;

  return (
    <div
      className={`bch-loader fixed inset-0 z-9999 flex flex-col items-center justify-center overflow-hidden text-white ${
        fadeOut ? 'bch-loader-exit' : ''
      }`}
      role="status"
      aria-live="polite"
      aria-label="Loading BCH Blaze"
    >
      <BackgroundFX />

      <div className="bch-ambient" />

      <div className="relative z-10 flex flex-col items-center px-5">

        {/* BCH Coin */}
        <div className="bch-coin">

          <svg
            viewBox="0 0 180 180"
            className="bch-svg"
            aria-hidden="true"
          >
            <defs>
              <linearGradient
                id="bchRing"
                x1="0"
                y1="0"
                x2="1"
                y2="1"
              >
                <stop offset="0%" stopColor="#6ee7b7" />
                <stop offset="50%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>

              <linearGradient
                id="bchFace"
                x1="0"
                y1="0"
                x2="1"
                y2="1"
              >
                <stop offset="0%" stopColor="#6ee7b7" />
                <stop offset="55%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#0e7490" />
              </linearGradient>

              <filter id="bchGlow">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <g className="bch-spin">
              <circle
                className="bch-draw bch-draw-1"
                cx="90"
                cy="90"
                r="82"
                fill="none"
                stroke="url(#bchRing)"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </g>

            <g className="bch-spin-rev">
              <circle
                className="bch-draw bch-draw-2"
                cx="90"
                cy="90"
                r="70"
                fill="none"
                stroke="#67e8f9"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </g>

            <circle
              className="bch-face"
              cx="90"
              cy="90"
              r="60"
              fill="url(#bchFace)"
              filter="url(#bchGlow)"
            />

            <circle
              className="bch-face-edge"
              cx="90"
              cy="90"
              r="53"
              fill="none"
              stroke="#022c22"
              strokeOpacity=".4"
              strokeWidth="2"
              strokeDasharray="3 5"
            />
          </svg>

          {/* BCH Letters */}
          <div className="bch-text">
            <span style={{ animationDelay: '0.1s' }}>B</span>
            <span style={{ animationDelay: '0.4s' }}>C</span>
            <span style={{ animationDelay: '0.7s' }}>H</span>
          </div>

          {/* Shine */}
          <div className="bch-shine-wrap">
            <div className="bch-shine" />
          </div>

          <div className="bch-coin-glow" />
        </div>

        {/* Branding */}
        <div className="mt-9 text-center space-y-4">

          <h2 className="bch-title text-2xl sm:text-3xl font-black tracking-widest bg-linear-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent">
            BCH BLAZE 2026
          </h2>

          <p className="bch-subtitle text-[10px] sm:text-xs font-medium uppercase tracking-[0.35em] text-emerald-100/50">
            Blockchain Payment Ecosystem
          </p>

          {/* Status */}
          <div
            className="bch-status flex items-center justify-center gap-3 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-gray-400"
            onAnimationEnd={(event) => {
              if (
                event.target === event.currentTarget &&
                event.animationName === 'bch-rise'
              ) {
                setAnimationDone(true);
              }
            }}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>

            {contentReady
              ? 'Finalizing Experience...'
              : 'Initializing Gateway...'}
          </div>

          {/* Progress Bar */}
          <div className="bch-progress-container mx-auto mt-7 w-52 sm:w-60">

            <div className="bch-progress-track">
              <div className="bch-progress-fill" />
            </div>

            <div className="mt-3 flex items-center justify-between text-[9px] font-medium uppercase tracking-[0.2em] text-gray-500">
              <span>System Initialization</span>
              <span className="bch-live">LIVE</span>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="bch-footer mt-12 flex items-center gap-2 text-[9px] font-medium uppercase tracking-[0.25em] text-white/25">
          <span className="h-px w-6 bg-emerald-500/40" />
          Secure · Decentralized · Reliable
          <span className="h-px w-6 bg-emerald-500/40" />
        </div>

      </div>

      <style jsx>{`
        .bch-loader {
          background: #020807;
          opacity: 1;
          transition:
            opacity ${FADE_DURATION}ms ease,
            visibility ${FADE_DURATION}ms ease;
        }

        .bch-loader-exit {
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
        }

        .bch-ambient {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            radial-gradient(
              circle at 50% 45%,
              rgba(16, 185, 129, 0.12),
              transparent 35%
            ),
            radial-gradient(
              circle at 50% 90%,
              rgba(6, 182, 212, 0.07),
              transparent 35%
            );
        }

        .bch-coin {
          position: relative;
          width: 180px;
          height: 180px;
          isolation: isolate;
        }

        .bch-svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          overflow: visible;
        }

        .bch-text {
          position: absolute;
          inset: 0;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 2px;
          font-weight: 900;
          font-size: 34px;
          letter-spacing: 0.08em;
          color: #ecfdf5;
          text-shadow: 0 0 18px rgba(16, 185, 129, 0.7);
          animation: bch-text-color 0.5s ease forwards 2.1s;
        }

        .bch-text span {
          opacity: 0;
          transform: translateY(10px) scale(0.8);
          filter: blur(6px);
          animation: bch-letter 0.45s cubic-bezier(.2,.9,.3,1.2) forwards;
        }

        .bch-draw {
          transform-origin: 90px 90px;
        }

        .bch-draw-1 {
          stroke-dasharray: 516;
          stroke-dashoffset: 516;
          animation: bch-draw 1.1s ease-out forwards 1s;
        }

        .bch-draw-2 {
          stroke-dasharray: 440;
          stroke-dashoffset: 440;
          animation: bch-draw 1.1s ease-out forwards 1.2s;
        }

        .bch-spin {
          transform-origin: 90px 90px;
          animation: bch-rot 1.6s linear infinite;
        }

        .bch-spin-rev {
          transform-origin: 90px 90px;
          animation: bch-rot 2.2s linear infinite reverse;
        }

        .bch-face {
          opacity: 0;
          transform-origin: 90px 90px;
          transform: scale(0.4);
          animation: bch-face 0.7s cubic-bezier(.2,.9,.3,1.2) forwards 2s;
        }

        .bch-face-edge {
          opacity: 0;
          animation: bch-fade 0.4s ease forwards 2.5s;
        }

        .bch-coin-glow {
          position: absolute;
          inset: 25px;
          border-radius: 50%;
          background: rgba(16, 185, 129, 0.2);
          filter: blur(30px);
          z-index: -1;
          animation: bch-pulse 2s ease-in-out infinite;
        }

        .bch-shine-wrap {
          position: absolute;
          left: 30px;
          top: 30px;
          width: 120px;
          height: 120px;
          border-radius: 50%;
          overflow: hidden;
          z-index: 3;
          pointer-events: none;
        }

        .bch-shine {
          position: absolute;
          top: -20%;
          bottom: -20%;
          width: 40%;
          left: -60%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255,255,255,.55),
            transparent
          );
          transform: skewX(-20deg);
          animation: bch-shine 0.9s ease-in-out forwards 2.7s;
        }

        .bch-title {
          opacity: 0;
          transform: translateY(14px);
          letter-spacing: 0.3em;
          animation: bch-title 0.8s ease forwards 2.3s;
        }

        .bch-subtitle {
          opacity: 0;
          animation: bch-rise 0.6s ease forwards 2.5s;
        }

        .bch-status {
          opacity: 0;
          transform: translateY(10px);
          animation: bch-rise 0.6s ease forwards 2.7s;
        }

        .bch-progress-track {
          height: 3px;
          width: 100%;
          border-radius: 20px;
          background: rgba(255,255,255,.09);
          overflow: hidden;
        }

        .bch-progress-fill {
          width: 38%;
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(
            90deg,
            #10b981,
            #67e8f9,
            #10b981
          );
          box-shadow: 0 0 12px rgba(16,185,129,.6);
          animation: bch-progress 1.5s ease-in-out infinite;
        }

        .bch-progress-container {
          opacity: 0;
          animation: bch-fade 0.5s ease forwards 2.9s;
        }

        .bch-live {
          color: #34d399;
          animation: bch-live 1.5s ease-in-out infinite;
        }

        .bch-footer {
          opacity: 0;
          animation: bch-fade 0.6s ease forwards 3s;
        }

        @keyframes bch-letter {
          to {
            opacity: 1;
            transform: none;
            filter: blur(0);
          }
        }

        @keyframes bch-text-color {
          to {
            color: #022c22;
            text-shadow: 0 1px 0 rgba(255,255,255,.35);
          }
        }

        @keyframes bch-draw {
          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes bch-rot {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes bch-face {
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes bch-fade {
          to {
            opacity: 1;
          }
        }

        @keyframes bch-shine {
          to {
            left: 130%;
          }
        }

        @keyframes bch-title {
          to {
            opacity: 1;
            transform: none;
            letter-spacing: 0.08em;
          }
        }

        @keyframes bch-rise {
          to {
            opacity: 1;
            transform: none;
          }
        }

        @keyframes bch-progress {
          0% {
            transform: translateX(-120%);
          }
          100% {
            transform: translateX(280%);
          }
        }

        @keyframes bch-pulse {
          0%, 100% {
            opacity: .35;
            transform: scale(.9);
          }
          50% {
            opacity: .8;
            transform: scale(1.15);
          }
        }

        @keyframes bch-live {
          0%, 100% {
            opacity: .5;
          }
          50% {
            opacity: 1;
          }
        }

        @media (max-width: 480px) {
          .bch-coin {
            transform: scale(.88);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .bch-spin,
          .bch-spin-rev,
          .bch-coin-glow,
          .bch-progress-fill,
          .bch-live {
            animation: none;
          }

          .bch-draw-1,
          .bch-draw-2 {
            stroke-dashoffset: 0;
            animation: none;
          }

          .bch-text span,
          .bch-face,
          .bch-face-edge,
          .bch-title,
          .bch-subtitle,
          .bch-status,
          .bch-progress-container,
          .bch-footer {
            opacity: 1;
            transform: none;
            filter: none;
            animation: none;
          }

          .bch-text {
            animation: none;
            color: #022c22;
          }
        }
      `}</style>
    </div>
  );
};
