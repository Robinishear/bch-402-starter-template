import {
  decodeHdPublicKey,
  deriveHdPathRelative,
  publicKeyToP2pkhCashAddress,
} from "@bitauth/libauth";
import { ChainClient, Payment } from "./chain.interface";
import { envVars } from "../../config/env";
import { BATCH_SIZE, PREFIX, RECEIVE_CHAIN, REQUEST_TIMEOUT_MS } from "./chain.constants";


const bare = (a: string) => a.replace(/^bitcoincash:/i, "").toLowerCase();
const short = (a: string) => `${bare(a).slice(0, 10)}…`;

export const createRealChain = (): ChainClient => {
  if (envVars.BCH.BCH_NETWORK !== "mainnet") {
    throw new Error(
      "chain.real: only BCH_NETWORK=mainnet is supported (Blockchair has no BCH testnet)",
    );
  }
  const xpub = envVars.BCH.BCH_XPUB;
  if (!xpub || !/^xpub/i.test(xpub)) {
    throw new Error("chain.real: BCH_XPUB is missing or is not an xpub");
  }
  if (!envVars.BCH.CHAIN_API_URL) throw new Error("chain.real: CHAIN_API_URL is missing");

  const decoded: any = decodeHdPublicKey(xpub);
  if (typeof decoded === "string") {
    throw new Error(`chain.real: BCH_XPUB decode failed: ${decoded}`);
  }
  const node = decoded.node;

  const baseUrl = envVars.BCH.CHAIN_API_URL.replace(/\/+$/, "");
  const apiKey = process.env.BLOCKCHAIR_API_KEY; 
  const debug = Boolean(process.env.CHAIN_DEBUG);

  const deriveAddress = (index: number): string => {
    if (!Number.isInteger(index) || index < 0 || index >= 2 ** 31) {
      throw new Error("chain.real: invalid derivation index");
    }
    const child: any = deriveHdPathRelative(node, `${RECEIVE_CHAIN}/${index}`);
    if (typeof child === "string") throw new Error(`chain.real: derive failed: ${child}`);
    const out: any = publicKeyToP2pkhCashAddress({ publicKey: child.publicKey });
    const text = typeof out === "string" ? out : out?.address;
    if (typeof text !== "string") throw new Error("chain.real: address encode failed");
    return PREFIX + bare(text);
  };

  const first = deriveAddress(0);
  console.log(`[chain] REAL mode (mainnet). address #0 = ${short(first)}`);
  const expected0 = process.env.BCH_ADDRESS_0;
  if (expected0 && bare(expected0) !== bare(first)) {
    throw new Error("chain.real: BCH_ADDRESS_0 does not match address #0 derived from BCH_XPUB");
  }

  let warnedFormat = false;

  const fetchBatch = async (addresses: string[]): Promise<Record<string, Payment[]>> => {
    const byBare = new Map(addresses.map((a) => [bare(a), a]));
    const list = [...byBare.keys()].join(",");
    const keyPart = apiKey ? `&key=${encodeURIComponent(apiKey)}` : "";
    const url = `${baseUrl}/dashboards/addresses/${list}?limit=0,1000${keyPart}`;

    const res = await fetch(url, { signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) });
    if (!res.ok) throw new Error(`Blockchair HTTP ${res.status}`); 
    const json: any = await res.json();
    if (json?.context?.code !== 200) {
      throw new Error(`Blockchair code ${json?.context?.code}`);
    }

    const state = Number(json?.context?.state ?? 0);
    const utxos: any[] = Array.isArray(json?.data?.utxo) ? json.data.utxo : [];

    if (debug) {
      console.log("[chain][debug]", {
        state,
        cache: json?.context?.cache,
        requestCost: json?.context?.request_cost,
        returnedAddresses: Object.keys(json?.data?.addresses ?? {}).map(short),
        utxoCount: utxos.length,
      });
    }

    const sums = new Map<
      string,
      { address: string; txid: string; value: bigint; blockId: number }
    >();
    let unmatched = 0;

    for (const u of utxos) {
      const original =
        typeof u?.address === "string" ? byBare.get(bare(u.address)) : undefined;
      if (!original) {
        unmatched++;
        continue;
      }
      if (typeof u.transaction_hash !== "string" || !Number.isInteger(u.value)) continue;

      const key = `${original}|${u.transaction_hash}`;
      const prev = sums.get(key);
      sums.set(key, {
        address: original,
        txid: u.transaction_hash,
        value: (prev?.value ?? 0n) + BigInt(u.value),
        blockId: Number(u.block_id),
      });
    }

    if (unmatched > 0 && !warnedFormat) {
      warnedFormat = true;
      console.warn(
        `[chain] ${unmatched} output(s) came back with an address format I could not match. Run with CHAIN_DEBUG=1 and send me the debug line.`,
      );
    }

    const out: Record<string, Payment[]> = {};
    for (const s of sums.values()) {
      const confirmations = s.blockId > 0 && state > 0 ? Math.max(1, state - s.blockId + 1) : 0;
      (out[s.address] ??= []).push({ txid: s.txid, valueSats: s.value, confirmations });
    }
    return out;
  };

  const findPaymentsToMany = async (addresses: string[]) => {
    const result: Record<string, Payment[]> = {};
    const unique = [...new Set(addresses)];
    for (let i = 0; i < unique.length; i += BATCH_SIZE) {
      Object.assign(result, await fetchBatch(unique.slice(i, i + BATCH_SIZE)));
    }
    return result;
  };

  return { deriveAddress, findPaymentsToMany };
};