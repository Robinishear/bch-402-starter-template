import "dotenv/config";
import {
decodeHdPublicKey,
deriveHdPathRelative,
publicKeyToP2pkhCashAddress,
} from "@bitauth/libauth";

const xpub = process.env.BCH_XPUB;
if (!xpub) throw new Error("BCH_XPUB is missing from .env");
if (/^xprv/i.test(xpub)) {
throw new Error("This is an xprv (private key)! Remove it from .env immediately; only an xpub is required.");
}
if (!/^xpub/i.test(xpub)) {
throw new Error("Does not start with 'xpub'. Please provide what Selene is showing you (do not paste the xpub itself).");
}

const strip = (a: string) => a.replace(/^bitcoincash:/i, "").toLowerCase();
const expected = process.argv.slice(2).map(strip);
if (expected.length === 0) {
throw new Error("Usage: Provide the 'Receive' addresses from Selene as arguments.");
}

const decoded: any = decodeHdPublicKey(xpub);
if (typeof decoded === "string") throw new Error("Failed to decode xpub: " + decoded);
const node = decoded.node;
console.log("Network:", decoded.network ?? "(unknown)");

const addressAt = (path: string): string => {
const child: any = deriveHdPathRelative(node, path); 
if (typeof child === "string") throw new Error(`${path}: ${child}`); 
const out: any = publicKeyToP2pkhCashAddress({ publicKey: child.publicKey }); 
const text = typeof out === "string" ? out : out?.address; 
if (typeof text !== "string") throw new Error(`${path}: Could not generate address`); 
return strip(text);
};

const SCAN = 200; const layouts = [
{ name: "A: Account-level xpub (path 0/i)", path: (i: number) => `0/${i}` },
{ name: "B: Chain-level xpub (path i)", path: (i: number) => `${i}` },
  { name: "C: অ্যাকাউন্ট-স্তরের xpub, change চেইন (পথ 1/i)", path: (i: number) => `1/${i}` },
];

let winner: string | null = null;

for (const layout of layouts) {
const derived: string[] = []; 
for (let i = 0; i < SCAN; i++) derived.push(addressAt(layout.path(i))); 

const found = expected.map((e) => derived.indexOf(e)); 
const allFound = found.every((i) => i >= 0); 


console.log(`\n${layout.name}`); 
console.log("  First 3:", derived.slice(0, 3).map((a) => a.slice(0, 14) + "...").join("  ")); 
expected.forEach((e, k) =>
console.log(`  Selene address ${k + 1}: ${found[k] >= 0 ? `✅ Matched, index ${found[k]}` : "❌ No match"}`),
); 
if (allFound) winner = layout.name;


}


console.log(
winner
? `\n🎉 Match found: ${winner}\nPlease let me know which level this is (not the xpub)`
: "\n⚠️ No level yielded a full match. Do not send any funds in this state.",
);
