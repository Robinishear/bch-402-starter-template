import { InvoiceService } from "../app/modules/invoice/invoice.service";

(async () => {
  const [userId] = process.argv.slice(2); 
  const inv = await InvoiceService.createInvoice(userId, { feature: "market-insight", input: "Bitcoin Cash" });
  // await InvoiceService.simulatePayment(inv.id);
  await InvoiceService.markPaid(inv.id, "script-tx-" + Date.now());
  const [a, b] = await Promise.all([
    InvoiceService.run(userId, inv.id),
    InvoiceService.run(userId, inv.id),
  ]);
  console.log("একই ফল:", a.result === b.result);
  process.exit(0);
})().catch((e) => { console.error(e.message); process.exit(1); });