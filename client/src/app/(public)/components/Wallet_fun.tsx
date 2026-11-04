export const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';

export const WALLETS = [
  { name: 'Electron Cash', sub: 'Desktop wallet', color: '#3ddc97', icon: 'bolt', addr: 'qz8f…k3m2' },
  { name: 'Selene Wallet', sub: 'BCH wallet', color: '#7dd3fc', icon: 'moon', addr: 'qz8f…k3m2' },
  { name: 'Bitcoin.com Wallet', sub: 'Multichain wallet', color: '#0ac18e', icon: 'b', addr: 'qz8f…k3m2' },
] as const;

export const CARD_Y = [90, 224, 358];

export const ROWS = [
  { label: 'Invoice matched', time: 't+0', a: 0.4 },
  { label: 'Payment detected · 0-conf', time: '+0.4 s', a: 0.48 },
  { label: 'Transaction verified', time: '+1.2 s', a: 0.58 },
  { label: 'Confirmed in block', time: 'next block', a: 0.7 },
];

export function Show({
  a,
  b = 0.95,
  attr = 'opacity',
  off = '0',
  on = '1',
}: {
  a: number;
  b?: number;
  attr?: string;
  off?: string;
  on?: string;
}) {
  const kt = `0;${a};${(a + 0.03).toFixed(2)};${b};${(b + 0.03).toFixed(2)};1`;
  return (
    <animate
      attributeName={attr}
      values={`${off};${off};${on};${on};${off};${off}`}
      keyTimes={kt}
      dur="5s"
      repeatCount="indefinite"
    />
  );
}

export function Slot({ attr, off, on, begin }: { attr: string; off: string; on: string; begin: number }) {
  return (
    <animate
      attributeName={attr}
      values={`${off};${off};${on};${on};${off};${off}`}
      keyTimes="0;.04;.07;.30;.33;1"
      dur="15s"
      begin={`${begin}s`}
      repeatCount="indefinite"
    />
  );
}

export function Packet({
  path,
  dur,
  begin,
  kp,
  kt,
  splines,
  ov,
  ot,
  color,
}: {
  path: string;
  dur: number;
  begin: number;
  kp: string;
  kt: string;
  splines: string;
  ov: string;
  ot: string;
  color: string;
}) {
  return (
    <g opacity="0">
      <animateMotion
        dur={`${dur}s`}
        begin={`${begin}s`}
        repeatCount="indefinite"
        calcMode="spline"
        keyPoints={kp}
        keyTimes={kt}
        keySplines={splines}
      >
        <mpath href={`#${path}`} />
      </animateMotion>
      <animate attributeName="opacity" values={ov} keyTimes={ot} dur={`${dur}s`} begin={`${begin}s`} repeatCount="indefinite" />
      <rect x="-34" y="-9" width="68" height="18" rx="9" fill="#07110c" stroke={color} strokeOpacity=".85" />
      <text y="3.2" textAnchor="middle" fontFamily={MONO} fontSize="8.5" fill="#e7f5ec">
        0.00042 BCH
      </text>
    </g>
  );
}

export function WalletIcon({ kind, color }: { kind: string; color: string }) {
  if (kind === 'bolt')
    return (
      <g>
        <circle r="11" fill="none" stroke={color} strokeWidth="1.6" />
        <polygon points="1.5,-7 -4.5,1.5 -0.5,1.5 -2,7 4.5,-2 0.5,-2" fill={color} />
      </g>
    );
  if (kind === 'moon') return <path d="M2,-9 A9,9 0 1 0 2,9 A7,7 0 1 1 2,-9 Z" fill={color} />;
  return (
    <g>
      <circle r="11" fill={color} />
      <g transform="rotate(14)">
        <text y="5" fontSize="14" fontWeight="800" textAnchor="middle" fill="#04110b">
          B
        </text>
      </g>
    </g>
  );
}