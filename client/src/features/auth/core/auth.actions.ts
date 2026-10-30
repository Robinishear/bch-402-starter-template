// src/features/auth/core/auth.actions.ts
"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { registerUserAction, RegisterPayload } from "./auth.server"; 
import { getDefaultDashboardRoute } from "@/_core/utils/authUtils";
import { jwtUtils } from "@/_core/utils/jwt";
import { registerValidationSchema } from "./auth.validation";

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
    
    // টাইপ এরর এড়াতে পুরো রেসপন্সকে 'any' কাস্ট করা হলো
    const response = (await registerUserAction(payload)) as any;
   
    const setCookieHeaders = response?.headers?.['set-cookie'];

    if (setCookieHeaders) {
      const cookieStore = await cookies();
      
      setCookieHeaders.forEach((cookieString: string) => {
        const [nameValue] = cookieString.split(';');
        const [name, value] = nameValue.split('=');
        if (name && value) {
          cookieStore.set(name.trim(), value.trim(), {
            httpOnly: true,
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
          });
        }
      });
    }

    const responseData = (response?.data || response) as any;
    const userRole = responseData?.data?.role || responseData?.role;

    if (userRole) {
      destination = getDefaultDashboardRoute(userRole);
    }

    return {
      success: true,
      message: responseData?.message || "Registered successfully",
      data: responseData?.data || responseData,
    };

  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Registration failed",
    };
  }

  if (destination) {
    redirect(destination);
  }
}