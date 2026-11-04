import { FeaturePricing } from "../../pricing/_core/pricing_interface";
import PriceTag from "./PriceTag";


interface Props {
  features: FeaturePricing[];
  value: string;
  onChange: (feature: string) => void;
}

export default function FeatureSelect({ features, value, onChange }: Props) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {features.map((f) => (
        <button
          key={f.feature}
          type="button"
          onClick={() => onChange(f.feature)}
          className={`rounded-lg border p-4 text-left ${f.feature === value ? "border-orange-500" : ""}`}
        >
          <p className="font-semibold capitalize">{f.feature.replace(/-/g, " ")}</p>
          <PriceTag priceUsdCents={f.priceUsdCents} amountSats={f.amountSats} />
        </button>
      ))}
    </div>
  );
}