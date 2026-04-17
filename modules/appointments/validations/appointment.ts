import { z } from "zod";

export const appointmentSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  phone: z.string().min(7, "Phone number is too short"),
  email: z
    .string()
    .email("Enter a valid email")
    .optional()
    .or(z.literal("")),
  service: z.string().min(2, "Please choose a service"),
  preferredDate: z
    .string()
    .refine((value) => !Number.isNaN(new Date(value).getTime()), "Invalid date"),
  preferredTime: z.string().min(1, "Please choose a time"),
  notes: z.string().max(500, "Notes must be less than 500 characters").optional(),
});

export type AppointmentFormValues = z.infer<typeof appointmentSchema>;
