
import "dotenv/config";
import { ElectrumClient } from "@electrum-cash/network";

const address = process.env.BCH_ADDRESS_0;

if (!address) {
  throw new Error("BCH_ADDRESS_0 .env-এ নেই");
}

const servers = [
  "bch.imaginary.cash",
  "electroncash.de",
  "electroncash.dk",
  "electrum.imaginary.cash",
];

async function testServer(host: string): Promise<void> {
  const startedAt = Date.now();

  const electrum = new ElectrumClient(
    "bch402-gateway",
    "1.4.1",
    host,
  );

  try {
    console.log(`\n🔌 Connecting to ${host}...`);

    await electrum.connect();

    const result = await electrum.request(
      "blockchain.address.listunspent",
      [address],
    );

    if (result instanceof Error) {
      throw result;
    }

    console.log(`✅ Server: ${host}`);
    console.log(`⏱️ Response time: ${Date.now() - startedAt}ms`);
    console.log("📦 listunspent:", JSON.stringify(result, null, 2));
  } catch (error) {
    const message =
      error instanceof Error ? error.message : String(error);

    console.error(`❌ Server: ${host}`);
    console.error(`Reason: ${message}`);
  } finally {
    try {
      await electrum.disconnect();
    } catch {
      // Connection may not have been established.
    }
  }
}

async function main(): Promise<void> {
  for (const host of servers) {
    await testServer(host);
  }

  console.log("\n🏁 All server checks completed.");
}

main().catch((error) => {
  console.error("Unexpected error:", error);
  process.exitCode = 1;
});
