// import { publicKeyToP2pkhCashAddress } from "@bitauth/libauth";
// import { ELECTRUM_WS_URL, ElectrumClient } from "./wallet.electrum";
// import { WalletManagerLike } from "./wallet.pay";
// import { scanWallet } from "./scan";

// const MAINNET_GENESIS_HEADER =
//   "0100000000000000000000000000000000000000000000000000000000000000000000003ba3edfd7a7b12b27ac72c3e67768f617fc81bc3888a51323a9fb8aa4b1e5e4a29ab5f49ffff001d1dac2b7c";

// export const debugWallet = async (manager: WalletManagerLike) => {
//   const addressAt = (childIndex: number, index: number) => {
//     const publicKey = manager.getPubkey(childIndex, BigInt(index));
//     if (!publicKey) return "(wallet shared no key)";
//     return (publicKeyToP2pkhCashAddress({ publicKey }) as { address: string }).address;
//   };

//   const client = await ElectrumClient.connect();


//   try {
//     const genesis = await client.request<string>("blockchain.block.header", [0]);
//     const tip = await client.request<{ height: number }>("blockchain.headers.subscribe");
//     const scan = await scanWallet(client, (childIndex, index) => manager.getPubkey(childIndex, index));

//     const totalSats = scan.coins.reduce((sum, coin) => sum + coin.value, BigInt(0));

//     return {
//       server: ELECTRUM_WS_URL,
//       isMainnet: genesis === MAINNET_GENESIS_HEADER,
//       chainHeight: tip.height,
//       addressesScanned: scan.scanned,
//       lastUsedReceiveIndex: scan.lastUsed.receive,
//       lastUsedChangeIndex: scan.lastUsed.change,
//       nextChangeAddress: addressAt(1, scan.lastUsed.change + 1),
//       coinsFound: scan.coins.length,
//       totalSatsFound: totalSats.toString(),
//       coins: scan.coins.map((c) => `${c.path}#${c.addressIndex}: ${c.value} sats`),
//     };
//   } finally {
//     client.close();
//   }
// };