import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { PricingService } from "./pricing.service";

const getPricing = catchAsync(async (_req, res) => {
  const data = await PricingService.getPricing();
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Pricing fetched successfully",
    data,
  });
});

export const PricingController = { getPricing };
