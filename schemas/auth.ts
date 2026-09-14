import { z } from "zod";

export const loginFormSchema = z.object({
  login: z
    .string()
    .trim()
    .min(3, "Login must be at least 3 characters long.")
    .max(100, "Login must be at most 100 characters long."),
  password: z.string().min(6, "Password must be at least 6 characters long."),
});
