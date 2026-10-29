import "dotenv/config";
import { createRealChain } from "../app/modules/chain/chain.real";

(async () => {
  const chain = createRealChain();
  const count = Math.min(20, Math.max(1, Number(process.argv[2]) || 3));
  const addresses = Array.from({ length: count }, (_, i) => chain.deriveAddress(i));

  const t0 = Date.now();
  const found = await chain.findPaymentsToMany(addresses);
  console.log(`\nBlockchair responded in ${Date.now() - t0}ms`);

  addresses.forEach((a, i) => {
    const list = found[a] ?? [];
    console.log(`#${i}  ${a.slice(0, 24)}…  ${list.length === 0 ? "→ No payments found" : ""}`);
    for (const p of list) {
      console.log(
        `      tx ${p.txid.slice(0, 16)}…  ${p.valueSats} sats  Confirmations: ${p.confirmations}`,
      );
    }
  });
  process.exit(0);
})().catch((e) => {
  console.error("ERROR:", e.message);
  process.exit(1);
});