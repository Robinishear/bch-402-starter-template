import { ElectrumClient } from "@electrum-cash/network";
import {
  decodeHdPublicKey,
  deriveHdPathRelative,
  publicKeyToP2pkhCashAddress,
} from "@bitauth/libauth";
import { envVars } from "../../config/env";
import { ChainClient, Payment } from "./chain.interface";
import { CONNECT_TIMEOUT_MS, DEFAULT_SERVERS, PREFIX, PROTOCOL_VERSION, RECEIVE_CHAIN, REQUEST_TIMEOUT_MS } from "./chain.constants";

type Client = InstanceType<typeof ElectrumClient>;


const bare = (a: string) => a.replace(/^bitcoincash:/i, "").toLowerCase();
const short = (a: string) => `${bare(a).slice(0, 10)}…`;

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
    promise.then(
      (v) => {
        clearTimeout(timer);
        resolve(v);
      },
      (e) => {
        clearTimeout(timer);
        reject(e);
      },
    );
  });
}

export const createRealChain = (): ChainClient => {
  if (envVars.BCH.BCH_NETWORK !== "mainnet") {
    throw new Error("chain.real: only BCH_NETWORK=mainnet is supported");
  }
  const xpub = envVars.BCH.BCH_XPUB;
  if (!xpub || !/^xpub/i.test(xpub)) {
    throw new Error("chain.real: BCH_XPUB is missing or is not an xpub");
  }

  const decoded: any = decodeHdPublicKey(xpub);
  if (typeof decoded === "string") {
    throw new Error(`chain.real: BCH_XPUB decode failed: ${decoded}`);
  }
  const node = decoded.node;
  const debug = Boolean(process.env.CHAIN_DEBUG);

  const configured = (process.env.ELECTRUM_SERVERS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const servers = configured.length > 0 ? configured : DEFAULT_SERVERS;


  // ---------- Creating an Address ----------
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

// Security: Whether address #0 is the first address of your Selene
  const first = deriveAddress(0);
  console.log(`[chain] REAL mode (mainnet, Electrum). address #0 = ${short(first)}`);

  // const expected0 = process.env.BCH_ADDRESS_0;
  // if (expected0 && bare(expected0) !== bare(first)) {
  //   throw new Error("chain.real: BCH_ADDRESS_0 does not match address #0 derived from BCH_XPUB");
  // }

    const check = process.env.BCH_CHECK_ADDRESS ?? process.env.BCH_ADDRESS_0;
  if (check) {
    const target = bare(check);
    let found = false;
    for (let i = 0; i < 50 && !found; i++) {
      found = bare(deriveAddress(i)) === target;
    }
    if (!found) {
      throw new Error(
        "chain.real: the check address is not among the first 50 addresses derived from BCH_XPUB (wrong xpub?)",
      );
    }
  }

// ---------- Connection (via server) ----------
  let client: Client | null = null;
  let currentHost = "";
  let connecting: Promise<Client> | null = null;
  let nextServer = 0;

  const dropClient = async () => {
    const c = client;
    client = null;
    if (c) {
      try {
        await c.disconnect();
      } catch {
      }
    }
  };

  const connect = (): Promise<Client> => {
    if (client) return Promise.resolve(client);
    if (connecting) return connecting;

    connecting = (async () => {
      for (let i = 0; i < servers.length; i++) {
        const idx = (nextServer + i) % servers.length;
        const host = servers[idx];
        const c = new ElectrumClient("bch402-gateway", PROTOCOL_VERSION, host);
        try {
          await withTimeout(c.connect(), CONNECT_TIMEOUT_MS, `connect ${host}`);
          client = c;
          currentHost = host;
          nextServer = idx;
          console.log(`[chain] connected to Electrum server ${host}`);
          return c;
        } catch (e) {
          console.warn(`[chain] ${host} unavailable: ${(e as Error).message}`);
          try {
            await c.disconnect();
          } catch {
          }
        }
      }
      throw new Error("no Electrum server reachable");
    })().finally(() => {
      connecting = null;
    });

    return connecting;
  };

  const findPaymentsToMany = async (addresses: string[]) => {
    const unique = [...new Set(addresses)];
    const out: Record<string, Payment[]> = {};
    if (unique.length === 0) return out;

    const c = await connect();
    try {
      const entries = await Promise.all(
        unique.map(async (address) => {
          const res = await withTimeout(
            c.request("blockchain.address.listunspent", address),
            REQUEST_TIMEOUT_MS,
            "listunspent",
          );
          if (res instanceof Error) throw res;
          if (!Array.isArray(res)) throw new Error("unexpected listunspent response");
          return [address, res as any[]] as const;
        }),
      );

      for (const [address, utxos] of entries) {
        const perTx = new Map<string, { value: bigint; height: number }>();
        for (const u of utxos) {
          if (typeof u?.tx_hash !== "string" || !Number.isInteger(u?.value)) continue;
          const prev = perTx.get(u.tx_hash);
          perTx.set(u.tx_hash, {
            value: (prev?.value ?? 0n) + BigInt(u.value),
            height: Number(u.height ?? 0),
          });
        }
        if (perTx.size > 0) {
          out[address] = [...perTx.entries()].map(([txid, v]) => ({
            txid,
            valueSats: v.value,
            confirmations: v.height > 0 ? 1 : 0,
          }));
        }
      }

      if (debug) {
        console.log("[chain][debug]", {
          server: currentHost,
          addresses: unique.length,
          withPayments: Object.keys(out).length,
        });
      }
      return out;
    } catch (e) {
      await dropClient(); 
      nextServer = (nextServer + 1) % servers.length;
      throw e;
    }
  };

  return { deriveAddress, findPaymentsToMany };
};