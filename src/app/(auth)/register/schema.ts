import { z } from "zod";

export const signupSchema = z
  .object({
    firstName: z
      .string()
      .min(1, "First name is required.")
      .max(150, "First name is too long."),

    lastName: z
      .string()
      .max(150, "Last name is too long."),

    email: z
      .string()
      .email("Please enter a valid email address."),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters."),

    passwordConfirmation: z.string(),
  })
  .refine(
    (data) => data.password === data.passwordConfirmation,
    {
      path: ["passwordConfirmation"],
      message: "Passwords do not match.",
    }
  );

export type SignupFormValues = z.infer<typeof signupSchema>;