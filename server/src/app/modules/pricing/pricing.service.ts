import status from "http-status";
import AppError from "../../error-helpers/AppError";
import { envVars } from "../../config/env";
import {
  FEATURE_PRICES_USD_CENTS,
  FeatureKey,
} from "../../config/pricing.config";
import { CACHE_TTL_MS, MAX_STALE_MS, RATE_SCALE } from "./pricing.constants";


let cache: { rateScaled: bigint; fetchedAt: number } | null = null;
let inflight: Promise<bigint> | null = null;

const toScaled = (value: string): bigint => {
  if (!/^\d+(\.\d+)?$/.test(value)) throw new Error(`Bad rate: ${value}`);
  const [whole, frac = ""] = value.split(".");
  const fracPadded = (frac + "0".repeat(RATE_SCALE)).slice(0, RATE_SCALE);
  return BigInt(whole + fracPadded);
};

const fetchRate = async (): Promise<bigint> => {
  const res = await fetch(envVars.BCH.PRICE_API_URL, {
    signal: AbortSignal.timeout(5000),
  });
  if (!res.ok) throw new Error(`Price API HTTP ${res.status}`);

  const json = (await res.json()) as { data?: { amount?: string } };
  const amount = json?.data?.amount;
  if (!amount) throw new Error("Price API: amount missing");

  const scaled = toScaled(amount);
  if (scaled <= 0n) throw new Error("Price API: non-positive rate");
  return scaled;
};

const getRate = async (): Promise<bigint> => {
  const now = Date.now();
  if (cache && now - cache.fetchedAt < CACHE_TTL_MS) return cache.rateScaled;

  if (!inflight) {
    inflight = fetchRate().finally(() => {
      inflight = null;
    });
  }

  try {
    const rateScaled = await inflight;
    cache = { rateScaled, fetchedAt: Date.now() };
    return rateScaled;
  } catch (error) {
    console.error("[pricing] rate fetch failed:", (error as Error).message);
    if (cache && now - cache.fetchedAt < MAX_STALE_MS) return cache.rateScaled;
    throw new AppError(
      status.SERVICE_UNAVAILABLE,
      "Price service unavailable. Please try again.",
    );
  }
};

const usdCentsToSats = (usdCents: number, rateScaled: bigint): bigint => {
  const numerator = BigInt(usdCents) * 10n ** 12n;
  return (numerator + rateScaled - 1n) / rateScaled;
};

const quote = async (feature: FeatureKey) => {
  const priceUsdCents = FEATURE_PRICES_USD_CENTS[feature];
  const rateScaled = await getRate();
  return {
    feature,
    priceUsdCents,
    amountSats: usdCentsToSats(priceUsdCents, rateScaled), // BigInt
  };
};

const getPricing = async () => {
  const rateScaled = await getRate();
  const features = (Object.keys(FEATURE_PRICES_USD_CENTS) as FeatureKey[]).map(
    (feature) => {
      const priceUsdCents = FEATURE_PRICES_USD_CENTS[feature];
      return {
        feature,
        priceUsdCents,
        amountSats: usdCentsToSats(priceUsdCents, rateScaled).toString(),
      };
    },
  );
  return {
    bchUsdRate: (Number(rateScaled) / 10 ** RATE_SCALE).toFixed(2),
    features,
  };
};

export const PricingService = { getRate, quote, getPricing };
