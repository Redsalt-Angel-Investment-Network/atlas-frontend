import { z } from "zod";

export const entityAttributeFormSchema = z.object({
  field_id: z.string().min(1, "fieldIdRequired"),
  value: z.unknown(),
});

export const entityFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "nameRequired")
    .max(255, "nameMaxLength"),

  category_id: z
    .string()
    .min(1, "categoryRequired"),

  attributes: z.array(entityAttributeFormSchema),
});

export type EntityAttributeFormValues = z.infer<
  typeof entityAttributeFormSchema
>;

export type EntityFormValues = z.infer<
  typeof entityFormSchema
>;