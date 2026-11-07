"use client";

import { useEffect, useRef, useState } from "react";
import { InsufficientFundsError, PayStep, Props } from "../_core/wallet.interface";
import {  payWithWallet } from "../_core/wallet.pay";
import { useWallet } from "./WalletProvider";


const satsToBch = (sats: bigint) => (Number(sats) / 1e8).toFixed(8);

const toMessage = (error: unknown) => {
  if (error instanceof InsufficientFundsError) {
    return `Not enough BCH in your wallet. Needed about ${satsToBch(error.requiredSats)} BCH, found ${satsToBch(error.availableSats)} BCH.`;
  }
  if (error instanceof DOMException && error.name === "AbortError") {
    return "Payment cancelled.";
  }
  if (error instanceof Error) return error.message;
  return "Something went wrong. You can still pay with the QR code below.";
};

export default function PayWithWalletButton({ payAddress, amountSats, amountBch, feature }: Props) {
  const wallet = useWallet();
  const [step, setStep] = useState<PayStep | "idle">("idle");
  const [error, setError] = useState("");
  const controller = useRef<AbortController | null>(null);

  useEffect(() => () => controller.current?.abort("closed"), []);

  if (wallet.state !== "connected" || !wallet.manager) {
    return (
      <p className="text-xs text-gray-400">
        Connect a wallet (top right) to pay with one click, or scan the QR code below.
      </p>
    );
  }

  const manager = wallet.manager;

  const pay = async () => {
    setError("");
    controller.current = new AbortController();
    try {
      await payWithWallet({
        manager,
        payAddress,
        amountSats,
        amountBch,
        feature,
        signal: controller.current.signal,
        onStep: setStep,
      });
    } catch (e) {
      setError(toMessage(e));
      setStep("idle");
    }
  };

  return (
    <div className="space-y-2">
      {step === "idle" && (
        <button
          type="button"
          onClick={pay}
          className="w-full rounded-lg bg-orange-500 px-4 py-2 font-semibold text-black"
        >
          Pay with {wallet.walletName ?? "wallet"}
        </button>
      )}

      {step === "looking" && <p className="text-sm text-gray-300">Looking up your coins...</p>}

      {step === "confirm" && (
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-gray-300">Confirm the payment in your wallet...</p>
          <button
            type="button"
            onClick={() => controller.current?.abort("Cancelled")}
            className="text-sm text-gray-400 hover:text-white"
          >
            Cancel
          </button>
        </div>
      )}

      {step === "sent" && (
        <p className="text-sm text-emerald-300">Sent ✓ Waiting for the network to confirm...</p>
      )}

      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}