import { z } from "zod";

export const fetchStatesFormSchema = z
  .object({
    startDate: z.date("Start date is required"),
    endDate: z.date("End date is required"),
    replaceExisting: z.boolean(),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: "End date must be on or after start date",
    path: ["endDate"],
  });
