import { z } from "zod";

export function signupSchema(
  t: (
    key:
      | "firstNameRequired"
      | "firstNameTooLong"
      | "lastNameTooLong"
      | "emailInvalid"
      | "passwordMin"
      | "passwordMismatch",
  ) => string,
) {
  return z
    .object({
      firstName: z.string().min(1, t("firstNameRequired")).max(150, t("firstNameTooLong")),
      lastName: z.string().max(150, t("lastNameTooLong")),
      email: z.string().email(t("emailInvalid")),
      password: z.string().min(8, t("passwordMin")),
      passwordConfirmation: z.string(),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
      path: ["passwordConfirmation"],
      message: t("passwordMismatch"),
    });
}

export type SignupFormValues = z.infer<ReturnType<typeof signupSchema>>;
