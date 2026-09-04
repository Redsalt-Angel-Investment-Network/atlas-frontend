"use client";

import { Control, UseFormRegister, FieldErrors, Controller } from "react-hook-form";
import { X } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

import { CategoryFormValues, FIELD_TYPES } from "../schema";

interface SchemaFieldItemProps {
  id: string;
  index: number;
  register: UseFormRegister<CategoryFormValues>;
  control: Control<CategoryFormValues>;
  errors: FieldErrors<CategoryFormValues>;
  onRemove: (index: number) => void;
  t: (key: string, values?: Record<string, any>) => string;
}

export function SchemaFieldItem({
  index,
  register,
  control,
  errors,
  onRemove,
  t,
}: SchemaFieldItemProps) {
  const fieldError = errors.schema?.fields?.[index]?.name?.message;

  return (
    <div className="group grid grid-cols-15 gap-2 items-start rounded-md border border-border/60 bg-muted/20 p-2 transition-colors hover:border-border hover:bg-muted/40">
      {/* Field Key*/}
      <div className="col-span-8 relative">
        <Input
          placeholder={t("schemaFields.keyPlaceholder")}
          {...register(`schema.fields.${index}.name`, {
            required: t("zodValidation.fieldNameRequired"),
            pattern: {
              value: /^[a-zA-Z][a-zA-Z0-9_]*$/,
              message: t("zodValidation.regexPattern"),
            },
          })}
          className={`h-8 font-mono text-xs shadow-none ${
            fieldError ? "border-destructive focus-visible:ring-destructive" : ""
          }`}
        />
        {fieldError && (
          <p className="text-[10px] p-1 font-medium text-destructive leading-tight px-0.5">
            {t(fieldError)}
          </p>
        )}
      </div>

      {/* Field Type Select (4 cols) */}
      <div className="col-span-4">
        <Controller
          name={`schema.fields.${index}.type`}
          control={control}
          rules={{ required: t("schemaFields.typeRequired") }}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="h-8 text-xs font-mono shadow-none">
                <SelectValue placeholder={t("schemaFields.typeSelectPlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                {FIELD_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value} className="text-xs font-mono">
                    {t(`schemaFields.types.${type.value}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      {/* Required Toggle (2 cols) */}
      <div className="col-span-2 flex justify-center">
        <Controller
          name={`schema.fields.${index}.required`}
          control={control}
          render={({ field }) => (
            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
              className="scale-75 mt-1.5"
            />
          )}
        />
      </div>

      {/* Delete Row Action (1 col) */}
      <div className="col-span-1 flex justify-end">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => onRemove(index)}
          className="h-7 w-7 text-muted-foreground hover:text-destructive shrink-0"
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}