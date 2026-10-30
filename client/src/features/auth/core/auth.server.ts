// services/auth.services.ts

import { httpClient } from "@/_core/axios/httpClient";
import { UserResponse } from "./auth.interface";

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export const registerUserAction = async (payload: RegisterPayload) => {
  try {
    const response = await httpClient.post<UserResponse>("/auth/register", payload);
    return response;
  } catch (error: any) {
    throw error.response?.data || { message: "Something went wrong during registration" };
  }
};