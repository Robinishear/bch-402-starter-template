import { EventEmitter } from "node:events";

const signal = new EventEmitter();
const INVOICE_CREATED = "invoice-created";

export const notifyInvoiceCreated = () => {
  signal.emit(INVOICE_CREATED);
};

export const onInvoiceCreated = (cb: () => void) => {
  signal.on(INVOICE_CREATED, cb);
  return () => signal.off(INVOICE_CREATED, cb);
};