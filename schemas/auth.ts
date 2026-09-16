import { z } from "zod";

export const loginFormSchema = z.object({
  login: z
    .string()
    .trim()
    .min(3, "Login must be at least 3 characters long.")
    .max(100, "Login must be at most 100 characters long."),
  password: z.string().min(6, "Password must be at least 6 characters long."),
});

export const registerFormSchema = z
  .object({
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
    passwordConfirmation: z
      .string()
      .trim()
      .min(6, "Password must be at least 6 characters long."),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match.",
    path: ["passwordConfirmation"],
  });
