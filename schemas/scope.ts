import { z } from "zod";

export const scopeBasicsSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters.")
    .max(100, "Name must be at most 100 characters."),
  description: z
    .string()
    .refine((v) => v === "" || (v.length >= 3 && v.length <= 500), {
      message: "Description must be between 3 and 500 characters.",
    }),
  type: z
    .string()
    .min(2, "Type must be at least 2 characters.")
    .max(100, "Type must be at most 100 characters."),
});

export const scopeConfigSchema = z.object({
  config: z
    .array(
      z.object({
        key: z.string(),
        value: z.string(),
      }),
    )
    .refine((rows) => rows.every((row) => row.key.trim() !== ""), {
      message: "Key is required.",
    }),
});
