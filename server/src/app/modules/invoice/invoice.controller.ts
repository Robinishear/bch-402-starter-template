import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { InvoiceService } from "./invoice.service";
import AppError from "../../error-helpers/AppError";

const create = catchAsync(async (req, res) => {
  const data = await InvoiceService.createInvoice(req.user!.userId, req.body);
  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Invoice created",
    data,
  });
});

const getOne = catchAsync(async (req, res) => {
  const data = await InvoiceService.getInvoice(req.user!.userId, req.params.id as string);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Invoice fetched",
    data,
  });
});

const run = catchAsync(async (req, res) => {
  const data = await InvoiceService.run(req.user!.userId, req.params.id as string);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "AI result ready",
    data,
  });
 });

// const simulatePay = catchAsync(async (req, res) => {
//   const data = await InvoiceService.simulatePayment(req.params.id as string);
//   sendResponse(res, {
//     httpStatusCode: status.OK,
//     success: true,
//     message: "Simulated payment (dev only)",
//     data,
//   });
// });


const parseSats = (value: unknown): bigint | undefined => {
  if (value === undefined || value === null || value === "") return undefined;
  const s = String(value);
  if (!/^[1-9]\d{0,17}$/.test(s)) {
    throw new AppError(status.BAD_REQUEST, "amountSats must be a positive integer.");
  }
  return BigInt(s);
};

const parseTxid = (value: unknown): string | undefined => {
  if (value === undefined || value === null || value === "") return undefined;
  if (typeof value !== "string" || !/^[\w-]{1,100}$/.test(value)) {
    throw new AppError(status.BAD_REQUEST, "Invalid txid.");
  }
  return value;
};

const simulatePay = catchAsync(async (req, res) => {
  const body = (req.body ?? {}) as { amountSats?: unknown; txid?: unknown };
  const data = await InvoiceService.simulatePayment(req.params.id as string, {
    amountSats: parseSats(body.amountSats),
    txid: parseTxid(body.txid),
  });
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Simulated payment (dev only)",
    data,
  });
});


export const InvoiceController = { create, getOne, run, simulatePay };