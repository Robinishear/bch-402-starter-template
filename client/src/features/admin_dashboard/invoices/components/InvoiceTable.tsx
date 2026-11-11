import { AdminInvoice, InvoiceStatus } from "../_core/invoice.interface";

const STATUS_STYLE: Record<InvoiceStatus, string> = {
  PENDING: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  PAID: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  COMPLETED: "border-cyan-500/30 bg-cyan-500/10 text-cyan-300",
  EXPIRED: "border-gray-500/30 bg-gray-500/10 text-gray-300",
  UNDERPAID: "border-red-500/30 bg-red-500/10 text-red-300",
};

const isRealTxid = (txid: string) => /^[0-9a-f]{64}$/i.test(txid);

const formatUsd = (cents: number) => `$${(cents / 100).toFixed(2)}`;
const formatSats = (sats: string) => Number(sats).toLocaleString("en-US");
const formatDate = (iso: string) =>
  new Date(iso).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" });

export default function InvoiceTable({ invoices }: { invoices: AdminInvoice[] }) {
  if (invoices.length === 0) {
    return (
      <div className="rounded-xl border border-white/10 p-8 text-center text-sm text-gray-400">
        No invoices found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-white/10">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-400">
          <tr>
            <th className="px-4 py-3">Created</th>
            <th className="px-4 py-3">User</th>
            <th className="px-4 py-3">Feature</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Amount</th>
            <th className="px-4 py-3">Transaction</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {invoices.map((invoice) => (
            <tr key={invoice.id} className="hover:bg-white/2">
              <td className="whitespace-nowrap px-4 py-3 text-gray-300">
                {formatDate(invoice.createdAt)}
              </td>
              <td className="px-4 py-3">
                {invoice.user ? (
                  <>
                    <p className="font-medium text-white">{invoice.user.name}</p>
                    <p className="text-xs text-gray-400">{invoice.user.email}</p>
                  </>
                ) : (
                  <>
                    <p className="font-medium text-gray-300">Anonymous</p>
                    <p className="text-xs text-gray-500">Public API (no login)</p>
                  </>
                )}
              </td>
              <td className="px-4 py-3 capitalize text-gray-200">
                {invoice.feature.replace(/-/g, " ")}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLE[invoice.status]}`}
                >
                  {invoice.status}
                </span>
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                <p className="font-medium text-white">{formatUsd(invoice.priceUsdCents)}</p>
                <p className="text-xs text-gray-400">{formatSats(invoice.amountSats)} sats</p>
              </td>
              <td className="px-4 py-3">
                {invoice.txid ? (
                  isRealTxid(invoice.txid) ? (
                    <a
                      href={`https://blockchair.com/bitcoin-cash/transaction/${invoice.txid}`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono text-xs text-orange-400 hover:underline"
                    >
                      {invoice.txid.slice(0, 8)}…{invoice.txid.slice(-6)}
                    </a>
                  ) : (
                    <span className="font-mono text-xs text-gray-400">{invoice.txid}</span>
                  )
                ) : (
                  <span className="text-xs text-gray-500">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}