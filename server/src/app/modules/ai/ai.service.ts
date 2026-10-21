import status from "http-status";
import { envVars } from "../../config/env";
import AppError from "../../error-helpers/AppError";
import { AiProvider, AiResult } from "./ai.types";
import { geminiProvider } from "./providers/gemini.provider";
import { isFeatureKey } from "../../config/pricing.config";

export const MAX_INPUT_CHARS = 500;

const providers: Record<string, AiProvider> = {
  gemini: geminiProvider,
// openai: if added later, here
};

// Control characters removed (except \n and \t); ZWJ/ZWNJ retained, as they are needed for Bengali
const normalizeInput = (raw: string) =>
  raw
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/\r\n/g, "\n")
    .trim();

// This will be called before generating an invoice, to ensure there are no errors related to the payment amount.
    const validateInput = (raw: string): string => {
  const input = normalizeInput(raw);
  if (!input) {
    throw new AppError(status.BAD_REQUEST, "Input is required.");
  }
  if ([...input].length > MAX_INPUT_CHARS) {
    throw new AppError(
      status.BAD_REQUEST,
      `Input must be at most ${MAX_INPUT_CHARS} characters.`,
    );
  }
  return input;
};

// feature: Comes from the database (as a plain string), so validation is performed here
const run = async (feature: string, rawInput: string): Promise<AiResult> => {
  if (!isFeatureKey(feature)) {
    throw new AppError(status.BAD_REQUEST, "Unknown feature.");
  }
  const input = validateInput(rawInput);

  const provider = providers[envVars.AI.AI_PROVIDER];
  if (!provider) {
    throw new AppError(status.INTERNAL_SERVER_ERROR, "AI provider not configured.");
  }

  const started = Date.now();
  const result = await provider.run(feature, input);
  console.log(
    `[ai] feature=${feature} tokens=${result.tokens ?? "?"} truncated=${result.truncated} ms=${Date.now() - started}`,
  );
  return result;
};

export const AiService = { run, validateInput };