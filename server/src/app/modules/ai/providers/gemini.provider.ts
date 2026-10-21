import status from "http-status";
import { envVars } from "../../../config/env";
import AppError from "../../../error-helpers/AppError";
import { PROMPTS } from "../ai.prompts";
import { AiProvider } from "../ai.types";
import { FeatureKey } from "../../../config/pricing.config";

const BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";
const MAX_OUTPUT_TOKENS = 2048;
const ATTEMPT_TIMEOUT_MS = 45_000;
const MAX_ATTEMPTS = 2;
const RETRY_DELAY_MS = 1_000;

type GeminiResponse = {
  candidates?: {
    content?: { parts?: { text?: string; thought?: boolean }[] };
    finishReason?: string;
  }[];
  promptFeedback?: { blockReason?: string };
  usageMetadata?: { totalTokenCount?: number };
};

// Temporary issues (timeout, network, 429, 5xx): Can be retried
class RetryableError extends Error {}

const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

const callOnce = async (
  feature: FeatureKey,
  input: string,
): Promise<GeminiResponse> => {
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}/${envVars.AI.GEMINI_MODEL}:generateContent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": envVars.AI.GEMINI_API_KEY,
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: PROMPTS[feature] }] },
        contents: [{ role: "user", parts: [{ text: input }] }],
        generationConfig: { maxOutputTokens: MAX_OUTPUT_TOKENS },
      }),
      signal: AbortSignal.timeout(ATTEMPT_TIMEOUT_MS),
    });
  } catch (e) {
    const err = e as Error & { cause?: { code?: string } };
    console.error("[ai] request failed:", err.name, err.cause?.code ?? err.message);
    throw new RetryableError(err.name);
  }

  if (res.status === 429 || res.status >= 500) {
    console.error("[ai] Gemini HTTP", res.status);
    throw new RetryableError(`HTTP ${res.status}`);
  }

  if (!res.ok) {
// 400/403/404: Issue with the key or model; retrying will not help (log the status only)
    console.error("[ai] Gemini HTTP", res.status);
    throw new AppError(status.BAD_GATEWAY, "AI service failed. Please try again.");
  }

  try {
    return (await res.json()) as GeminiResponse;
  } catch {
    throw new AppError(status.BAD_GATEWAY, "AI returned an invalid response.");
  }
};

const callWithRetry = async (feature: FeatureKey, input: string) => {
  for (let attempt = 1; ; attempt++) {
    try {
      return await callOnce(feature, input);
    } catch (e) {
      if (!(e instanceof RetryableError)) throw e;
      if (attempt >= MAX_ATTEMPTS) {
        throw new AppError(
          status.SERVICE_UNAVAILABLE,
          "AI is busy right now. Please try again.",
        );
      }
      await sleep(RETRY_DELAY_MS);
    }
  }
};

export const geminiProvider: AiProvider = {
  async run(feature, input) {
    const json = await callWithRetry(feature, input);

    if (json.promptFeedback?.blockReason) {
      throw new AppError(
        status.UNPROCESSABLE_ENTITY,
        "This request was blocked by the AI safety filters.",
      );
    }

    const candidate = json.candidates?.[0];
    const text = candidate?.content?.parts
      ?.filter((p) => !p.thought)
      .map((p) => p.text ?? "")
      .join("")
      .trim();

    if (!text) {
      throw new AppError(status.BAD_GATEWAY, "AI returned an empty response.");
    }

    const truncated = candidate?.finishReason === "MAX_TOKENS";
    if (truncated) console.warn("[ai] output hit the token ceiling");

    return { text, tokens: json.usageMetadata?.totalTokenCount, truncated };
  },
};