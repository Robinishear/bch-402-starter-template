import "dotenv/config";
import { decodeHdPublicKey } from "@bitauth/libauth";

const d: any = decodeHdPublicKey(process.env.BCH_XPUB ?? "");
if (typeof d === "string") throw new Error("ডিকোড হয়নি: " + d);
const n = d.node;
console.log("network:", d.network);
console.log("depth:", n.depth, "| childIndex:", n.childIndex);
console.log("node-এর ফিল্ড:", Object.keys(n).join(", "));