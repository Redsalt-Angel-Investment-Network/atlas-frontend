import { z } from "zod";

export const createWorkflowSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, { message: "nameRequired" })
      .max(80, { message: "nameMaxLength" }),

    description: z
      .string()
      .trim()
      .max(250, { message: "descriptionMaxLength" })
      .optional()
      .or(z.literal("")),

    triggerType: z.enum(["webhook", "schedule", "event", "manual"], {
      message: "triggerTypeRequired",
    }),

    cronExpression: z.string().optional(),
    eventKey: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.triggerType === "schedule") {
      const cron = data.cronExpression?.trim() ?? "";
      if (!cron) {
        ctx.addIssue({
          code: "custom",
          path: ["cronExpression"],
          message: "cronRequired",
        });
      } else if (!isValidCron(cron)) {
        ctx.addIssue({
          code: "custom",
          path: ["cronExpression"],
          message: "cronInvalid",
        });
      }
    }

    if (data.triggerType === "event") {
      const key = data.eventKey?.trim() ?? "";
      if (!key) {
        ctx.addIssue({
          code: "custom",
          path: ["eventKey"],
          message: "eventKeyRequired",
        });
      } else if (!/^[a-z0-9]+(?:\.[a-z0-9]+)+$/i.test(key)) {
        ctx.addIssue({
          code: "custom",
          path: ["eventKey"],
          message: "eventKeyPattern",
        });
      }
    }
  });

export type CreateWorkflowInput = z.infer<typeof createWorkflowSchema>;

function isValidCron(expr: string): boolean {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) return false;
  const fieldPattern = /^(\*|[0-9,\-*/]+)$/;
  return parts.every((p) => fieldPattern.test(p));
}