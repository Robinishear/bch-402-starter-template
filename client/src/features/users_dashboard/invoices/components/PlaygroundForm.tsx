"use client";

import { useState, useTransition, type ReactNode } from "react";
import { AlertCircle, Check, Loader2, RotateCw, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PricingData } from "../../pricing/_core/pricing.interface";
import FeatureSelect from "./FeatureSelect";
import PromptBox from "./PromptBox";
import ResultCard from "./ResultCard";
import { Invoice, RunResult } from "../_core/invoices.interface";
import { handleCreateInvoice, handleRunInvoice } from "../_core/invoices.action";
import PayModal from "./PayModal";

const NEXT_STEPS = ["Create the invoice", "Approve the payment in your wallet", "Get your AI insight"];

const formatFeature = (name: string) => {
  const text = name.replace(/-/g, " ");
  return text.charAt(0).toUpperCase() + text.slice(1);
};
const formatUsd = (cents: number) => `$${(cents / 100).toFixed(2)}`;
const formatNumber = (value: number | string) => Number(value).toLocaleString("en-US");

function Step({ n, title, hint, children }: { n: number; title: string; hint: string; children: ReactNode }) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-3">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-emerald-500/40 bg-emerald-500/10 font-mono text-xs font-semibold text-emerald-300">
          {n}
        </span>
        <div>
          <h3 className="text-sm font-semibold text-white">{title}</h3>
          <p className="text-xs text-gray-500">{hint}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

export default function PlaygroundForm({ pricing }: { pricing: PricingData }) {
  const [feature, setFeature] = useState(pricing.features[0]?.feature ?? "");
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [result, setResult] = useState<RunResult | null>(null);
  const [running, setRunning] = useState(false);
  const [retryId, setRetryId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const selected = pricing.features.find((item) => item.feature === feature);

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
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Left: inputs */}
        <div className="space-y-6 rounded-2xl border border-white/10 bg-white/3 p-5 sm:p-6">
          <Step n={1} title="Choose a feature" hint="What do you want the AI to do?">
            <FeatureSelect features={pricing.features} value={feature} onChange={setFeature} />
          </Step>

          <div className="h-px bg-white/10" />

          <Step n={2} title="Write your prompt" hint="Be specific for a better answer.">
            <PromptBox value={input} onChange={setInput} disabled={isPending} />
          </Step>
        </div>

        {/* Right: order summary */}
        <aside className="relative h-fit overflow-hidden rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5 sm:p-6 lg:sticky lg:top-6">
          <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-emerald-400/70 to-transparent" />

          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-emerald-400/80">Order summary</p>

          <div className="mt-4 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs text-gray-500">Feature</p>
              <p className="mt-0.5 truncate text-sm font-medium text-white">{selected ? formatFeature(selected.feature) : "—"}</p>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-[11px] text-gray-300">
              <span className="size-1.5 rounded-full bg-emerald-400" />1 BCH ≈ ${pricing.bchUsdRate}
            </span>
          </div>

          <div className="mt-5 flex items-end justify-between gap-3 border-y border-white/10 py-4">
            <div>
              <p className="text-3xl font-semibold tabular-nums tracking-tight text-white">
                {selected ? formatUsd(selected.priceUsdCents) : "—"}
              </p>
              <p className="mt-0.5 text-xs text-gray-500">per request</p>
            </div>
            {selected && (
              <p className="rounded-md border border-white/10 bg-black/20 px-2.5 py-1 font-mono text-sm text-emerald-300">
                {formatNumber(selected.amountSats)} <span className="text-gray-400">sats</span>
              </p>
            )}
          </div>

          <ul className="mt-4 space-y-2.5">
            {NEXT_STEPS.map((step) => (
              <li key={step} className="flex items-center gap-2.5 text-xs text-gray-400">
                <span className="flex size-4 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
                  <Check className="size-3" strokeWidth={3} />
                </span>
                {step}
              </li>
            ))}
          </ul>

          {error && (
            <div role="alert" className="mt-5 flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 px-3.5 py-3 text-sm text-red-200">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              {error}
            </div>
          )}

          {retryId && (
            <div className="mt-4 space-y-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5">
              <p className="text-sm text-amber-100">Your payment went through. Run it again without paying twice.</p>
              <Button
                type="button"
                variant="outline"
                onClick={() => runAi(retryId)}
                disabled={running}
                className="h-9 w-full gap-2 rounded-lg border-amber-500/40 bg-amber-500/10 text-amber-100 shadow-none hover:bg-amber-500/20 hover:text-white"
              >
                {running ? <Loader2 className="animate-spin" /> : <RotateCw />}
                {running ? "Running…" : "Retry (already paid)"}
              </Button>
            </div>
          )}

          <Button
            type="button"
            onClick={submit}
            disabled={isPending || running}
            className="mt-5 h-11 w-full gap-2 rounded-xl bg-emerald-500 font-semibold text-black shadow-[0_0_28px_rgba(16,185,129,0.35)] hover:bg-emerald-400 disabled:opacity-60"
          >
            {isPending ? <Loader2 className="animate-spin" /> : <Zap className="fill-current" />}
            {isPending ? "Creating invoice…" : "Pay & Run"}
          </Button>
        </aside>
      </div>

      {result && <ResultCard result={result} />}

      {invoice && <PayModal invoice={invoice} onClose={() => setInvoice(null)} onPaid={runAi} running={running} />}
    </div>
  );
}