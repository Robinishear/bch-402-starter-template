"use client";

import { useState } from "react";
import {  ExternalLink } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { AdminInvoice } from "../_core/invoice.interface";
import { ACCENT, BORDER, CELL, COLUMNS, COPY_STATE, EXPLORER_TX_URL, MUTED, STATUS_STYLE, SUBTLE } from "./constants";


const isRealTxid = (txid: string) => /^[0-9a-f]{64}$/i.test(txid);
const formatUsd = (cents: number) => `$${(cents / 100).toFixed(2)}`;
const formatSats = (sats: string) => Number(sats).toLocaleString("en-US");

const shorten = (value: string, head = 8, tail = 6) =>
  value.length <= head + tail + 1
    ? value
    : `${value.slice(0, head)}…${value.slice(-tail)}`;

const clip = (value: string, max: number) =>
  value.length <= max ? value : `${value.slice(0, max)}…`;

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement("textarea");
    try {
      ta.value = text;
      ta.style.cssText = "position:fixed;opacity:0";
      document.body.appendChild(ta);
      ta.select();
      return document.execCommand("copy");
    } catch {
      return false;
    } finally {
      document.body.removeChild(ta);
    }
  }
}

const Dash = () => <span className={MUTED}>—</span>;

function DateCell({ iso }: { iso: string }) {
  const d = new Date(iso);
  return (
    <>
      <p className="text-gray-200">
        {d.toLocaleDateString("en-GB", { dateStyle: "medium" })}
      </p>
      <p className={`text-[11px] ${MUTED}`}>
        {d.toLocaleTimeString("en-GB", { timeStyle: "short" })}
      </p>
    </>
  );
}


function HoverCopy({
  short,
  full,
  mono = false,
  className = "",
  href,
}: {
  short: string;
  full: string;
  mono?: boolean;
  className?: string;
  href?: string;
}) {
  const [status, setStatus] = useState<keyof typeof COPY_STATE>("idle");

  const textClass = `block truncate ${mono ? "font-mono text-xs" : ""} ${className}`;

  if (short === full && !mono) {
    return <span className={textClass}>{short}</span>;
  }

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setStatus((await copyText(full)) ? "copied" : "failed");
    setTimeout(() => setStatus("idle"), 1500);
  };

  const { Icon, label, style } = COPY_STATE[status];

  return (
    <HoverCard>
      <HoverCardTrigger
        delay={100}
        closeDelay={100}
        render={
          href ? (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className={`${textClass} hover:underline`}
            />
          ) : (
            <span className={`${textClass} cursor-default`} />
          )
        }
      >
        {short}
      </HoverCardTrigger>

      <HoverCardContent
        side="top"
        align="start"
        className={`flex w-auto max-w-85 items-center gap-2 ${BORDER} bg-black/70 p-2 shadow-2xl shadow-black/60 backdrop-blur-xl`}
      >
        <span
          className={`break-all px-1 text-[11px] leading-relaxed text-gray-100 ${mono ? "font-mono" : ""}`}
        >
          {full}
        </span>

        <div className={`flex shrink-0 items-center gap-1 border-l ${BORDER} pl-2`}>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className={`h-7 gap-1 bg-transparent px-2 text-[10px] ${style}`}
          >
            <Icon className="size-3.5" />
            {label}
          </Button>

          {href && (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              title="Open in explorer"
              className={`flex size-7 items-center justify-center rounded-md border ${BORDER} text-gray-300 transition-colors hover:bg-white/10 hover:text-white`}
            >
              <ExternalLink className="size-3.5" />
            </a>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

const ClipCopy = ({
  value,
  max,
  className = "",
}: {
  value: string;
  max: number;
  className?: string;
}) => <HoverCopy short={clip(value, max)} full={value} className={className} />;

export default function InvoiceTable({
  invoices,
}: {
  invoices: AdminInvoice[];
}) {
  if (invoices.length === 0) {
    return (
      <div className={`rounded-xl border ${BORDER} p-8 text-center text-sm text-gray-400`}>
        No invoices found.
      </div>
    );
  }

  return (
    <div className={`w-full overflow-hidden rounded-xl border ${BORDER} shadow-lg shadow-black/20`}>
      <Table className="table-fixed text-xs max-lg:min-w-275">
        <TableHeader>
          <TableRow className={`${BORDER} bg-white/3 hover:bg-white/3`}>
            {COLUMNS.map(([label, width]) => (
              <TableHead
                key={label}
                className={`${width} ${CELL} text-[11px] font-medium uppercase tracking-wider text-gray-400`}
              >
                {label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {invoices.map((invoice) => {
            const { user, txid } = invoice;

            return (
              <TableRow
                key={invoice.id}
                className="border-white/5 transition-colors hover:bg-white/4"
              >
                <Table className={CELL}>
                  <DateCell iso={invoice.createdAt} />
                </Table>

                <TableCell className={CELL}>
                  {user ? (
                    <>
                      <ClipCopy value={user.name} max={14} className="font-medium text-white" />
                      <ClipCopy value={user.email} max={15} className={SUBTLE} />
                    </>
                  ) : (
                    <>
                      <p className="font-medium text-gray-300">Anonymous</p>
                      <p className={`truncate text-[11px] ${MUTED}`}>Public API (no login)</p>
                    </>
                  )}
                </TableCell>

                <TableCell className={`${CELL}  capitalize text-gray-200`}>
                  <ClipCopy value={invoice.feature.replace(/-/g, " ")} max={12} />
                </TableCell>

                <TableCell className={CELL}>
                  <Badge
                    variant="outline"
                    className={`gap-1 rounded-full px-1 py-0.5 text-[11px] font-medium ${STATUS_STYLE[invoice.status]}`}
                  >
                    <span className="size-1.5 rounded-full bg-current" />
                    {invoice.status}
                  </Badge>
                </TableCell>

                <TableCell className={`${CELL} whitespace-nowrap font-medium text-white`}>
                  {formatUsd(invoice.priceUsdCents)}
                </TableCell>

                <TableCell className={`${CELL} whitespace-nowrap text-gray-300`}>
                  {formatSats(invoice.amountSats)}
                  <span className={`ml-1 text-[11px] ${MUTED}`}>sats</span>
                </TableCell>

                <TableCell className={CELL}>
                  <HoverCopy
                    short={shorten(invoice.payAddress, 8, 5)}
                    full={invoice.payAddress}
                    mono
                    className={ACCENT}
                  />
                </TableCell>

                <TableCell className={CELL}>
                  {txid ? (
                    <HoverCopy
                      short={shorten(txid, 6, 5)}
                      full={txid}
                      href={isRealTxid(txid) ? `${EXPLORER_TX_URL}${txid}` : undefined}
                      mono
                      className={isRealTxid(txid) ? ACCENT : "text-gray-400"}
                    />
                  ) : (
                    <Dash />
                  )}
                </TableCell>

                <TableCell className={CELL}>
                  {invoice.paidAt ? <DateCell iso={invoice.paidAt} /> : <Dash />}
                </TableCell>

                <TableCell className={CELL}>
                  <DateCell iso={invoice.expiresAt} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}