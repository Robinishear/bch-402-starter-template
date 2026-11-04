"use client";

import { useState } from "react";
import { Invoice } from "../_core/invoices_interface";
import QrCode from "./QrCode";

interface Props {
  invoice: Invoice;
  onClose: () => void;
}

export default function PayModal({ invoice, onClose }: Props) {
  const [copied, setCopied] = useState(false);

  const copyAddress = async () => {
    await navigator.clipboard.writeText(invoice.payAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md space-y-4 rounded-xl border bg-[#0c0710] p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Pay with Bitcoin Cash</h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>

        <div>
          <p className="text-sm text-gray-400">Send exactly</p>
          <p className="text-2xl font-bold">{invoice.amountBch} BCH</p>
          <p className="text-xs text-gray-400">
            {invoice.amountSats} sats · ${(invoice.priceUsdCents / 100).toFixed(2)}
          </p>
        </div>
<QrCode address={invoice.payAddress} amountBch={invoice.amountBch} />
        <div>
          <p className="text-sm text-gray-400">To this address</p>
          <code className="block break-all rounded-md border p-2 text-xs">{invoice.payAddress}</code>
          <button type="button" onClick={copyAddress} className="mt-2 text-sm text-orange-400">
            {copied ? "Copied!" : "Copy address"}
          </button>
        </div>

        <p className="text-xs text-gray-400">
          Valid until {new Date(invoice.expiresAt).toLocaleTimeString()}. Send the exact amount,
          less will not be accepted.
        </p>
      </div>
    </div>
  );
}