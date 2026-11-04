// services/auth.services.ts

import { httpClient } from "@/_core/axios/httpClient";
import { LoginPayload, RegisterPayload, UserResponse } from "./auth.interface";



export const registerUserAction = async (payload: RegisterPayload) => {
  const { body, setCookie } = await httpClient.postRaw<UserResponse>("/auth/register", payload);
  return { body, setCookie };
};


export const loginUserAction = async (payload: LoginPayload) => {
  const { body, setCookie } = await httpClient.postRaw<UserResponse>("/auth/login", payload);
  return { body, setCookie };
};