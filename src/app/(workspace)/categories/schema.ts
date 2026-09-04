import { z } from "zod";

export const FIELD_TYPES = [
  { value: "text", label: "Text" },
  { value: "number", label: "Number" },
  { value: "boolean", label: "Boolean" },
  { value: "date", label: "Date" },
  { value: "json", label: "JSON" },
  { value: "select", label: "Select" },
] as const;

export type FieldType = typeof FIELD_TYPES[number]["value"];

export const categoryFieldSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "zodValidation.fieldNameRequired")
    .regex(
      /^[a-zA-Z][a-zA-Z0-9_]*$/,
      "zodValidation.regexPattern" // Use letters, numbers, and underscores only
    ),

  type: z.string().min(1, "zodValidation.typeRequired"),

  required: z.boolean(),

  position: z.number(),
});

export const categoryFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "zodValidation.nameRequired")
    .max(100, "zodValidation.nameMaxLength"),

  description: z
    .string()
    .trim()
    .max(500, "zodValidation.descriptionMaxLength")
    .optional()
    .or(z.literal("")),

  is_active: z.boolean(),

  schema: z.object({
    fields: z.array(categoryFieldSchema),
  }),
});

export type CategoryFieldFormValues = z.infer<typeof categoryFieldSchema>;

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function createEmptyField(position: number): CategoryFieldFormValues {
  return {
    name: "",
    type: "text",
    required: false,
    position,
  };
}