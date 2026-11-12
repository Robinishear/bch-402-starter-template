"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";

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
import {
  amountUsd,
  COLUMNS,
  COPY_LABEL,
  copyButton,
  dot,
  EXPLORER_TX_URL,
  hoverTrigger,
  statusBadge,
  UI,
  type CopyState,
  type HoverTriggerProps,
} from "./constants";
  import { isRealTxid, formatUsd, formatSats, Icon } from "./constants";

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

/*  small pieces  */

const Dash = () => <span className={UI.muted}>—</span>;

function DateCell({ iso }: { iso: string }) {
  const d = new Date(iso);
  return (
    <>
      <p className={UI.dateDay}>
        {d.toLocaleDateString("en-GB", { dateStyle: "medium" })}
      </p>
      <p className={UI.dateTime}>
        {d.toLocaleTimeString("en-GB", { timeStyle: "short" })}
      </p>
    </>
  );
}

type HoverCopyProps = {
  short: string;
  full: string;
  href?: string;
} & Pick<HoverTriggerProps, "mono" | "tone">;

function HoverCopy({ short, full, href, mono = false, tone }: HoverCopyProps) {
  const [status, setStatus] = useState<CopyState>("idle");

  const triggerClass = hoverTrigger({ mono, tone, link: !!href });

  if (short === full && !mono) {
    return <span className={hoverTrigger({ mono, tone })}>{short}</span>;
  }

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setStatus((await copyText(full)) ? "copied" : "failed");
    setTimeout(() => setStatus("idle"), 1500);
  };


  return (
    <HoverCard>
      <HoverCardTrigger
        delay={100}
        closeDelay={100}
        render={
          href ? (
            <a href={href} target="_blank" rel="noreferrer" className={triggerClass} />
          ) : (
            <span className={triggerClass} />
          )
        }
      >
        {short}
      </HoverCardTrigger>

      <HoverCardContent side="top" align="start" className={UI.hoverContent}>
        <span className={`${UI.hoverText} ${mono ? UI.hoverTextMono : ""}`}>
          {full}
        </span>

        <div className={UI.hoverActions}>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className={copyButton({ state: status })}
          >
            <Icon className={UI.copyIcon} />
            {COPY_LABEL[status]}
          </Button>

          {href && (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              title="Open in explorer"
              className={UI.explorerLink}
            >
              <ExternalLink className={UI.copyIcon} />
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
  tone,
}: {
  value: string;
  max: number;
} & Pick<HoverTriggerProps, "tone">) => (
  <HoverCopy short={clip(value, max)} full={value} tone={tone} />
);


export default function InvoiceTable({ invoices }: { invoices: AdminInvoice[] }) {
  if (invoices.length === 0) {
    return (
      <div className={UI.empty}>
        <p className={UI.emptyTitle}>No invoices yet</p>
        <p className={UI.emptyHint}>
          Invoices appear here as soon as someone requests a paid AI call.
        </p>
      </div>
    );
  }

  return (
    <div className={UI.wrapper}>
      <Table className={UI.table}>
        <TableHeader>
          <TableRow className={UI.headRow}>
            {COLUMNS.map(([label, width]) => (
              <TableHead key={label} className={`${width} ${UI.headCell}`}>
                {label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {invoices.map((invoice) => {
            const { user, txid } = invoice;
            const txReal = !!txid && isRealTxid(txid);

            return (
              <TableRow key={invoice.id} className={UI.bodyRow}>
                <TableCell className={UI.cell}>
                  <DateCell iso={invoice.createdAt} />
                </TableCell>

                <TableCell className={UI.cell}>
                  {user ? (
                    <div className={UI.userWrap}>
                      <span className={UI.avatar}>{user.name.charAt(0)}</span>
                      <div className={UI.userText}>
                        <ClipCopy value={user.name} max={14} tone="strong" />
                        <ClipCopy value={user.email} max={15} tone="subtle" />
                      </div>
                    </div>
                  ) : (
                    <div className={UI.userWrap}>
                      <span className={UI.avatarAnon}>?</span>
                      <div className={UI.userText}>
                        <p className={UI.anonName}>Anonymous</p>
                        <p className={UI.anonHint}>Public API, no login</p>
                      </div>
                    </div>
                  )}
                </TableCell>

                <TableCell className={UI.cell}>
                  <span className={UI.feature}>
                    {clip(invoice.feature.replace(/-/g, " "), 14)}
                  </span>
                </TableCell>

                <TableCell className={UI.cell}>
                  <Badge
                    variant="outline"
                    className={statusBadge({ status: invoice.status })}
                  >
                    <span className={dot()} />
                    {invoice.status.toLowerCase()}
                  </Badge>
                </TableCell>

                <TableCell className={UI.cell}>
                  <p className={amountUsd()}>{formatUsd(invoice.priceUsdCents)}</p>
                  <p className={UI.sats}>
                    {formatSats(invoice.amountSats)}
                    <span className={UI.satsUnit}>sats</span>
                  </p>
                </TableCell>

                <TableCell className={UI.cell}>
                  <HoverCopy
                    short={shorten(invoice.payAddress, 8, 5)}
                    full={invoice.payAddress}
                    mono
                    tone="accent"
                  />
                </TableCell>

                <TableCell className={UI.cell}>
                  {txid ? (
                    <HoverCopy
                      short={shorten(txid, 6, 5)}
                      full={txid}
                      href={txReal ? `${EXPLORER_TX_URL}${txid}` : undefined}
                      mono
                      tone={txReal ? "accent" : "muted"}
                    />
                  ) : (
                    <Dash />
                  )}
                </TableCell>

                <TableCell className={UI.cell}>
                  {invoice.paidAt ? <DateCell iso={invoice.paidAt} /> : <Dash />}
                </TableCell>

                <TableCell className={UI.cell}>
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