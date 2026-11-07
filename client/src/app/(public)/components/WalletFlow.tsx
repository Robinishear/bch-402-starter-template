'use client';

import { useEffect, useRef } from 'react';
import { CARD_Y, MONO, Packet, ROWS, Show, Slot, WalletIcon, WALLETS } from './Wallet_fun';


export function WalletFlow() {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = ref.current;
    if (!svg) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      svg.pauseAnimations();
      return;
    }

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) svg.unpauseAnimations();
      else svg.pauseAnimations();
    });

    io.observe(svg);
    return () => io.disconnect();
  }, []);

  return (
    <section id="wallets" className="mx-auto max-w-7xl scroll-mt-28 px-3 pb-24 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-400/80">
          Supported wallets
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          Pay from the BCH wallet you already use
        </h2>
        <p className="mt-4 leading-7 text-gray-400">
          Approve the payment in Electron Cash, Selene or Bitcoin.com Wallet. The gateway detects the transaction and
          verifies it directly on the Bitcoin Cash network.
        </p>
      </div>

      <div className="relative mt-12">
        <div aria-hidden className="pointer-events-none absolute -inset-5 rounded-[2rem] " />

        <div className="relative overflow-x-auto rounded-[28px] border border-white/9  p-3 shadow-[0_28px_100px_rgba(0,0,0,0.48)] sm:p-6">
          <svg
            ref={ref}
            viewBox="0 0 1200 540"
            role="img"
            aria-label="Payment flow: BCH wallets send a payment to the gateway, which detects and verifies it, then it is confirmed in a Bitcoin Cash block."
            className="mx-auto h-auto w-full min-w-225"
            style={{ fontFamily: 'inherit' }}
          >
            <defs>
              <linearGradient id="wf-panel" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#141f19" />
                <stop offset="1" stopColor="#0a100d" />
              </linearGradient>
              <linearGradient id="wf-edge" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#9bb8a8" stopOpacity=".4" />
                <stop offset="1" stopColor="#9bb8a8" stopOpacity=".07" />
              </linearGradient>
              <linearGradient id="wf-head" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#1a2620" />
                <stop offset="1" stopColor="#101813" />
              </linearGradient>
              <linearGradient id="wf-block" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#123222" />
                <stop offset="1" stopColor="#0a1812" />
              </linearGradient>
              <filter id="wf-shadow" x="-20%" y="-20%" width="140%" height="150%">
                <feDropShadow dx="0" dy="10" stdDeviation="10" floodColor="#000" floodOpacity=".45" />
              </filter>
              <pattern id="wf-grid" width="28" height="28" patternUnits="userSpaceOnUse">
                <path d="M28 0H0V28" fill="none" stroke="#a7f3d0" strokeOpacity=".03" />
              </pattern>
            </defs>

            {/* Canvas */}
            <rect x="1" y="1" width="1198" height="538" rx="22" fill="#090b0a" stroke="#fff" strokeOpacity=".09" />
            <rect x="1" y="1" width="1198" height="538" rx="22" fill="url(#wf-grid)" />

            <text x="28" y="68" fontFamily={MONO} fontSize="10" letterSpacing="2.5" fill="#71877b">WALLET</text>
            <text x="420" y="68" fontFamily={MONO} fontSize="10" letterSpacing="2.5" fill="#71877b">GATEWAY</text>
            <text x="850" y="68" fontFamily={MONO} fontSize="10" letterSpacing="2.5" fill="#71877b">BITCOIN CASH NETWORK</text>

            {/* Connectors */}
            {WALLETS.map((w, i) => (
              <g key={w.name}>
                <path
                  id={`wf-p${i}`}
                  d={`M318 ${CARD_Y[i] + 56} C365 ${CARD_Y[i] + 56} 375 270 420 270`}
                  fill="none"
                  stroke="#8fb5a1"
                  strokeOpacity=".3"
                  strokeWidth="1.5"
                />
                <circle cx="318" cy={CARD_Y[i] + 56} r="3" fill="#8fb5a1" fillOpacity=".6" />
              </g>
            ))}
            <circle cx="420" cy="270" r="3.5" fill="#34d399" />
            <path id="wf-chain" d="M770 270 C805 270 815 194 850 194" fill="none" stroke="#8fb5a1" strokeOpacity=".3" strokeWidth="1.5" />
            <circle cx="770" cy="270" r="3" fill="#8fb5a1" fillOpacity=".6" />
            <circle cx="850" cy="194" r="3.5" fill="#34d399" />

            {/* ───── Wallet cards ───── */}
            {WALLETS.map((w, i) => {
              const y = CARD_Y[i];
              const begin = i * 5;
              return (
                <g key={w.name} filter="url(#wf-shadow)">
                  <rect x="28" y={y} width="290" height="112" rx="14" fill="url(#wf-panel)" stroke="url(#wf-edge)" />
                  {/* active highlight */}
                  <rect x="28" y={y} width="290" height="112" rx="14" fill="none" stroke={w.color} strokeWidth="1.5" opacity="0">
                    <Slot attr="opacity" off="0" on=".75" begin={begin} />
                  </rect>

                  <rect x="44" y={y + 14} width="36" height="36" rx="9" fill={w.color} fillOpacity=".11" stroke={w.color} strokeOpacity=".28" />
                  <g transform={`translate(62 ${y + 32})`}>
                    <WalletIcon kind={w.icon} color={w.color} />
                  </g>
                  <text x="92" y={y + 29} fontSize="14.5" fontWeight="600" fill="#f1f6f3">{w.name}</text>
                  <text x="92" y={y + 45} fontSize="10.5" fill="#8a9a90">{w.sub}</text>
                  <path d={`M44 ${y + 62}H302`} stroke="#fff" strokeOpacity=".07" />

                  <text x="44" y={y + 80} fontFamily={MONO} fontSize="8.5" letterSpacing="1.5" fill="#6b7a71">AMOUNT</text>
                  <text x="44" y={y + 98} fontFamily={MONO} fontSize="13" fill="#e8f1ec">0.00042 BCH</text>
                  <text x="144" y={y + 80} fontFamily={MONO} fontSize="8.5" letterSpacing="1.5" fill="#6b7a71">TO</text>
                  <text x="144" y={y + 98} fontFamily={MONO} fontSize="11" fill="#b4c4ba">{w.addr}</text>

                  {/* status pill */}
                  <rect x="226" y={y + 78} width="76" height="24" rx="12" fill="#0b110e" stroke="#4b5a52">
                    <Slot attr="stroke" off="#4b5a52" on={w.color} begin={begin} />
                  </rect>
                  <text x="264" y={y + 94} textAnchor="middle" fontFamily={MONO} fontSize="9" fontWeight="700" letterSpacing="1" fill="#8a9a90">
                    READY
                    <Slot attr="opacity" off="1" on="0" begin={begin} />
                  </text>
                  <text x="264" y={y + 94} textAnchor="middle" fontFamily={MONO} fontSize="9" fontWeight="700" letterSpacing="1" fill={w.color} opacity="0">
                    SENT
                    <Slot attr="opacity" off="0" on="1" begin={begin} />
                  </text>
                </g>
              );
            })}

            {/* ───── Gateway console ───── */}
            <g filter="url(#wf-shadow)">
              <rect x="420" y="90" width="350" height="380" rx="16" fill="url(#wf-panel)" stroke="url(#wf-edge)" />
            </g>
            <path d="M421 134V107a16 16 0 0 1 16-16H753a16 16 0 0 1 16 16V134Z" fill="url(#wf-head)" />
            <path d="M421 134H769" stroke="#fff" strokeOpacity=".07" />
            <circle cx="440" cy="112" r="3" fill="#34d399" />
            <circle cx="452" cy="112" r="3" fill="#d6a85c" fillOpacity=".7" />
            <circle cx="464" cy="112" r="3" fill="#a1a1aa" fillOpacity=".6" />
            <text x="482" y="116" fontSize="13" fontWeight="600" fill="#eef6f1">BCH Payment Gateway</text>
            <rect x="700" y="102" width="54" height="20" rx="10" fill="#0f2a1e" stroke="#34d399" strokeOpacity=".5" />
            <circle cx="713" cy="112" r="3" fill="#34d399">
              <animate attributeName="opacity" values="1;.35;1" dur="2s" repeatCount="indefinite" />
            </circle>
            <text x="735" y="115" textAnchor="middle" fontFamily={MONO} fontSize="8.5" fontWeight="700" letterSpacing="1" fill="#a7f3d0">LIVE</text>

            {/* Invoice */}
            <rect x="438" y="148" width="314" height="66" rx="10" fill="#070d0a" stroke="#fff" strokeOpacity=".08" />
            <text x="454" y="168" fontFamily={MONO} fontSize="8.5" letterSpacing="1.5" fill="#6b7a71">INVOICE</text>
            <text x="454" y="188" fontFamily={MONO} fontSize="12" fill="#eef6f1">inv_8f3a21</text>
            <text x="736" y="168" textAnchor="end" fontFamily={MONO} fontSize="8.5" letterSpacing="1.5" fill="#6b7a71">AMOUNT</text>
            <text x="736" y="188" textAnchor="end" fontFamily={MONO} fontSize="13" fill="#eef6f1">0.00042 BCH</text>
            <text x="454" y="205" fontFamily={MONO} fontSize="8.5" letterSpacing="1.2" fill="#d6a85c">
              AWAITING PAYMENT
              <Show a={0.4} off="1" on="0" />
            </text>
            <text x="454" y="205" fontFamily={MONO} fontSize="8.5" letterSpacing="1.2" fill="#6ee7b7" opacity="0">
              PAYMENT RECEIVED
              <Show a={0.4} />
            </text>

            {/* Timeline */}
            {ROWS.map((r, i) => {
              const cy = 250 + i * 38;
              return (
                <g key={r.label}>
                  {i < ROWS.length - 1 && <path d={`M456 ${cy + 9}V${cy + 29}`} stroke="#26352c" strokeWidth="1.5" />}
                  <circle cx="456" cy={cy} r="9" fill="#0b110e" stroke="#4b5a52" />
                  <g opacity="0">
                    <Show a={r.a} />
                    <circle cx="456" cy={cy} r="9" fill="#0f3d2a" stroke="#34d399" />
                    <path d={`M451.5 ${cy}l3.2 3.4 6-6.8`} fill="none" stroke="#a7f3d0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </g>
                  <text x="476" y={cy + 4} fontSize="12" fill="#74857b">
                    {r.label}
                    <Show a={r.a} attr="fill" off="#74857b" on="#eef6f1" />
                  </text>
                  <text x="748" y={cy + 4} textAnchor="end" fontFamily={MONO} fontSize="9.5" fill="#5f6f65">{r.time}</text>
                </g>
              );
            })}

            {/* Log */}
            <rect x="438" y="392" width="314" height="66" rx="10" fill="#060a08" stroke="#fff" strokeOpacity=".08" />
            <g fontFamily={MONO} fontSize="9.5">
              <text x="452" y="411" fill="#7fbf9f" opacity="0">
                <tspan fill="#5f6f65">› </tspan>invoice inv_8f3a21 created
                <Show a={0.02} />
              </text>
              <text x="452" y="428" fill="#7fbf9f" opacity="0">
                <tspan fill="#5f6f65">› </tspan>tx c0d4…a7f1 detected (0-conf)
                <Show a={0.48} />
              </text>
              <text x="452" y="445" fill="#a7f3d0" opacity="0">
                <tspan fill="#5f6f65">› </tspan>confirmed · settled
                <Show a={0.7} />
              </text>
            </g>

            {/* ───── Network / explorer ───── */}
            <g filter="url(#wf-shadow)">
              <rect x="850" y="90" width="322" height="380" rx="16" fill="url(#wf-panel)" stroke="url(#wf-edge)" />
            </g>
            <path d="M851 134V107a16 16 0 0 1 16-16H1155a16 16 0 0 1 16 16V134Z" fill="url(#wf-head)" />
            <path d="M851 134H1171" stroke="#fff" strokeOpacity=".07" />
            <text x="870" y="116" fontSize="13" fontWeight="600" fill="#eef6f1">Bitcoin Cash Network</text>
            <rect x="1104" y="102" width="52" height="20" rx="10" fill="#0f2a1e" stroke="#34d399" strokeOpacity=".5" />
            <text x="1130" y="115" textAnchor="middle" fontFamily={MONO} fontSize="8.5" fontWeight="700" letterSpacing="1" fill="#a7f3d0">BCH</text>

            {/* Mempool */}
            <text x="870" y="158" fontFamily={MONO} fontSize="8.5" letterSpacing="1.8" fill="#6b7a71">MEMPOOL</text>
            <rect x="868" y="168" width="286" height="52" rx="10" fill="#0a110d" stroke="#fff" strokeOpacity=".08" />
            <text x="1011" y="198" textAnchor="middle" fontFamily={MONO} fontSize="9" fill="#55655b">
              waiting for transactions…
              <Show a={0.48} b={0.7} off="1" on="0" />
            </text>
            <g opacity="0">
              <Show a={0.48} b={0.7} />
              <circle cx="886" cy="194" r="4" fill="#d6a85c" />
              <text x="900" y="191" fontFamily={MONO} fontSize="11" fill="#eef6f1">c0d4…a7f1</text>
              <text x="900" y="207" fontFamily={MONO} fontSize="9" fill="#8a9a90">0.00042 BCH</text>
              <text x="1138" y="199" textAnchor="end" fontFamily={MONO} fontSize="8.5" letterSpacing="1" fill="#d6a85c">UNCONFIRMED</text>
            </g>

            <path d="M1011 224V240" stroke="#8fb5a1" strokeOpacity=".5" />
            <path d="M1006 236L1011 242L1016 236" fill="none" stroke="#8fb5a1" strokeOpacity=".5" />

            {/* Latest block */}
            <text x="870" y="258" fontFamily={MONO} fontSize="8.5" letterSpacing="1.8" fill="#6b7a71">LATEST BLOCK</text>
            <rect x="868" y="266" width="286" height="100" rx="12" fill="url(#wf-block)" stroke="#34d399" strokeOpacity=".28" />
            <text x="884" y="288" fontSize="13" fontWeight="600" fill="#eef6f1">Block 1</text>
            <text x="1138" y="288" textAnchor="end" fontFamily={MONO} fontSize="9" fill="#7c8f84">next block</text>
            <text x="884" y="304" fontFamily={MONO} fontSize="9.5" fill="#779b86">a3f9…c1e2 · 1,284 txs</text>
            <rect x="880" y="316" width="262" height="40" rx="8" fill="#08120d" stroke="#fff" strokeOpacity=".07" />
            <g opacity="0">
              <Show a={0.74} />
              <rect x="880" y="316" width="262" height="40" rx="8" fill="#0c2218" stroke="#34d399" strokeOpacity=".5" />
              <circle cx="899" cy="336" r="8" fill="#0f3d2a" stroke="#34d399" />
              <path d="M895 336l3 3.2 5.6-6.4" fill="none" stroke="#a7f3d0" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              <text x="915" y="333" fontFamily={MONO} fontSize="11" fill="#eef6f1">c0d4…a7f1</text>
              <text x="915" y="347" fontFamily={MONO} fontSize="9" fill="#8a9a90">0.00042 BCH</text>
              <text x="1132" y="340" textAnchor="end" fontFamily={MONO} fontSize="8.5" letterSpacing="1" fill="#6ee7b7">1 CONFIRMATION</text>
            </g>

            {/* Older blocks */}
            <g opacity=".72">
              <rect x="868" y="378" width="286" height="38" rx="10" fill="#0a110d" stroke="#fff" strokeOpacity=".07" />
              <text x="884" y="401" fontSize="12" fontWeight="600" fill="#d5e2da">Block 2</text>
              <text x="1138" y="401" textAnchor="end" fontFamily={MONO} fontSize="9" fill="#6f8377">7b21…4e9d · 1,197 txs</text>
            </g>
            <g opacity=".5">
              <rect x="868" y="424" width="286" height="38" rx="10" fill="#0a110d" stroke="#fff" strokeOpacity=".07" />
              <text x="884" y="447" fontSize="12" fontWeight="600" fill="#d5e2da">Block 3</text>
              <text x="1138" y="447" textAnchor="end" fontFamily={MONO} fontSize="9" fill="#6f8377">e5c8…09aa · 1,310 txs</text>
            </g>

            {/* ───── Moving data packets ───── */}
           
           
{WALLETS.map((w, i) => (
  <Packet
    key={w.name}
    path={`wf-p${i}`}
    dur={30}
    begin={i * 10}
    kp="0;1;1"
    kt="0;.12;1"
    splines=".4 0 .2 1;0 0 1 1"
    ov="0;1;1;0;0"
    ot="0;.02;.10;.12;1"
    color={w.color}
  />
))}
<Packet
  path="wf-chain"
  dur={10}
  begin={0}
  kp="0;0;1;1"
  kt="0;.56;.72;1"
  splines="0 0 1 1;.4 0 .2 1;0 0 1 1"
  ov="0;0;1;1;0;0"
  ot="0;.56;.58;.70;.72;1"
  color="#34d399"
/>

            {/* Footer line */}
            <path d="M28 492H1172" stroke="#fff" strokeOpacity=".08" />
            <text x="28" y="518" fontFamily={MONO} fontSize="9" letterSpacing="1.5" fill="#607267">LIVE PAYMENT FLOW · ILLUSTRATIVE DATA</text>
            <text x="1172" y="518" textAnchor="end" fontFamily={MONO} fontSize="9" letterSpacing="1.5" fill="#607267">BITCOIN CASH · BCH</text>
          </svg>
        </div>

        <p className="mt-3 text-center text-xs text-gray-500 md:hidden">
          Swipe sideways to explore the payment flow →
        </p>
      </div>
    </section>
  );
}