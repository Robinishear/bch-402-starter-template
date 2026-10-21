import status from "http-status";
import { PROMPTS } from "../ai.prompts";
import { AiProvider } from "../ai.types";
import AppError from "../../../error-helpers/AppError";
import { envVars } from "../../../config/env";

const BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";
const MAX_OUTPUT_TOKENS = 1024;

type GeminiResponse = {
  candidates?: { content?: { parts?: { text?: string }[] } }[];
  usageMetadata?: { totalTokenCount?: number };
};

export const geminiProvider: AiProvider = {
  async run(feature, input) {
    const res = await fetch(
      `${BASE_URL}/${envVars.AI.GEMINI_MODEL}:generateContent`,
      {
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
        signal: AbortSignal.timeout(30_000),
      },
    );

    if (!res.ok) {
      console.error("[ai] Gemini HTTP", res.status);
      throw new AppError(status.BAD_GATEWAY, "AI service failed. Please try again.");
    }

    const json = (await res.json()) as GeminiResponse;
    const text = json.candidates?.[0]?.content?.parts
      ?.map((p) => p.text ?? "")
      .join("")
      .trim();

    if (!text) {
      throw new AppError(status.BAD_GATEWAY, "AI returned an empty response.");
    }

    return { text, tokens: json.usageMetadata?.totalTokenCount };
  },
};