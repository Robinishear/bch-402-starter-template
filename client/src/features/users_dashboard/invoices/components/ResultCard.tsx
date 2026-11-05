import { RunResult } from "../_core/invoices_interface";

const isRealTxid = (txid: string) => /^[0-9a-f]{64}$/i.test(txid);

export default function ResultCard({ result }: { result: RunResult }) {
  return (
    <div className="space-y-3 rounded-xl border p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-bold capitalize">{result.feature.replace(/-/g, " ")}</h3>
        <span className="text-xs text-gray-400">{result.tokens} tokens</span>
      </div>

      <p className="whitespace-pre-wrap text-sm leading-relaxed">{result.result}</p>

      {result.txid && isRealTxid(result.txid) && (
        <a
          href={`https://blockchair.com/bitcoin-cash/transaction/${result.txid}`}
          target="_blank"
          rel="noreferrer"
          className="text-xs text-orange-400"
        >
          View payment transaction
        </a>
      )}
    </div>
  );
}