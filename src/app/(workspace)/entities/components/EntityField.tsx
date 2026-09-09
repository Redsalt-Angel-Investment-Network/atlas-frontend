"use client";

import { Controller, Control } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EntityFormValues } from "@/app/(workspace)/entities/schema";
import { EntitySchemaField } from "@/_types/entities";

// HELPER FUNCTIONS

function getInputType(fieldType: string): string {
  switch (fieldType.toLowerCase()) {
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

function getBadgeColor(type: string): string {
  switch (type.toLowerCase()) {
    case "text":
      return "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400";
    case "number":
      return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400";
    case "boolean":
      return "bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400";
    case "date":
      return "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400";
    case "json":
      return "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400";
    default:
      return "bg-gray-50 text-gray-700 dark:bg-gray-800/40 dark:text-gray-400";
  }
}

// COMPONENT

interface EntityFieldProps {
  field: EntitySchemaField;
  control: Control<EntityFormValues>;
  index: number;
  error?: string;
}

export function EntityField({
  field,
  control,
  index,
  error,
}: EntityFieldProps) {
  const t = useTranslations("entities.createEntityForm");
  const fieldType = field.type.toLowerCase();

  if (fieldType === "boolean") {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/20 px-4 py-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">
                {field.name}
              </span>
              {field.required && (
                <span className="text-xs font-medium text-destructive">*</span>
              )}
              <span
                className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${getBadgeColor(field.type)}`}
              >
                {field.type}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {field.required ? "Required" : "Optional"}
            </p>
          </div>
          <Controller
            control={control}
            name={`attributes.${index}.value`}
            render={({ field: controllerField }) => (
              <Switch
                checked={controllerField.value === true}
                onCheckedChange={controllerField.onChange}
              />
            )}
          />
        </div>
        {error && (
          <p className="text-xs text-destructive">{t(`validation.${error}`)}</p>
        )}
      </div>
    );
  }

  if (fieldType === "json") {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-foreground">
            {field.name}
          </label>
          {field.required && (
            <span className="text-xs font-medium text-destructive">*</span>
          )}
          <span
            className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${getBadgeColor(field.type)}`}
          >
            {field.type}
          </span>
        </div>
        <Textarea
          placeholder={t("fields.valuePlaceholder", { field: field.name })}
          className="min-h-[100px] rounded-lg border-border/60 bg-background font-mono text-sm transition-colors focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
          {...control.register(`attributes.${index}.value`)}
        />
        {error && (
          <p className="text-xs text-destructive">{t(`validation.${error}`)}</p>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border/60 bg-muted/20 px-4 py-3">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-foreground">
            {field.name}
          </label>
          {field.required && (
            <span className="text-xs font-medium text-destructive">*</span>
          )}
          <span
            className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${getBadgeColor(field.type)}`}
          >
            {field.type}
          </span>
        </div>
        <Input
          type={getInputType(field.type)}
          placeholder={t("fields.valuePlaceholder", { field: field.name })}
          className="rounded-lg border-border/60 bg-background transition-colors focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
          {...control.register(`attributes.${index}.value`)}
        />
        {error && (
          <p className="text-xs text-destructive">{t(`validation.${error}`)}</p>
        )}
      </div>
    </div>
  );
}
