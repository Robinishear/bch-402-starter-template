process.loadEnvFile(".env"); // Run from Node's built-in, server folder

const url = `https://generativelanguage.googleapis.com/v1beta/models/${process.env.GEMINI_MODEL}:generateContent`;

const call = async (label: string, body: unknown) => { 
const t = Date.now(); 
try { 
const res = await fetch(url, { 
method: "POST", 
headers: { 
"Content-Type": "application/json", 
"x-goog-api-key": process.env.GEMINI_API_KEY ?? "", 
}, 
body: JSON.stringify(body), 
signal: AbortSignal.timeout(60_000), 
}); 
const json: any = await res.json(); 
console.log(label, "-> HTTP", res.status, `${Date.now() - t}ms`); 
console.log(" usage:", json?.usageMetadata); 
} catch (e) { 
const err = e as Error & { cause?: unknown }; 
console.log(label, "-> FAILED", `${Date.now() - t}ms`, err.name, err.message); 
console.log("cause:", err.cause); 
}
};

(async () => { 
await call("1) minimal", { contents: [{ parts: [{ text: "Say hi" }] }] }); 

await call("2) system + topic", { 
systemInstruction: { parts: [{ text: "Reply in max 200 words." }] }, 
contents: [{ role: "user", parts: [{ text: "Bitcoin Cash" }] }], 
}); 

await call("3) with maxOutputTokens", { 
systemInstruction: { parts: [{ text: "Reply in max 200 words." }] }, 
contents: [{ role: "user", parts: [{ text: "Bitcoin Cash" }] }], 
generationConfig: { maxOutputTokens: 1024 }, 
});
})();