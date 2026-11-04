export default function PriceTag({
  priceUsdCents,
  amountSats,
}: {
  priceUsdCents: number;
  amountSats: string;
}) {
  const usd = (priceUsdCents / 100).toFixed(2);
  const bch = (Number(amountSats) / 1e8)
    .toFixed(8)
    .replace(/0+$/, "")
    .replace(/\.$/, "");

  return (
    <div>
      <span className="text-lg font-bold">${usd}</span>
      <span className="ml-2 text-xs text-gray-400">≈ {bch} BCH</span>
    </div>
  );
}