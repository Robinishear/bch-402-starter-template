import { Response } from "express";
import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { tokenUtils } from "../../utils/token";
import { AuthService } from "./auth.service";

const setAuthCookies = (
  res: Response,
  user: { id: string; role: string; email: string },
  sessionToken: string,
) => {
  const payload = { userId: user.id, role: user.role, email: user.email };
  tokenUtils.setAccessTokenCookie(res, tokenUtils.getAccessToken(payload));
  tokenUtils.setRefreshTokenCookie(res, tokenUtils.getRefreshToken(payload));
  tokenUtils.setBetterAuthSessionCookie(res, sessionToken);
};

const register = catchAsync(async (req, res) => {
  const { user, token } = await AuthService.registerUser(req.body);
  setAuthCookies(res, user, token);
  sendResponse(res, {
    httpStatusCode: status.CREATED,
    success: true,
    message: "Registered successfully",
    data: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
});

const login = catchAsync(async (req, res) => {
  const { user, token } = await AuthService.loginUser(req.body);
  setAuthCookies(res, user, token);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Logged in successfully",
    data: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
});

export const AuthController = { register, login };
