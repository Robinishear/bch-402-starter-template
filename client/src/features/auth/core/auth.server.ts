// services/auth.services.ts

import { httpClient } from "@/_core/axios/httpClient";
import { RegisterPayload, UserResponse } from "./auth.interface";



export const registerUserAction = async (payload: RegisterPayload) => {
  const { body, setCookie } = await httpClient.postRaw<UserResponse>("/auth/register", payload);
  return { body, setCookie };
};