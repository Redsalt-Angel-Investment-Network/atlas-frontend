"use client";

import {
  Controller,
  useForm,
  type Control,
  type FieldValues,
} from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import type { NodeField } from "@/workflow/types";
import { useEffect } from "react";
import { WorkflowValidationIssue } from "@/workflow/validation/workflow";

type NodeConfigFormProps = {
  definition: {
    fields?: NodeField[];
  };
  value: Record<string, unknown>;
  validationIssues: WorkflowValidationIssue[];
  onChange: (value: Record<string, unknown>) => void;
};

export function NodeConfigForm({
  definition,
  value,
  validationIssues,
  onChange,
}: NodeConfigFormProps) {
  const form = useForm<Record<string, unknown>>({
    defaultValues: value,
  });

  useEffect(() => {
    form.reset(value);
  }, [value, form]);

  const fields = definition.fields ?? [];

  return (
    <form
      onChange={() => {
        onChange(form.getValues());
      }}
      className="space-y-5"
    >
      {fields.map((field) => {
        const fieldIssues = validationIssues.filter(
          (issue) => issue.field === field.name
        );

        return (
          <ConfigField
            key={field.name}
            field={field}
            control={form.control}
            issues={fieldIssues}
          />
        );
      })}
    </form>
  );
}

type ConfigFieldProps = {
  field: NodeField;
  control: Control<FieldValues>;
  error?: {
    message?: string;
  };
  issues: WorkflowValidationIssue[];
};

function ConfigField({
  field,
  control,
  error,
  issues,
}: ConfigFieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">
        {field.label}
      </label>

      <Controller
        name={field.name}
        control={control}
        render={({ field: controllerField }) => {
          if (field.type === "select") {
            return (
              <select
                {...controllerField}
                className="h-9 w-full rounded-md border bg-background px-3 text-sm"
              >
                {field.options.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            );
          }

          if (field.type === "textarea") {
            return (
              <Textarea
                {...controllerField}
                placeholder={field.placeholder}
              />
            );
          }

          return (
            <Input
              {...controllerField}
              type={
                field.type === "url"
                  ? "url"
                  : "text"
              }
              placeholder={field.placeholder}
            />
          );
        }}
      />

      {field.description && (
        <p className="text-xs text-muted-foreground">
          {field.description}
        </p>
      )}

      {error?.message && (
        <p className="text-xs text-destructive">
          {error.message}
        </p>
      )}

      {issues.map((issue) => (
        <p
          key={issue.id}
          className={
            issue.severity === "error"
              ? "text-xs text-destructive"
              : "text-xs text-yellow-600"
          }
        >
          {issue.message}
        </p>
      ))}
    </div>
  );
}