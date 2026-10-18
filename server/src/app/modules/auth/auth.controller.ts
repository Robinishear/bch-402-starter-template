import { Response } from "express";
import status from "http-status";
import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { tokenUtils } from "../../utils/token";
import { AuthService } from "./auth.service";
import { CookieUtils } from "../../utils/cookie";

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

const getMe = catchAsync(async (req, res) => {
  const user = await AuthService.getMe(req.user!.userId);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "User fetched successfully",
    data: user,
  });
});

const logout = catchAsync(async (req, res) => {
  const sessionToken = CookieUtils.getCookie(req, "better-auth.session_token");
  await AuthService.logoutUser(sessionToken);
  tokenUtils.clearAuthCookies(res);
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "Logged out successfully",
    data: null,
  });
});

export const AuthController = { register, login, getMe, logout };