"use client";

import { useEffect, useRef, useState } from "react";
import { useInvoiceStatus } from "../hooks/useInvoiceStatus";
import Countdown from "./Countdown";
import QrCode from "./QrCode";
import { Invoice } from "../_core/invoices.interface";
import PayWithWalletButton from "../../wizard/components/PayWithWalletButton";

interface Props {
  invoice: Invoice;
  onClose: () => void;
  onPaid: (invoiceId: string) => void;
  running?: boolean;
}

export default function PayModal({ invoice: initialInvoice, onClose, onPaid, running }: Props) {
  const invoice = useInvoiceStatus(initialInvoice);
  const [copied, setCopied] = useState(false);
  const notified = useRef(false);

  useEffect(() => {
    if (invoice.status === "PAID" && !notified.current) {
      notified.current = true;
      onPaid(invoice.id);
    }
  }, [invoice.status, invoice.id, onPaid]);

  const copyAddress = async () => {
    await navigator.clipboard.writeText(invoice.payAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const isPaid = invoice.status === "PAID" || invoice.status === "COMPLETED";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md space-y-4 rounded-xl border bg-[#0c0710] p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Pay with Bitcoin Cash</h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>

        {isPaid && (
          <p className="rounded-md border border-emerald-500/40 bg-emerald-500/10 p-3 text-emerald-300">
            Payment received ✓ {running && "· Running AI..."}
          </p>
        )}

        {invoice.status === "EXPIRED" && (
          <p className="rounded-md border border-red-500/40 bg-red-500/10 p-3 text-red-300">
            This invoice has expired. Please close and create a new one.
          </p>
        )}

        {invoice.status === "UNDERPAID" && (
          <p className="rounded-md border border-red-500/40 bg-red-500/10 p-3 text-red-300">
            Payment received, but the amount was too low. Please create a new invoice and send the exact amount.
          </p>
        )}

        {invoice.status === "PENDING" && (
          <>
            <div>
              <p className="text-sm text-gray-400">Send exactly</p>
              <p className="text-2xl font-bold">{invoice.amountBch} BCH</p>
              <p className="text-xs text-gray-400">
                {invoice.amountSats} sats · ${(invoice.priceUsdCents / 100).toFixed(2)}
              </p>
            </div>

            {/*  */}
<PayWithWalletButton
  payAddress={invoice.payAddress}
  amountSats={invoice.amountSats}
  amountBch={invoice.amountBch}
  feature={invoice.feature}
/>

<p className="text-center text-xs text-gray-400">or scan with any wallet</p>
            <QrCode address={invoice.payAddress} amountBch={invoice.amountBch} />

            <div>
              <p className="text-sm text-gray-400">To this address</p>
              <code className="block break-all rounded-md border p-2 text-xs">{invoice.payAddress}</code>
              <button type="button" onClick={copyAddress} className="mt-2 text-sm text-orange-400">
                {copied ? "Copied!" : "Copy address"}
              </button>
            </div>

            <p className="text-sm text-gray-300">
              Waiting for payment... expires in <Countdown expiresAt={invoice.expiresAt} />
            </p>
          </>
        )}
      </div>
    </div>
  );
}