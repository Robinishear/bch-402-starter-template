import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { UsageService } from "./usage.service";
import { IQueryParams } from "../../interfaces/query.interface";

const getMyUsage = catchAsync(async (req, res) => {
  const result = await UsageService.getMyUsage(req.user!.userId, req.query as IQueryParams);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Usage history fetched",
    data: result.data,
    meta: result.meta,
  });
});

export const UsageController = { getMyUsage };