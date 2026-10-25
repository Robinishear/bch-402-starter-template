import { InvoiceService } from "../invoice/invoice.service";

export type PublicInvoice = Awaited<ReturnType<typeof InvoiceService.getInvoice>>;
