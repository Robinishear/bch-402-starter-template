// "use client";

// import { useState } from "react";
// import { debugWallet } from "../_core/debug";
// import { useWalletOptional } from "./WalletProvider";

// export default function WalletCheck() {
//   const wallet = useWalletOptional();
//   const [report, setReport] = useState("");
//   const [busy, setBusy] = useState(false);

//   if (!wallet || wallet.state !== "connected" || !wallet.manager) return null;
//   const manager = wallet.manager;

//   const run = async () => {
//     setBusy(true);
//     setReport("");
//     try {
//       const result = await debugWallet(manager);
//       console.log("[wallet check]", result);
//       setReport(JSON.stringify(result, null, 2));
//     } catch (e) {
//       setReport(e instanceof Error ? e.message : "Check failed");
//     }
//     setBusy(false);
//   };

//   return (
//     <div className="space-y-2 text-xs">
//       <button
//         type="button"
//         onClick={run}
//         disabled={busy}
//         className="rounded-md border px-3 py-1 text-gray-300 disabled:opacity-60"
//       >
//         {busy ? "Checking..." : "Wallet check (temporary)"}
//       </button>
//       {report && (
//         <pre className="max-w-md overflow-auto rounded-md border p-2 text-left">{report}</pre>
//       )}
//     </div>
//   );
// }