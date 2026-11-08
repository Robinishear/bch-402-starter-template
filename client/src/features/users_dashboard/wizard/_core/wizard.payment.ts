import {
  binToHex,
  cashAddressToLockingBytecode,
  encodeTransaction,
  hexToBin,
  publicKeyToP2pkhLockingBytecode,
} from "@bitauth/libauth";
import {
    BuildArgs,
  BuiltPayment,
  InsufficientFundsError,
  WalletCoin,
  WalletPath,
  WalletScript,
} from "./wizard.interface";
import { DUST_SATS, FEE_RATE, INPUT_BYTES, OUTPUT_BYTES, OVERHEAD_BYTES } from "./wizard.constants";

const CHILD_INDEX: Record<WalletPath, number> = { receive: 0, change: 1 };


export const estimateFee = (inputs: number, outputs: number) =>
  BigInt(Math.ceil((OVERHEAD_BYTES + INPUT_BYTES * inputs + OUTPUT_BYTES * outputs) * FEE_RATE));

// export const deriveWalletScripts = (
//   getPubkey: (childIndex: number, index: bigint) => Uint8Array | undefined,
//   window = SCAN_WINDOW,
// ): WalletScript[] => {
//   const scripts: WalletScript[] = [];
//   for (const path of ["receive", "change"] as WalletPath[]) {
//     for (let i = 0; i < window; i++) {
//       const publicKey = getPubkey(CHILD_INDEX[path], BigInt(i));
//       if (!publicKey) continue;
//       scripts.push({
//         path,
//         addressIndex: i,
//         lockingBytecode: publicKeyToP2pkhLockingBytecode({ publicKey }),
//       });
//     }
//   }
//   return scripts;
// };

export const payAddressToLockingBytecode = (payAddress: string) => {
  const address = payAddress.includes(":") ? payAddress : `bitcoincash:${payAddress}`;
  const decoded = cashAddressToLockingBytecode(address);
  if (typeof decoded === "string") throw new Error(`Invalid payment address: ${decoded}`);
  return decoded.bytecode;
};

export const buildPayment = ({
  coins,
  payAddress,
  amountSats,
  changeLockingBytecode,
}: BuildArgs): BuiltPayment => {
  const payLockingBytecode = payAddressToLockingBytecode(payAddress);

  const sorted = [...coins].sort((a, b) => (a.value < b.value ? 1 : a.value > b.value ? -1 : 0));
  const total = sorted.reduce((sum, c) => sum + c.value, BigInt(0));

  const picked: WalletCoin[] = [];
  let pickedTotal = BigInt(0);
  for (const coin of sorted) {
    picked.push(coin);
    pickedTotal += coin.value;
    if (pickedTotal >= amountSats + estimateFee(picked.length, 2)) break;
  }

  const feeWithChange = estimateFee(picked.length, 2);
  const feeNoChange = estimateFee(picked.length, 1);

  if (pickedTotal < amountSats + feeNoChange) {
    throw new InsufficientFundsError(total, amountSats + estimateFee(Math.max(sorted.length, 1), 1));
  }

  const rawChange = pickedTotal - amountSats - feeWithChange;
  const hasChange = rawChange >= DUST_SATS;
  const changeSats = hasChange ? rawChange : BigInt(0);
  const feeSats = hasChange ? feeWithChange : pickedTotal - amountSats; 

  const outputs = [{ lockingBytecode: payLockingBytecode, valueSatoshis: amountSats }];
  if (hasChange) outputs.push({ lockingBytecode: changeLockingBytecode, valueSatoshis: changeSats });

  const inputs = picked.map((coin) => ({
    outpointTransactionHash: hexToBin(coin.txHash),
    outpointIndex: coin.txPos,
    unlockingBytecode: new Uint8Array(),
    sequenceNumber: 0xffffffff,
  }));

  const txHex = binToHex(encodeTransaction({ version: 2, locktime: 0, inputs, outputs }));

  const sourceOutputs = picked.map((coin) => ({
    outpointTransactionHash: coin.txHash,
    outpointIndex: coin.txPos,
    unlockingBytecode: "",
    sequenceNumber: 0xffffffff,
    valueSatoshis: `<bigint: ${coin.value}n>`,
    lockingBytecode: binToHex(coin.lockingBytecode),
  }));

  const inputPaths = picked.map((coin, i) => [i, coin.path, coin.addressIndex] as [number, WalletPath, number]);

  return { txHex, sourceOutputs, inputPaths, feeSats, changeSats };
};