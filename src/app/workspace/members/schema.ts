import { z } from "zod";

export const inviteMemberSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
});

export type InviteMemberInput = z.infer<typeof inviteMemberSchema>;
export type InviteMemberErrors = Partial<Record<keyof InviteMemberInput, string>>;