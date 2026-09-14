"use client";

import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { AlertCircle, Layers } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { CreateEntityAttributePayload, CreateEntityPayload } from "@/_types/entities";
import { CategorySchemaType, CategoryType } from "@/_types/category";
import { entityFormSchema, EntityFormValues } from "@/app/(workspace)/entities/schema";
import { EntityField } from "@/app/(workspace)/entities/components/EntityField";

interface CreateEntityDrawerProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  categories: CategoryType[];
  onSubmitApi?: (data: CreateEntityPayload) => Promise<void>;
}

// HELPER FUNCTIONS

function getCategorySchema(category: CategoryType | undefined) {
  if (!category) return null;
  const schema = category.schema as CategorySchemaType;
  if (!schema?.id) return null;
  const fields = schema.fields ?? [];
  if (fields.some((field) => !field.id)) return null;
  return {
    id: schema.id,
    category_id: category.id,
    version: schema.version ?? 1,
    fields: fields
      .map((field) => ({
        id: field.id,
        name: field.name,
        type: field.type,
        required: field.required,
        position: field.position ?? 0,
      }))
      .sort((a, b) => a.position - b.position),
  };
}

function normalizeValue(value: unknown, type: string) {
  const t = type.toLowerCase();
  if (t === "boolean") return Boolean(value);
  if (t === "number") {
    if (value === "" || value === null || value === undefined) return null;
    const num = Number(value);
    if (!Number.isFinite(num)) throw new Error("invalidNumber");
    return num;
  }
  if (t === "json") {
    if (value === "" || value === null || value === undefined) return null;
    try { return JSON.parse(String(value)); } catch { throw new Error("invalidJson"); }
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed === "" ? null : trimmed;
  }
  return value;
}

// MAIN COMPONENT

