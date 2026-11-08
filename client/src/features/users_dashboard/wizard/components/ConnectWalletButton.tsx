"use client";

import { useEffect, useState } from "react";
import { WizardConnectQRDialog } from "@wizardconnect/react";
import { useWallet } from "./WalletProvider";
import { SLOW_AFTER_MS } from "../_core/wizard.constants";


export default function ConnectWalletButton() {
  const wallet = useWallet();
  const [slow, setSlow] = useState(false);

  const waiting = wallet.state === "connecting" || wallet.state === "reconnecting";
  const isReconnecting = waiting && !wallet.uri;

  useEffect(() => {
    if (!isReconnecting) {
      setSlow(false);
      return;
    }
    const timer = setTimeout(() => setSlow(true), SLOW_AFTER_MS);
    return () => clearTimeout(timer);
  }, [isReconnecting]);

  if (wallet.state === "connected") {
    return (
      <div className="flex items-center gap-3 text-sm">
        <span className="text-emerald-300">Connected: {wallet.walletName ?? "Wallet"}</span>
        <button
          type="button"
          onClick={() => wallet.disconnect()}
          className="text-gray-400 hover:text-white"
        >
          Disconnect
        </button>
      </div>
    );
  }

  if (isReconnecting) {
    return (
      <div className="space-y-1 text-right text-sm">
        <div className="flex items-center justify-end gap-3">
          <span className="text-orange-300">
            Reconnecting to {wallet.walletName ?? "your wallet"}...
          </span>
          <button
            type="button"
            onClick={() => wallet.disconnect()}
            className="text-gray-400 underline hover:text-white"
          >
            Cancel
          </button>
        </div>
        {slow && (
          <p className="text-xs text-gray-400">
            No answer yet. Open your wallet app and keep it on screen, or press Cancel and connect again.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => wallet.connect()}
        disabled={waiting}
        className="rounded-lg border border-orange-500/50 px-4 py-2 text-sm font-semibold text-orange-300 hover:bg-orange-500/10 disabled:opacity-60"
      >
        {waiting ? "Waiting for wallet..." : "Connect Wallet"}
      </button>

      {wallet.error && <p className="text-xs text-red-400">{wallet.error}</p>}

      {wallet.uri && wallet.qrUri && (
        <WizardConnectQRDialog
          show={wallet.state === "connecting"}
          onClose={() => wallet.disconnect()}
          uri={wallet.uri}
          qrUri={wallet.qrUri}
        />
      )}
    </div>
  );
}