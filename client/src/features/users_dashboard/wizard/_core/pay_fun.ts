import { InsufficientFundsError } from "./wizard.interface";


export const satsToBch = (sats: bigint) => (Number(sats) / 1e8).toFixed(8);

export const toMessage = (error: unknown) => {
  if (error instanceof InsufficientFundsError) {
    return `Not enough BCH in your wallet. Needed about ${satsToBch(error.requiredSats)} BCH, found ${satsToBch(error.availableSats)} BCH.`;
  }
  if (error instanceof DOMException && error.name === "AbortError") {
    return "Payment cancelled.";
  }
  if (error instanceof Error) return error.message;
  return "Something went wrong. You can still pay with the QR code below.";
};