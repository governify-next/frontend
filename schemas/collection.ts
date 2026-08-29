import { z } from "zod";

export const collectionFormSchema = z.object({
  displayName: z
    .string()
    .max(200, "Display name must be at most 200 characters."),
  name: z
    .string()
    .min(3, "Name must be at least 3 characters.")
    .max(100, "Name must be at most 100 characters.")
    .regex(
      /^[A-Za-z0-9_-]+$/,
      "Name can only contain letters, numbers, hyphens and underscores",
    ),
  description: z
    .string()
    .min(3, "Description must be at least 3 characters.")
    .max(500, "Description must be at most 500 characters."),
});
