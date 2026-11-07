"use client";

import { useEffect, useState } from "react";
import { Invoice } from "../_core/invoices.interface";
import { handleGetInvoice } from "../_core/invoices.action";


const POLL_MS = 3000;

export function useInvoiceStatus(initial: Invoice) {
  const [invoice, setInvoice] = useState<Invoice>(initial);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (invoice.status !== "PENDING") return; 

    let cancelled = false;
    const timer = setTimeout(async () => {
      const res = await handleGetInvoice(invoice.id);
      if (cancelled) return;
      if (res.success) setInvoice(res.data);
      setTick((t) => t + 1); 
    }, POLL_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [invoice.id, invoice.status, tick]);

  return invoice;
}