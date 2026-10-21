import { AiService } from "../app/modules/ai/ai.service";

(async () => {
console.log("--- market-insight ---");
console.log(await AiService.run("market-insight", "Bitcoin Cash"));

console.log("--- prompt-suggest ---");
console.log(
await AiService.run("prompt-suggest", "Facebook posts for small businesses"),
);
})().catch((e) => console.error("ERROR:", e.message));