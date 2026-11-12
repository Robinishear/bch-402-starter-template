import { httpClient } from "@/_core/axios/httpClient";
import { ForgotPasswordPayload, LoginPayload, RegisterPayload, ResetPasswordPayload, UserResponse } from "./auth.interface";

export const registerUserAction = async (payload: RegisterPayload) => {
  const { body, setCookie } = await httpClient.postRaw<UserResponse>("/auth/register", payload);
  return { body, setCookie };
};

export const loginUserAction = async (payload: LoginPayload) => {
  const { body, setCookie } = await httpClient.postRaw<UserResponse>("/auth/login", payload);
  return { body, setCookie };
};

export const logoutUserAction = async () => {
  return httpClient.post("/auth/logout", {});
};

export const forgotPasswordAction = async (payload: ForgotPasswordPayload) => {
  return httpClient.post("/auth/forgot-password", payload);
};

export const resetPasswordAction = async (payload: ResetPasswordPayload) => {
  return httpClient.post("/auth/reset-password", payload);
};