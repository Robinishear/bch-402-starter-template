"use client";

import { WizardConnectQRDialog } from "@wizardconnect/react";
import { useWallet } from "./WalletProvider";

export default function ConnectWalletButton() {
  const wallet = useWallet();

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

  const waiting = wallet.state === "connecting" || wallet.state === "reconnecting";

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