import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { AdminService } from "./admin.service";

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

export const AdminController = { updateUserStatus, deleteUser };
