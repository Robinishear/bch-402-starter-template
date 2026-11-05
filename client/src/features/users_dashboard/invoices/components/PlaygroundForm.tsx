"use client";

import { useState, useTransition } from "react";

import { PricingData } from "../../pricing/_core/pricing_interface";
import FeatureSelect from "./FeatureSelect";
import PromptBox from "./PromptBox";
import ResultCard from "./ResultCard";
import { Invoice, RunResult } from "../_core/invoices_interface";
import { handleCreateInvoice, handleRunInvoice } from "../_core/invoices_action";
import PayModal from "./PayModal";

export default function PlaygroundForm({ pricing }: { pricing: PricingData }) {
  const [feature, setFeature] = useState(pricing.features[0]?.feature ?? "");
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [result, setResult] = useState<RunResult | null>(null);
  const [running, setRunning] = useState(false);
  const [retryId, setRetryId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const submit = () => {
    setError("");
    setResult(null);
    setRetryId(null);
    startTransition(async () => {
      const res = await handleCreateInvoice({ feature, input });
      if (res.success) setInvoice(res.data);
      else setError(res.message);
    });
  };

  const runAi = async (invoiceId: string) => {
    setError("");
    setRunning(true);
    const res = await handleRunInvoice(invoiceId);
    setRunning(false);
    setInvoice(null);

    if (res.success === false) {
      setError(res.message);
      setRetryId(invoiceId);
      return;
    }

    setResult(res.data);
    setRetryId(null);
  };

  return (
    <div className="space-y-4">
      <FeatureSelect features={pricing.features} value={feature} onChange={setFeature} />
      <PromptBox value={input} onChange={setInput} disabled={isPending} />
      <p className="text-xs text-gray-400">1 BCH ≈ ${pricing.bchUsdRate}</p>

      {error && <p className="text-sm text-red-400">{error}</p>}

      {retryId && (
        <button
          type="button"
          onClick={() => runAi(retryId)}
          disabled={running}
          className="rounded-lg border px-4 py-2 text-sm"
        >
          {running ? "Running..." : "Retry (already paid)"}
        </button>
      )}

      <button
        type="button"
        onClick={submit}
        disabled={isPending}
        className="rounded-lg bg-orange-500 px-5 py-2 font-semibold text-black disabled:opacity-60"
      >
        {isPending ? "Creating invoice..." : "Pay & Run"}
      </button>

      {result && <ResultCard result={result} />}

      {invoice && (
        <PayModal
          invoice={invoice}
          onClose={() => setInvoice(null)}
          onPaid={runAi}
          running={running}
        />
      )}
    </div>
  );
}