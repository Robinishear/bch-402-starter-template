import status from "http-status";
import { InvoiceStatus } from "../../../generated/prisma";
import AppError from "../../error-helpers/AppError";
import { catchAsync } from "../../shared/catchAsync";
import { InvoiceService } from "../invoice/invoice.service";
import { INVOICE_ID_RE } from "./public-api.constants";
import { paymentRequired } from "./public-api-utils";

const insight = catchAsync(async (req, res) => {
  const invoiceId = req.header("x-invoice-id");

  if (!invoiceId) {
    const input = (req.body as { input?: unknown } | undefined)?.input;
    if (typeof input !== "string") {
      throw new AppError(status.BAD_REQUEST, 'Send a JSON body: { "input": "..." }');
    }
    const inv = await InvoiceService.createInvoice(null, {
      feature: "market-insight",
      input,
    });
    res.status(status.PAYMENT_REQUIRED).json(paymentRequired(inv));
    return;
  }

  if (!INVOICE_ID_RE.test(invoiceId)) {
    throw new AppError(status.BAD_REQUEST, "Invalid X-Invoice-Id.");
  }

  const inv = await InvoiceService.getInvoice(null, invoiceId);

  if (inv.status === InvoiceStatus.PENDING) {
    res.status(status.PAYMENT_REQUIRED).json(paymentRequired(inv));
    return;
  }
  if (inv.status === InvoiceStatus.EXPIRED) {
    res.status(status.PAYMENT_REQUIRED).json({
      error: "invoice_expired",
      message: "Invoice expired. Start again without the X-Invoice-Id header.",
      invoiceId: inv.id,
    });
    return;
  }
  if (inv.status === InvoiceStatus.UNDERPAID) {
    res.status(status.PAYMENT_REQUIRED).json({
      error: "underpaid",
      message: "The amount received is less than required. Contact support with the invoiceId.",
      invoiceId: inv.id,
    });
    return;
  }

  const result = await InvoiceService.run(null, inv.id);
  res.status(status.OK).json(result);
});

export const PublicApiController = { insight };