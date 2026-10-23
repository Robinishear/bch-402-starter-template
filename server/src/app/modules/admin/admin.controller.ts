import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { AdminService } from "./admin.service";
import { IQueryParams } from "../../interfaces/query.interface";

const updateUserStatus = catchAsync(async (req, res) => {
  const data = await AdminService.updateUserStatus(
    req.user!.userId,
    req.params.id as string,
    req.body.status,
  );
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "User status updated",
    data,
  });
});

const deleteUser = catchAsync(async (req, res) => {
  const data = await AdminService.deleteUser(
    req.user!.userId,
    req.params.id as string,
  );
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "User deleted",
    data,
  });
});

const getAllUsers = catchAsync(async (req, res) => {
  const result = await AdminService.getAllUsers(req.query as IQueryParams);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Users fetched successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getUserSummary = catchAsync(async (_req, res) => {
  const data = await AdminService.getUserSummary();
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "User summary fetched successfully",
    data,
  });
});

const getAllInvoices = catchAsync(async (req, res) => {
  const result = await AdminService.getAllInvoices(req.query as IQueryParams);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Invoices fetched successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getStats = catchAsync(async (_req, res) => {
  const data = await AdminService.getStats();
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Stats fetched successfully",
    data,
  });
});

export const AdminController = {
  updateUserStatus,
  deleteUser,
  getAllUsers,
  getUserSummary,
  getAllInvoices,
  getStats,
};
