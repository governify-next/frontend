import { z } from "zod";
import { SystemRole, UserStatus } from "@/types/user.types";

export const userFormSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters long.")
    .max(50, "Username must be at most 50 characters long."),
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters long.")
    .max(30, "Name must be at most 30 characters long."),
  surname: z
    .string()
    .trim()
    .min(2, "Surname must be at least 2 characters long.")
    .max(50, "Surname must be at most 50 characters long."),
  email: z.email("Invalid email address."),
  password: z
    .string()
    .trim()
    .min(6, "Password must be at least 6 characters long."),
  systemRole: z.enum(SystemRole),
  status: z.enum(UserStatus),
});