export function CreateEntityDrawer({
  isOpen = false,
  onOpenChange = () => { },
  categories,
  onSubmitApi = async () => { },
}: CreateEntityDrawerProps) {
  const t = useTranslations("entities.createEntityForm");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<EntityFormValues>({
    resolver: zodResolver(entityFormSchema),
    defaultValues: { name: "", category_id: "", attributes: [] },
  });

  const selectedCategoryId = watch("category_id");
  const selectedCategory = useMemo(
    () => categories.find((c) => c.id === selectedCategoryId),
    [categories, selectedCategoryId]
  );
  const categorySchema = useMemo(() => getCategorySchema(selectedCategory), [selectedCategory]);
  const schemaFields = categorySchema?.fields ?? [];

  useEffect(() => {
    if (!selectedCategory) { setValue("attributes", []); return; }
    const schema = getCategorySchema(selectedCategory);
    if (!schema) { setValue("attributes", []); return; }
    setValue(
      "attributes",
      schema.fields.map((field) => ({
        field_id: field.id,
        value: field.type.toLowerCase() === "boolean" ? false : "",
      })),
      { shouldValidate: false, shouldDirty: false }
    );
    setSubmitError(null);
  }, [selectedCategory, setValue]);

  useEffect(() => {
    if (!isOpen) {
      reset({ name: "", category_id: "", attributes: [] });
      setSubmitError(null);
    }
  }, [isOpen, reset]);

  const handleCategoryChange = (id: string) =>
    setValue("category_id", id, { shouldValidate: true, shouldDirty: true });

  const onSubmit = async (values: EntityFormValues) => {
    setSubmitError(null);
    if (!categorySchema) {
      setSubmitError(t("validation.schemaNotFound"));
      return;
    }

    try {
      const attributes: CreateEntityAttributePayload[] = schemaFields.map(
        (field, i) => ({
          field_id: field.id,
          value: normalizeValue(
            values.attributes[i]?.value,
            field.type,
          ),
        }),
      );
      await onSubmitApi({
        category_id: selectedCategoryId,
        category_schema_id: categorySchema.id,
        name: values.name.trim(),
        attributes,
      });

      reset({ name: "", category_id: "", attributes: [] });
      setSubmitError(null);
      onOpenChange(false);
    } catch (error) {
      const key = error instanceof Error ? error.message : "createFailed";
      setSubmitError(
        key === "invalidNumber" ? t("validation.invalidNumber") :
          key === "invalidJson" ? t("validation.invalidJson") :
            key || t("toast.error")
      );
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-xl flex flex-col h-full p-0">
        <SheetHeader className="px-6 pt-6 pb-4 border-b shrink-0">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2.5"><Layers className="h-5 w-5 text-primary" /></div>
            <div>
              <SheetTitle className="text-xl font-bold tracking-tight">{t("title")}</SheetTitle>
              <SheetDescription className="text-sm text-muted-foreground">{t("description")}</SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            {/* Basic Details */}
            <section className="space-y-6">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t("basicDetails")}</h3>

              {/* Category */}
              <div className="space-y-2.5">
                <label className="text-sm font-medium text-foreground block">
                  {t("fields.category.label")} <span className="ml-1 text-destructive">*</span>
                </label>
                <Controller
                  control={control}
                  name="category_id"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={handleCategoryChange}>
                      <SelectTrigger className="w-full rounded-lg border-border/60 bg-background transition-colors focus:border-primary/50 focus:ring-2 focus:ring-primary/20">
                        <SelectValue placeholder={t("fields.category.placeholder")} />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.filter((c) => c.is_active).map((c) => (
                          <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.category_id?.message && <p className="text-xs text-destructive">{t(`validation.${errors.category_id.message}`)}</p>}
              </div>

              {/* Entity Name */}
              <div className="space-y-2.5">
                <label htmlFor="entity-name" className="text-sm font-medium text-foreground block">
                  {t("fields.name.label")} <span className="ml-1 text-destructive">*</span>
                </label>
                <Input
                  id="entity-name"
                  placeholder={t("fields.name.placeholder")}
                  className="rounded-lg border-border/60 bg-background transition-colors focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                  {...register("name")}
                />
                {errors.name?.message && <p className="text-xs text-destructive">{t(`validation.${errors.name.message}`)}</p>}
              </div>

              {/* Schema Info */}
              {categorySchema && (
                <div className="flex items-center gap-3 rounded-lg bg-muted/30 border border-border/40 px-4 py-2.5">
                  <Layers className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {t("fields.schemaVersion")}: <span className="font-medium text-foreground">{categorySchema.version}</span>
                  </span>
                  <span className="text-xs text-muted-foreground/30">•</span>
                  <span className="text-xs text-muted-foreground">
                    {schemaFields.length} {schemaFields.length === 1 ? "field" : "fields"}
                  </span>
                </div>
              )}
            </section>

            {/* Attributes */}
            {categorySchema && (
              <>
                <Separator className="bg-border/40" />
                <section className="space-y-4">
                  <div>
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{t("attributes.title")}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">{t("attributes.description")}</p>
                  </div>
                  {schemaFields.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-border/60 p-6 text-center">
                      <p className="text-sm text-muted-foreground">{t("attributes.noFields")}</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {schemaFields.map((field, index) => (
                        <EntityField
                          key={field.id}
                          field={field}
                          control={control}
                          index={index}
                          error={errors.attributes?.[index]?.value?.message}
                        />
                      ))}
                    </div>
                  )}
                </section>
              </>
            )}

            {!selectedCategoryId && !errors.category_id && (
              <div className="rounded-lg border border-dashed border-border/60 p-6 text-center">
                <p className="text-sm text-muted-foreground">{t("attributes.selectCategory")}</p>
              </div>
            )}

            {submitError && (
              <div className="flex gap-3 rounded-lg border border-destructive/20 bg-destructive/5 p-4">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                <p className="text-sm text-destructive">{submitError}</p>
              </div>
            )}
          </div>

          <SheetFooter className="px-6 py-4 border-t bg-background shrink-0 flex-col">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="w-full rounded-lg transition-all hover:bg-muted"
            >
              {t("buttons.cancel")}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !selectedCategory}
              className="w-full rounded-lg bg-primary transition-all hover:bg-primary/90 active:scale-[0.98]"
            >
              {isSubmitting ? t("buttons.creating") : t("buttons.create")}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}