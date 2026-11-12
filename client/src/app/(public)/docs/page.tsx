import CodeBlock from "@/features/docs/components/CodeBlock";

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

const STEP1_REQUEST = `curl -i -X POST ${BASE}/insight \\
  -H "Content-Type: application/json" \\
  -d '{"input":"What is the BCH market outlook this week?"}'`;

const STEP1_RESPONSE = `HTTP/1.1 402 Payment Required

{
  "error": "payment_required",
  "message": "Send the exact amount to payTo, then call again with the X-Invoice-Id header.",
  "invoiceId": "cmabc123xyz456",
  "payTo": "bitcoincash:qq...",
  "amountSats": "12231",
  "amountBch": "0.00012231",
  "expiresAt": "2026-11-20T10:15:00.000Z"
}`;

const STEP3_REQUEST = `curl -X POST ${BASE}/insight \\
  -H "X-Invoice-Id: cmabc123xyz456"`;

const STEP3_RESPONSE = `HTTP/1.1 200 OK

{
  "invoiceId": "cmabc123xyz456",
  "feature": "market-insight",
  "result": "…the AI answer…",
  "tokens": 512,
  "txid": "…",
  "createdAt": "2026-11-20T10:03:41.000Z"
}`;

const AGENT_EXAMPLE = `const BASE = "${BASE}";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function askInsight(input, payWithMyWallet) {
  // 1. ask — the server answers 402 with a payment request
  const first = await fetch(\`\${BASE}/insight\`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ input }),
  });
  if (first.status !== 402) throw new Error(\`Unexpected status \${first.status}\`);
  const invoice = await first.json();

  // 2. pay the exact amount (your own wallet code)
  await payWithMyWallet(invoice.payTo, invoice.amountSats);

  // 3. retry with the invoice id until the payment is seen
  while (true) {
    const res = await fetch(\`\${BASE}/insight\`, {
      method: "POST",
      headers: { "X-Invoice-Id": invoice.invoiceId },
    });
    if (res.status === 200) return res.json();

    const body = await res.json();
    if (res.status !== 402 || body.error !== "payment_required") {
      throw new Error(body.message ?? "Request failed");
    }
    await sleep(3000); // still waiting for the payment
  }
}`;

const STATUS_ROWS: { status: string; meaning: string }[] = [
  { status: "200", meaning: "Paid. The body contains the AI result." },
  { status: "402 payment_required", meaning: "Payment is still needed (or not yet seen). Pay the amount in the body, then call again." },
  { status: "402 invoice_expired", meaning: "The 15 minutes are over. Start again without the X-Invoice-Id header." },
  { status: "402 underpaid", meaning: "Less than the required amount was received. A new invoice is needed." },
  { status: "400", meaning: "Bad request: missing or empty input, input over 500 characters, or an invalid X-Invoice-Id." },
  { status: "429", meaning: "Too many requests. See the limits below." },
  { status: "503", meaning: "The service is busy. Try again shortly." },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      {children}
    </section>
  );
}

export default function DocsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-10 px-6 py-12">
      <header className="space-y-3 border-b border-white/10 pb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-white">
          Public{" "}
          <span className="bg-linear-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">API</span>
        </h1>
        <p className="text-gray-400">
          Pay per request with Bitcoin Cash. No account, no API key. An AI agent (or a curl command) asks,
          gets an HTTP 402 payment request, pays on the BCH mainnet, and then receives the answer.
        </p>
        <p className="text-sm text-gray-500">
          This follows the idea of HTTP 402 Payment Required (x402-style). The response format below is
          specific to this service.
        </p>
      </header>

      <Section title="How it works">
        <ol className="list-decimal space-y-2 pl-5 text-gray-300">
          <li>
            <strong className="text-white">Ask.</strong> Send your text to <code>POST /insight</code>. The server
            replies <code>402</code> with an address and an exact amount.
          </li>
          <li>
            <strong className="text-white">Pay.</strong> Send exactly that amount in BCH to the address within 15
            minutes, from any wallet.
          </li>
          <li>
            <strong className="text-white">Collect.</strong> Call <code>POST /insight</code> again with the{" "}
            <code>X-Invoice-Id</code> header. When the payment is seen (usually within seconds, 0-confirmation is
            accepted) you get <code>200</code> and the result.
          </li>
        </ol>
      </Section>

      <Section title="1. Ask for an answer">
        <p className="text-gray-400">
          Only the <code>market-insight</code> feature is available on the public API. The input must be 1 to 500
          characters.
        </p>
        <CodeBlock language="bash" code={STEP1_REQUEST} />
        <CodeBlock language="http" code={STEP1_RESPONSE} />
      </Section>

      <Section title="2. Pay">
        <p className="text-gray-400">
          Send exactly <code>amountSats</code> (the same value as <code>amountBch</code>) to <code>payTo</code>
          before <code>expiresAt</code>. The price is fixed when the invoice is created, so the rate cannot change
          while you pay. Paying less cannot be topped up; the invoice becomes <code>underpaid</code>.
        </p>
      </Section>

      <Section title="3. Collect the result">
        <p className="text-gray-400">
          Call the same endpoint with the <code>invoiceId</code> from step 1 in the <code>X-Invoice-Id</code>{" "}
          header. No body is needed. Asking again after a successful call returns the same saved result and is
          never charged twice.
        </p>
        <CodeBlock language="bash" code={STEP3_REQUEST} />
        <CodeBlock language="http" code={STEP3_RESPONSE} />
      </Section>

      <Section title="Responses">
        <div className="overflow-x-auto rounded-lg border border-white/10">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-400">
              <tr>
                <th className="px-4 py-2.5">Status</th>
                <th className="px-4 py-2.5">Meaning</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {STATUS_ROWS.map((row) => (
                <tr key={row.status}>
                  <td className="whitespace-nowrap px-4 py-2.5 font-mono text-xs text-orange-300">{row.status}</td>
                  <td className="px-4 py-2.5 text-gray-300">{row.meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Limits">
        <ul className="list-disc space-y-1.5 pl-5 text-gray-300">
          <li>Creating a new invoice: 5 per 10 minutes per IP address.</li>
          <li>Checking an invoice (with X-Invoice-Id): 60 per minute per IP address.</li>
          <li>An invoice is valid for 15 minutes.</li>
          <li>Input: at most 500 characters.</li>
        </ul>
      </Section>

      <Section title="Example: a small agent">
        <p className="text-gray-400">
          The whole flow in JavaScript. <code>payWithMyWallet</code> is your own code that sends the BCH.
        </p>
        <CodeBlock language="javascript" code={AGENT_EXAMPLE} />
      </Section>

      <Section title="Prefer a website?">
        <p className="text-gray-400">
          Use the Playground after logging in. It does the same thing with a QR code or one-click wallet payment.
        </p>
      </Section>
    </div>
  );
}