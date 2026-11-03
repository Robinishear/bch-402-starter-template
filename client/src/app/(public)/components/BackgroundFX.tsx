const STREAMS = [
  { left: "6%", h: 140, dur: 9, delay: 0 },
  { left: "14%", h: 90, dur: 12, delay: 3 },
  { left: "23%", h: 170, dur: 8, delay: 6 },
  { left: "34%", h: 110, dur: 11, delay: 1.5 },
  { left: "47%", h: 150, dur: 10, delay: 4.5 },
  { left: "58%", h: 100, dur: 13, delay: 2 },
  { left: "69%", h: 180, dur: 9, delay: 7 },
  { left: "78%", h: 120, dur: 11, delay: 0.5 },
  { left: "88%", h: 160, dur: 10, delay: 5 },
  { left: "95%", h: 90, dur: 12, delay: 8 },
];

export function BackgroundFX() {
  return (
    <div aria-hidden className="fx-root">
      {/* Aurora glow orbs */}
      <div className="fx-orb fx-orb-1" />
      <div className="fx-orb fx-orb-2" />
      <div className="fx-orb fx-orb-3" />

      {/* Light beam from top */}
      <div className="fx-beam" />
      <div className="fx-beam-core" />

      {/* Perspective floor grid */}
      <div className="fx-floor">
        <div className="fx-floor-grid" />
      </div>

      {/* Falling data streams */}
      {STREAMS.map((s, i) => (
        <span
          key={i}
          className="fx-stream"
          style={{
            left: s.left,
            height: s.h,
            animationDuration: `${s.dur}s`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}

      {/* Noise + vignette */}
      <div className="fx-noise" />
      <div className="fx-vignette" />

      <style>{`
        .fx-root {
          position: fixed; inset: 0; z-index: 0; overflow: hidden;
          pointer-events: none; background: #03070a;
        }

        /* --- Orbs --- */
        .fx-orb { position: absolute; border-radius: 9999px; }
        .fx-orb-1 {
          width: 560px; height: 560px; left: -12%; top: 8%;
          background: rgba(16,185,129,.14); filter: blur(140px);
          animation: fx-float 20s ease-in-out infinite;
        }
        .fx-orb-2 {
          width: 520px; height: 520px; right: -10%; top: 30%;
          background: rgba(124,58,237,.12); filter: blur(150px);
          animation: fx-float 28s ease-in-out infinite reverse;
        }
        .fx-orb-3 {
          width: 480px; height: 480px; left: 35%; bottom: -20%;
          background: rgba(6,182,212,.10); filter: blur(140px);
          animation: fx-float 24s ease-in-out infinite;
        }

        /* --- Light beam (conic: 50% = pointing down) --- */
        .fx-beam {
          position: absolute; top: -8%; left: 50%;
          width: 1200px; height: 95vh; transform: translateX(-50%);
          background: conic-gradient(from 0deg at 50% 0%,
            transparent 40%, rgba(16,185,129,.30) 50%, transparent 60%);
          filter: blur(28px);
          -webkit-mask-image: linear-gradient(to bottom, #000, transparent 85%);
          mask-image: linear-gradient(to bottom, #000, transparent 85%);
          animation: fx-pulse 9s ease-in-out infinite;
        }
        .fx-beam-core {
          position: absolute; top: 0; left: 50%;
          width: 2px; height: 55vh; transform: translateX(-50%);
          background: linear-gradient(to bottom,
            rgba(110,231,183,.9), rgba(16,185,129,.25) 40%, transparent);
          box-shadow: 0 0 40px 8px rgba(16,185,129,.35);
          filter: blur(1px);
        }

        /* --- Perspective floor --- */
        .fx-floor {
          position: absolute; left: 0; right: 0; bottom: 0; height: 55vh;
          perspective: 520px; overflow: hidden;
          -webkit-mask-image: linear-gradient(to top, #000 5%, transparent 95%);
          mask-image: linear-gradient(to top, #000 5%, transparent 95%);
        }
        .fx-floor-grid {
          position: absolute; left: -50%; right: -50%; top: 0; bottom: -40%;
          transform-origin: top center; transform: rotateX(68deg);
          background-image:
            linear-gradient(to right, rgba(16,185,129,.28) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(16,185,129,.28) 1px, transparent 1px);
          background-size: 64px 64px;
          animation: fx-grid-move 6s linear infinite;
        }

        /* --- Data streams --- */
        .fx-stream {
          position: absolute; top: -200px; width: 1px;
          background: linear-gradient(to bottom,
            transparent, rgba(52,211,153,.75), transparent);
          opacity: .55;
          animation-name: fx-fall; animation-timing-function: linear;
          animation-iteration-count: infinite;
        }

        /* --- Texture --- */
        .fx-noise {
          position: absolute; inset: 0; opacity: .035; mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
        }
        .fx-vignette {
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,.7) 100%);
        }

        /* --- Keyframes --- */
        @keyframes fx-float {
          0%,100% { transform: translate3d(0,0,0) scale(1); }
          50% { transform: translate3d(40px,-30px,0) scale(1.08); }
        }
        @keyframes fx-pulse {
          0%,100% { opacity: .75; } 50% { opacity: 1; }
        }
        @keyframes fx-grid-move {
          from { background-position: 0 0; }
          to { background-position: 0 64px; }
        }
        @keyframes fx-fall {
          from { transform: translateY(0); }
          to { transform: translateY(125vh); }
        }

        @media (prefers-reduced-motion: reduce) {
          .fx-orb, .fx-beam, .fx-floor-grid, .fx-stream { animation: none; }
        }
        @media (max-width: 640px) {
          .fx-beam { width: 700px; }
          .fx-stream:nth-of-type(n+7) { display: none; }
        }
      `}</style>
    </div>
  );
}