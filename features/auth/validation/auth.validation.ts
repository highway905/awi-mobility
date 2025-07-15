import { z } from "zod"

// Login form validation schema
export const loginSchema = z.object({
  email: z.string()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email address" })
    .toLowerCase()
    .trim(),
  password: z.string()
    .min(1, { message: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters" }),
})

export type LoginFormValues = z.infer<typeof loginSchema>
