"use client";

import { createContext, useContext } from "react";
import { useWizardConnect } from "@wizardconnect/react";

type WalletContextValue = ReturnType<typeof useWizardConnect>;

const WalletContext = createContext<WalletContextValue | null>(null);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const wallet = useWizardConnect({ dappName: "BCH 402 AI Gateway" });

  return <WalletContext.Provider value={wallet}>{children}</WalletContext.Provider>;
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used inside <WalletProvider>");
  }
  return context;
}