import { broadcastTransaction, ElectrumClient, fetchUtxos } from "./wallet.electrum";
import { WalletCoin } from "./wallet.interface";
import { buildPayment, deriveWalletScripts } from "./wallet.payment";
import { PayArgs } from "./wallet.interface";

export interface WalletManagerLike {
  getPubkey(childIndex: number, index: bigint): Uint8Array | undefined;
  signTransaction(
    request: {
      transaction: {
        transaction: string;
        sourceOutputs: any[];
        userPrompt?: string;
        broadcast?: boolean;
      };
      inputPaths: [number, string, number][];
    },
    options?: { signal?: AbortSignal },
  ): Promise<{ signedTransaction: string; error?: string }>;
}

export const payWithWallet = async ({
  manager,
  payAddress,
  amountSats,
  amountBch,
  feature,
  signal,
  onStep,
  electrumUrl,
}: PayArgs) => {
  onStep?.("looking");

  const scripts = deriveWalletScripts((childIndex, index) => manager.getPubkey(childIndex, index));
  if (scripts.length === 0) {
    throw new Error("Your wallet did not share its keys. Please reconnect your wallet.");
  }
  const changeScript =
    scripts.find((s) => s.path === "change" && s.addressIndex === 0) ?? scripts[0];

  const client = await ElectrumClient.connect(electrumUrl);
  try {
    const coins: WalletCoin[] = [];
    await Promise.all(
      scripts.map(async (script) => {
        const utxos = await fetchUtxos(client, script.lockingBytecode);
        for (const utxo of utxos) coins.push({ ...script, ...utxo });
      }),
    );

    const built = buildPayment({
      coins,
      payAddress,
      amountSats: BigInt(amountSats),
      changeLockingBytecode: changeScript.lockingBytecode,
    });

    onStep?.("confirm");
    const response = await manager.signTransaction(
      {
        transaction: {
          transaction: built.txHex,
          sourceOutputs: built.sourceOutputs,
          userPrompt: `Pay ${amountBch} BCH for ${feature.replace(/-/g, " ")}`,
          broadcast: true,
        },
        inputPaths: built.inputPaths,
      },
      { signal },
    );

    if (response.error) throw new Error(response.error);

    if (response.signedTransaction) {
      await broadcastTransaction(client, response.signedTransaction).catch(() => undefined);
    }

    onStep?.("sent");
    return { signedTransaction: response.signedTransaction, feeSats: built.feeSats };
  } finally {
    client.close();
  }
};