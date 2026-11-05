"use server";

import { revalidatePath } from "next/cache";
import { AdminService } from "./admin.service";
import { updateUserStatusSchema } from "./admin.validation";

export interface AdminActionState {
  success: boolean;
  message: string;
  data?: any;
}

export async function handleUpdateUserStatus(
  userId: string,
  payload: { status: "ACTIVE" | "BLOCKED" }
): Promise<AdminActionState> {
  const parsed = updateUserStatusSchema.safeParse(payload);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Invalid input data",
    };
  }

  try {
    const data = await AdminService.updateUserStatus(userId, parsed.data.status);
    revalidatePath("/admin/users");
    return { 
      success: true, 
      message: "User status updated successfully", 
      data 
    };
  } catch (error: any) {
    return {
      success: false,
      message:
        error.response?.data?.message || error.message || "Could not update user status",
    };
  }
}

export async function handleDeleteUser(userId: string): Promise<AdminActionState> {
  try {
    const data = await AdminService.deleteUser(userId);
    revalidatePath("/admin/users");
    return { 
      success: true, 
      message: "User deleted successfully", 
      data 
    };
  } catch (error: any) {
    return {
      success: false,
      message:
        error.response?.data?.message || error.message || "Could not delete user",
    };
  }
}