import { z } from "zod";

export function loginSchema(t: (key: "emailInvalid" | "passwordRequired") => string) {
  return z.object({
    email: z.string().email(t("emailInvalid")),
    password: z.string().min(6, t("passwordRequired")),
  });
}

export type LoginFormValues = z.infer<ReturnType<typeof loginSchema>>;
