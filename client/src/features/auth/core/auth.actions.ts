"use server";

import { redirect } from "next/navigation";
import { loginUserAction, registerUserAction } from "./auth.server";
import { getDefaultDashboardRoute } from "@/_core/utils/authUtils";
import { forwardSetCookies } from "@/_core/utils/cookie";
import { loginValidationSchema, registerValidationSchema } from "./auth.validation";
import { RegisterPayload } from "./auth.interface";

export async function handleRegister(prevState: any, formData: FormData) {
  const rawData = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const validatedFields = registerValidationSchema.safeParse(rawData);

  if (!validatedFields.success) {
    const errorMessages = validatedFields.error.flatten().fieldErrors;
    const firstError =
      errorMessages.name?.[0] ||
      errorMessages.email?.[0] ||
      errorMessages.password?.[0] ||
      "Invalid input data";

    return {
      success: false,
      message: firstError,
    };
  }

  let destination = "";

  try {
    const payload: RegisterPayload = validatedFields.data;

    const { body, setCookie } = await registerUserAction(payload);

    await forwardSetCookies(setCookie);

    const responseData = body as any;
    const userRole = responseData?.data?.role || responseData?.role;

    if (userRole) {
      destination = getDefaultDashboardRoute(userRole);
    }

    // return {
    //   success: true,
    //   message: responseData?.message || "Registered successfully",
    //   data: responseData?.data || responseData,
    // };

  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Registration failed",
    };
  }

  // if (destination) {
  //   redirect(destination);
  // }

redirect(destination || "/dashboard");
  
}

//* login action
export async function handleLogin(prevState: any, formData: FormData) {
  const validatedFields = loginValidationSchema.safeParse({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });

  if (!validatedFields.success) {
    const errors = validatedFields.error.flatten().fieldErrors;
    return {
      success: false,
      message: errors.email?.[0] || errors.password?.[0] || "Invalid input data",
    };
  }

  let destination = "";

  try {
    const { body, setCookie } = await loginUserAction(validatedFields.data);
    await forwardSetCookies(setCookie);

    const role = (body as any)?.data?.role;
    destination = getDefaultDashboardRoute(role);
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Login failed",
    };
  }

  redirect(destination);
}