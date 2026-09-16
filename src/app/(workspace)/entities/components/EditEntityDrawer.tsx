"use client";

import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Layers } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";

import { CategoryType } from "@/_types/category";
import {
  Entity,
  EntitySchemaField,
  UpdateEntityPayload,
} from "@/_types/entities";
import {
  entityFormSchema,
  EntityFormValues,
} from "@/app/(workspace)/entities/schema";

type RuntimeSchemaField = {
  id?: string;
  name: string;
  type: string;
  required: boolean;
  position: number;
};

type RuntimeCategorySchema = {
  id?: string;
  fields?: RuntimeSchemaField[];
};

interface EditEntityDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: Entity | null;
  categories: CategoryType[];
  onSubmitApi: (data: UpdateEntityPayload) => Promise<void>;
}

function getSchemaFields(
  category: CategoryType | undefined,
): EntitySchemaField[] {
  if (!category) return [];

  const schema = category.schema as unknown as RuntimeCategorySchema;

  return [...(schema.fields ?? [])]
    .filter((field): field is RuntimeSchemaField & { id: string } =>
      Boolean(field.id),
    )
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
    .map((field) => ({
      id: field.id,
      name: field.name,
      type: field.type,
      required: field.required,
      position: field.position,
    }));
}

function getInputType(type: string): string {
  switch (type.toLowerCase()) {
    case "number":
      return "number";
    case "date":
      return "date";
    case "datetime":
      return "datetime-local";
    default:
      return "text";
  }
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "object") {
    return JSON.stringify(value, null, 2);
  }

  return String(value);
}

function normalizeValue(value: unknown, fieldType: string): string {
  if (value === null || value === undefined) {
    return "";
  }

  if (fieldType.toLowerCase() === "json") {
    if (typeof value === "string") {
      return value.trim();
    }

    return JSON.stringify(value);
  }

  return String(value);
}

export function EditEntityDrawer({
  isOpen,
  onOpenChange,
  initialData,
  categories,
  onSubmitApi,
}: EditEntityDrawerProps) {
  const t = useTranslations("entities.editEntityForm");

  const errMsg = (key?: string) =>
    key ? t(`validation.${key}` as never) : undefined;

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EntityFormValues>({
    resolver: zodResolver(entityFormSchema),
    defaultValues: {
      name: "",
      category_id: "",
      attributes: [],
    },
  });

  const category = useMemo(
    () => categories.find((item) => item.id === initialData?.category_id),
    [categories, initialData?.category_id],
  );

  const fields = useMemo(() => getSchemaFields(category), [category]);

  useEffect(() => {
    if (!initialData) {
      reset({
        name: "",
        category_id: "",
        attributes: [],
      });
      return;
    }

    reset({
      name: initialData.name,
      category_id: initialData.category_id,
      attributes: fields.map((field) => ({
        field_id: field.id,
        value:
          initialData.attributes.find(
            (attribute) => attribute.field_id === field.id,
          )?.value ?? "",
      })),
    });
  }, [initialData, fields, reset]);

  const onSubmit = async (values: EntityFormValues) => {
    if (!initialData) return;

    const attributes = fields
      .map((field, index) => ({
        field_id: field.id,
        value: normalizeValue(values.attributes[index]?.value, field.type),
      }))
      .filter((attribute) => attribute.value.trim() !== "");

    const payload: UpdateEntityPayload = {
      name: values.name.trim(),
      attributes,
    };

    await onSubmitApi(payload);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="flex h-full flex-col px-6 sm:max-w-lg sm:px-8">
        <SheetHeader className="px-0">
          <SheetTitle className="flex items-center gap-2 text-xl">
            <Layers className="h-5 w-5 text-primary" />
            {t("title")}
          </SheetTitle>

          <SheetDescription>{t("description")}</SheetDescription>
        </SheetHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-1 flex-col overflow-hidden"
        >
          <div className="flex-1 space-y-7 overflow-y-auto pt-8 pb-6 pr-2">
            {/* Entity Name */}
            <div className="space-y-2.5">
              <label className="text-sm font-medium">
                {t("fields.name.label")}
              </label>

              <Input
                {...register("name")}
                placeholder={t("fields.name.placeholder")}
                className="rounded-lg"
              />

              {errors.name && (
                <p className="text-xs text-destructive">
                  {errMsg(errors.name.message)}
                </p>
              )}
            </div>

            {/* Category */}
            <div className="space-y-2.5">
              <label className="text-sm font-medium">
                {t("fields.category.label")}
              </label>

              <Input
                value={category?.name ?? t("fields.category.unknown")}
                disabled
                className="rounded-lg"
              />

              <p className="text-xs text-muted-foreground">
                {t("fields.category.readOnly")}
              </p>
            </div>

            {/* Dynamic Fields */}
            {fields.length > 0 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold">
                    {t("attributes.title")}
                  </h3>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {t("attributes.description")}
                  </p>
                </div>

                {fields.map((field, index) => (
                  <Controller
                    key={field.id}
                    control={control}
                    name={`attributes.${index}.value`}
                    render={({ field: controllerField }) => (
                      <EditField
                        field={field}
                        value={controllerField.value}
                        onChange={controllerField.onChange}
                        error={errors.attributes?.[index]?.value?.message}
                        t={t}
                      />
                    )}
                  />
                ))}
              </div>
            )}

            {fields.length === 0 && (
              <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                {t("attributes.noFields")}
              </div>
            )}
          </div>

          <SheetFooter className="border-t pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              {t("buttons.cancel")}
            </Button>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? t("buttons.saving") : t("buttons.save")}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}

interface EditFieldProps {
  field: EntitySchemaField;
  value: unknown;
  onChange: (value: unknown) => void;
  error?: string;
  t: ReturnType<typeof useTranslations<"entities.editEntityForm">>;
}

function EditField({ field, value, onChange, error, t }: EditFieldProps) {
  const type = field.type.toLowerCase();

  return (
    <div className="space-y-2 rounded-lg border border-border/60 bg-muted/20 p-4">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">{field.name}</label>

        {field.required && <span className="text-xs text-destructive">*</span>}

        <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium">
          {field.type}
        </span>
      </div>

      {type === "boolean" ? (
        <Switch
          checked={value === true || value === "true"}
          onCheckedChange={onChange}
        />
      ) : type === "json" ? (
        <Textarea
          value={formatValue(value)}
          onChange={(event) => onChange(event.target.value)}
          placeholder={t("fields.valuePlaceholder", {
            field: field.name,
          })}
          className="min-h-[100px] font-mono text-sm"
        />
      ) : (
        <Input
          type={getInputType(field.type)}
          value={formatValue(value)}
          onChange={(event) => onChange(event.target.value)}
          placeholder={t("fields.valuePlaceholder", {
            field: field.name,
          })}
          className="rounded-lg"
        />
      )}

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
