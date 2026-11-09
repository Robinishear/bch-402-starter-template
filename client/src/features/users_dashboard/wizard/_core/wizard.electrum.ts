import { binToHex } from "@bitauth/libauth";
import { Pending, RawUtxo, Utxo } from "./wizard.interface";
import { ELECTRUM_WS_URL } from "./wizard.constants";


export class ElectrumClient {
  private nextId = 1;
  private pending = new Map<number, Pending>();

  private constructor(private ws: WebSocket) {
    ws.addEventListener("message", (event) => this.onMessage(String(event.data)));
    ws.addEventListener("close", () =>
      this.rejectAll(new Error("Connection to the blockchain server closed")),
    );
  }
  

  static connect(url = ELECTRUM_WS_URL, timeoutMs = 8000): Promise<ElectrumClient> {
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(url);
      const timer = setTimeout(() => {
        ws.close();
        reject(new Error("Timed out connecting to the blockchain server"));
      }, timeoutMs);

      ws.addEventListener("error", () => {
        clearTimeout(timer);
        reject(new Error("Could not reach the blockchain server"));
      });

      ws.addEventListener("open", async () => {
        clearTimeout(timer);
        const client = new ElectrumClient(ws);
        try {
          await client.request("server.version", ["bch402-gateway", "1.4"]);
          resolve(client);
        } catch (error) {
          ws.close();
          reject(error);
        }
      });
    });
  }

  request<T>(method: string, params: unknown[] = [], timeoutMs = 10000): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const id = this.nextId++;
      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error(`Blockchain server did not answer (${method})`));
      }, timeoutMs);

      this.pending.set(id, { resolve: resolve as (value: unknown) => void, reject, timer });
      this.ws.send(JSON.stringify({ jsonrpc: "2.0", id, method, params }));
    });
  }

  close() {
    this.rejectAll(new Error("Connection closed"));
    this.ws.close();
  }

  private onMessage(data: string) {
    let message: { id?: number; result?: unknown; error?: { message?: string } };
    try {
      message = JSON.parse(data);
    } catch {
      return;
    }
    if (typeof message.id !== "number") return; 
    const pending = this.pending.get(message.id);
    if (!pending) return;
    this.pending.delete(message.id);
    clearTimeout(pending.timer);

    if (message.error) {
      pending.reject(new Error(message.error.message ?? "Blockchain server error"));
    } else {
      pending.resolve(message.result);
    }
  }

  private rejectAll(error: Error) {
    for (const [id, pending] of this.pending) {
      clearTimeout(pending.timer);
      pending.reject(error);
      this.pending.delete(id);
    }
  }
}

export const toScriptHash = async (lockingBytecode: Uint8Array) => {
  const digest = await crypto.subtle.digest("SHA-256", new Uint8Array(lockingBytecode));
  return binToHex(new Uint8Array(digest).reverse());
};

export const fetchUtxos = async (
  client: ElectrumClient,
  lockingBytecode: Uint8Array,
): Promise<Utxo[]> => {
  const scriptHash = await toScriptHash(lockingBytecode);

  let raw: RawUtxo[];
  try {
    raw = await client.request<RawUtxo[]>("blockchain.scripthash.listunspent", [
      scriptHash,
      "exclude_tokens",
    ]);
  } catch {
    raw = await client.request<RawUtxo[]>("blockchain.scripthash.listunspent", [scriptHash]);
  }

  return raw
    .filter((u) => !u.token_data)
    .map((u) => ({ txHash: u.tx_hash, txPos: u.tx_pos, value: BigInt(u.value) }));
};

export const broadcastTransaction = (client: ElectrumClient, txHex: string) =>
  client.request<string>("blockchain.transaction.broadcast", [txHex]);