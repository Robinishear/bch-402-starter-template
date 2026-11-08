
export const ELECTRUM_WS_URL =
  process.env.NEXT_PUBLIC_ELECTRUM_WS_URL ?? "wss://bch.imaginary.cash:50004";

export const GAP_LIMIT = 20;
export const MAX_SCAN = 500;
export const BATCH = 25;

export const SCAN_WINDOW = 20; 
export const DUST_SATS = BigInt(546);
export const FEE_RATE = 1.1;  
export const INPUT_BYTES = 150;
export const OUTPUT_BYTES = 34; 
export const OVERHEAD_BYTES = 10;

export const SLOW_AFTER_MS = 8000;
