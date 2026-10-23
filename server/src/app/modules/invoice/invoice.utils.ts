
export const satsToBch = (sats: bigint) =>
  `${sats / 100000000n}.${(sats % 100000000n).toString().padStart(8, "0")}`;