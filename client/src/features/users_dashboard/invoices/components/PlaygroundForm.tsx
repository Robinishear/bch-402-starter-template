"use client";

import { useState, useTransition } from "react";

import PromptBox from "./PromptBox";
import { Invoice } from "../_core/invoices_interface";
import { handleCreateInvoice } from "../_core/invoices_action";
import PayModal from "./PayModal";
import { PricingData } from "../../pricing/_core/pricing_interface";
import FeatureSelect from "./FeatureSelect";

export default function PlaygroundForm({ pricing }: { pricing: PricingData }) {
const [feature, setFeature] = useState(pricing.features[0]?.feature ?? "");
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isPending, startTransition] = useTransition();

  const submit = () => {
    setError("");
    startTransition(async () => {
      const res = await handleCreateInvoice({ feature, input });
      if (res.success) setInvoice(res.data);
      else setError(res.message);
    });
  };

  return (
    <div className="space-y-4">
      <FeatureSelect features={pricing.features} value={feature} onChange={setFeature} />
      <PromptBox value={input} onChange={setInput} disabled={isPending} />
      <p className="text-xs text-gray-400">1 BCH ≈ ${pricing.bchUsdRate}</p>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button
        type="button"
        onClick={submit}
        disabled={isPending}
        className="rounded-lg bg-orange-500 px-5 py-2 font-semibold text-black disabled:opacity-60"
      >
        {isPending ? "Creating invoice..." : "Pay & Run"}
      </button>

      {invoice && <PayModal invoice={invoice} onClose={() => setInvoice(null)} />}
    </div>
  );
}