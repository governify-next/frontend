import { z } from "zod";

export const organizationFormSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters.")
    .max(100, "Name must be at most 100 characters.")
    .regex(
      /^[a-zA-Z0-9-]+$/,
      "Name can only contain letters, numbers and hyphens.",
    ),
  displayName: z
    .string()
    .max(200, "Display name must be at most 200 characters."),
  description: z
    .string()
    .min(3, "Description must be at least 3 characters.")
    .max(500, "Description must be at most 500 characters."),
});

export const roleFormSchema = z.object({
  name: z
    .string()
    .min(3, "Role name must be at least 3 characters.")
    .max(50, "Role name must be at most 50 characters."),
  description: z
    .string()
    .min(3, "Role description must be at least 3 characters.")
    .max(500, "Role description must be at most 500 characters."),
});
