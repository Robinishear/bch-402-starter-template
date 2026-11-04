import { UsageSummary } from "../_core/usage_interface.ts";

export default function StatCards({ summary }: { summary: UsageSummary }) {
  const cards = [
    { label: "Total uses", value: summary.totalUses },
    { label: "Paid invoices", value: summary.paidInvoices },
    { label: "AI tokens used", value: summary.totalTokens },
        { label: "Total Sats Spent", value: summary.totalSpentSats },

    {
      label: "Total spent",
      value: `$${summary.totalSpentUsd}`,
      sub: `${summary.totalSpentBch} BCH`,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className="rounded-lg border p-4">
          <p className="text-sm text-gray-400">{card.label}</p>
          <p className="mt-1 text-2xl font-bold">{card.value}</p>
          {card.sub && <p className="text-xs text-gray-400">{card.sub}</p>}
        </div>
      ))}
    </div>
  );
}