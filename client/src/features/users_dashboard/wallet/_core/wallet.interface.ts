import { WalletManagerLike } from "./wallet.pay";

export type WalletPath = "receive" | "change";

export interface WalletScript {
  path: WalletPath;
  addressIndex: number;
  lockingBytecode: Uint8Array;
}

export interface WalletCoin extends WalletScript {
  txHash: string; 
  txPos: number;
  value: bigint;
}

export interface BuiltPayment {
  txHex: string;
  sourceOutputs: Record<string, unknown>[];
  inputPaths: [number, WalletPath, number][];
  feeSats: bigint;
  changeSats: bigint;
}

export class InsufficientFundsError extends Error {
  constructor(
    public readonly availableSats: bigint,
    public readonly requiredSats: bigint,
  ) {
    super("Not enough BCH in the connected wallet");
    this.name = "InsufficientFundsError";
  }
}


//% TODO wallet electrum 
export interface RawUtxo {
  tx_hash: string;
  tx_pos: number;
  value: number;
  height: number;
  token_data?: unknown;
}

export interface Utxo {
  txHash: string;
  txPos: number;
  value: bigint;
}

export interface Pending {
  resolve: (value: unknown) => void;
  reject: (error: Error) => void;
  timer: ReturnType<typeof setTimeout>;
}
// * DONE



export type PayStep = "looking" | "confirm" | "sent";

export interface PayArgs {
  manager: WalletManagerLike;
  payAddress: string;
  amountSats: string;
  amountBch: string;
  feature: string;
  signal?: AbortSignal;
  onStep?: (step: PayStep) => void;
  electrumUrl?: string;
}



export interface Props {
  payAddress: string;
  amountSats: string;
  amountBch: string;
  feature: string;
}



export interface BuildArgs {
  coins: WalletCoin[];
  payAddress: string;
  amountSats: bigint;
  changeLockingBytecode: Uint8Array;
}