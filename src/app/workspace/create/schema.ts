import { z } from "zod";

export const createWorkspaceSchema = z.object({
  name: z
    .string()
    .min(2, "Workspace name must be at least 2 characters")
    .max(50, "Workspace name must be under 50 characters"),
  description: z
    .string()
    .max(200, "Description must be under 200 characters")
    .optional(),
});

export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>;
export type CreateWorkspaceErrors = Partial<
  Record<keyof CreateWorkspaceInput, string>
>;