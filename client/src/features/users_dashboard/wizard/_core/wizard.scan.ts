import { publicKeyToP2pkhLockingBytecode } from "@bitauth/libauth";
import { ElectrumClient, fetchUtxos, toScriptHash } from "./wizard.electrum";
import { Utxo, WalletCoin, WalletPath } from "./wizard.interface";
import { BATCH, GAP_LIMIT, MAX_SCAN } from "./wizard.constants";

const CHILD_INDEX: Record<WalletPath, number> = { receive: 0, change: 1 };

export interface ScanResult {
  coins: WalletCoin[];
  lastUsed: Record<WalletPath, number>; 
  scanned: number;
}

type GetPubkey = (childIndex: number, index: bigint) => Uint8Array | undefined;

export const scanWallet = async (
  client: ElectrumClient,
  getPubkey: GetPubkey,
  { gapLimit = GAP_LIMIT, maxScan = MAX_SCAN, batch = BATCH } = {},
): Promise<ScanResult> => {
  const coins: WalletCoin[] = [];
  const lastUsed: Record<WalletPath, number> = { receive: -1, change: -1 };
  let scanned = 0;

  for (const path of ["receive", "change"] as WalletPath[]) {
    let gap = 0;

    for (let start = 0; start < maxScan && gap < gapLimit; start += batch) {
      const indices = Array.from({ length: Math.min(batch, maxScan - start) }, (_, k) => start + k);

      const results = await Promise.all(
        indices.map(async (addressIndex) => {
          const publicKey = getPubkey(CHILD_INDEX[path], BigInt(addressIndex));
          if (!publicKey) return { addressIndex, used: false, utxos: [] as Utxo[], lockingBytecode: new Uint8Array() };

          const lockingBytecode = publicKeyToP2pkhLockingBytecode({ publicKey });
          const scriptHash = await toScriptHash(lockingBytecode);

          const status = await client.request<string | null>("blockchain.scripthash.get_status", [scriptHash]);
          const used = status !== null;
          const utxos = used ? await fetchUtxos(client, lockingBytecode) : [];
          return { addressIndex, used, utxos, lockingBytecode };
        }),
      );

      scanned += results.length;
      for (const result of results) {
        if (result.used) {
          gap = 0;
          lastUsed[path] = result.addressIndex;
        } else {
          gap++;
        }
        for (const utxo of result.utxos) {
          coins.push({ path, addressIndex: result.addressIndex, lockingBytecode: result.lockingBytecode, ...utxo });
        }
      }
    }
  }

  return { coins, lastUsed, scanned };
};