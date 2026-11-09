import { publicKeyToP2pkhLockingBytecode } from "@bitauth/libauth";
import { broadcastTransaction, ElectrumClient } from "./wizard.electrum";
import { buildPayment } from "./wizard.payment";
import { scanWallet } from "./wizard.scan";
import { PayArgs } from "./wizard.interface";

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

  const getPubkey = (childIndex: number, index: bigint) => manager.getPubkey(childIndex, index);

  if (!getPubkey(0, BigInt(0))) {
    throw new Error("Your wallet did not share its keys. Please reconnect your wallet.");
  }

  const client = await ElectrumClient.connect(electrumUrl);
  try {
    const { coins, lastUsed } = await scanWallet(client, getPubkey);

    const changePublicKey =
      getPubkey(1, BigInt(lastUsed.change + 1)) ?? getPubkey(1, BigInt(0));
    if (!changePublicKey) {
      throw new Error("Your wallet did not share its change key. Please reconnect your wallet.");
    }

    
    const built = buildPayment({
      coins,
      payAddress,
      amountSats: BigInt(amountSats),
      changeLockingBytecode: publicKeyToP2pkhLockingBytecode({ publicKey: changePublicKey }),
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