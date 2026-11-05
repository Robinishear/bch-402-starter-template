import { z } from "zod";

export const updateUserStatusSchema = z.object({
  status: z.enum(["ACTIVE", "BLOCKED"], {
    message: "Invalid status value. Must be ACTIVE or BLOCKED.",
  }),
});