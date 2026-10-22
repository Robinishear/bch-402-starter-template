import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { InvoiceService } from "./invoice.service";

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

const simulatePay = catchAsync(async (req, res) => {
  const data = await InvoiceService.simulatePayment(req.params.id as string);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Simulated payment (dev only)",
    data,
  });
});

export const InvoiceController = { create, getOne, run, simulatePay };