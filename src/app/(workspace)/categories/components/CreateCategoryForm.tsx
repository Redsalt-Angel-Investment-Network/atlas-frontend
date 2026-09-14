"use client";

import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Layers, Plus } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Field } from "@/components/ui/field";

import { SchemaFieldItem } from "./SchemaFieldItem";
import {
  categoryFormSchema,
  createEmptyField,
  type CategoryFormValues,
} from "../schema";
import { useState } from "react";
import { CreateCategoryPayload } from "@/_types/category";
import { toast } from "sonner";

interface CreateCategorySheetProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSubmitApi?: (data: CreateCategoryPayload) => Promise<void>;
}

export function CreateCategoryDrawer({
  isOpen,
  onOpenChange,
  onSubmitApi,
}: CreateCategorySheetProps) {
  const t = useTranslations("categories.createCategoryForm");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
      description: "",
      is_active: true,
      schema: {
        fields: [],
      },
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "schema.fields",
  });

  const onSubmit = async (values: CategoryFormValues) => {
    if (!onSubmitApi) return;
    try {
      await onSubmitApi({
        ...values,
        schema: values.schema.fields.map((field) => ({ ...field })),
      });
      reset();
      onOpenChange?.(false);
    } catch (err) {
      toast.error(t("createCategoryForm.toast.error"));
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) setSubmitError(null);
    onOpenChange?.(open);
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent className="sm:max-w-3xl w-full flex flex-col h-full p-0">
        <SheetHeader className="px-6 pt-6 pb-4 border-b">
          <SheetTitle className="flex items-center gap-2 text-xl">
            <Layers className="h-5 w-5 text-primary" /> {t("title")}
          </SheetTitle>
          <SheetDescription>{t("description")}</SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
            {/* Basic Details */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                {t("basicDetails")}
              </h3>

              <Field label={t("fields.name.label")} required error={errors.name?.message && t(errors.name.message)}>
                <Input
                 placeholder={t("fields.name.placeholder")} 
                 {...register("name", {
                    required: t("zodValidation.nameRequired"),
                    maxLength: {
                      value: 100,
                      message: t("zodValidation.nameMaxLength"),
                    },
                })} />
              </Field>

              <Field label={t("fields.description.label")} error={errors.description?.message && t(errors.description.message)}>
                <Textarea
                  placeholder={t("fields.description.placeholder")}
                  className="resize-none"
                  rows={3}
                  {...register("description", {
                    required: t("zodValidation.descriptionMaxLength"),
                    maxLength: {
                      value: 500,
                      message: t("zodValidation.descriptionMaxLength"),
                    },
                  })}
                />
              </Field>

              <Controller
                name="is_active"
                control={control}
                render={({ field }) => (
                  <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium text-foreground block">
                        {t("fields.isActive.label")}
                      </label>
                      <p className="text-xs text-muted-foreground">
                        {t("fields.isActive.description")}
                      </p>
                    </div>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </div>
                )}
              />
            </div>

            <Separator />

            {/* Schema Columns Section */}
            <div className="space-y-3">
              <div className="space-y-1">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  {t("schemaFields.title")}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {t("schemaFields.subtitle")}
                </p>
              </div>
              {/* Column Rows */}
              {fields.length === 0 ? (
                <div className="border border-dashed rounded-md p-6 text-center text-xs text-muted-foreground">
                  {t("schemaFields.emptyState")}
                </div>
              ) : (
                <div className="space-y-2">
                  {fields.map((fieldItem, index) => (
                    <SchemaFieldItem
                      key={fieldItem.id}
                      id={fieldItem.id}
                      index={index}
                      register={register}
                      control={control}
                      errors={errors}
                      onRemove={remove}
                    />
                  ))}
                </div>
              )}

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append(createEmptyField(fields.length))}
                className="w-full h-8 text-xs font-medium border-dashed gap-1.5 mt-2"
              >
                <Plus className="h-3.5 w-3.5" />
                {t("schemaFields.addField")}
              </Button>
            </div>
          </div>

          <SheetFooter className="px-6 py-4 border-t bg-background">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              {t("buttons.cancel")}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? t("buttons.submitting") : t("buttons.submit")}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}