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
import { useEffect, useRef, useState } from "react";
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

          if (field.type === "json") {
            return (
              <JsonField
                value={
                  (controllerField.value as
                    | Record<string, unknown>
                    | unknown[]) ?? {}
                }
                onChange={controllerField.onChange}
                placeholder={field.placeholder}
              />
            );
          }

          if (field.type === "number") {
            return (
              <Input
                type="number"
                value={controllerField.value ?? ""}
                min={field.min}
                max={field.max}
                step={field.step ?? "any"}
                placeholder={field.placeholder}
                onChange={(event) => {
                  const value = event.target.value;

                  controllerField.onChange(
                    value === "" ? null : Number(value)
                  );
                }}
              />
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

type JsonValue =
  | Record<string, unknown>
  | unknown[];

function JsonField({
  value,
  onChange,
  placeholder,
}: {
  value: JsonValue;
  onChange: (value: JsonValue) => void;
  placeholder?: string;
}) {
  const [text, setText] = useState(() =>
    JSON.stringify(value ?? {}, null, 2),
  );

  const [isFocused, setIsFocused] = useState(false);

  const displayValue = isFocused
    ? text
    : JSON.stringify(value ?? {}, null, 2);

  const isValidJsonValue = (
    parsed: unknown,
  ): parsed is JsonValue => {
    return (
      parsed !== null &&
      typeof parsed === "object"
    );
  };

  return (
    <Textarea
      value={displayValue}
      onFocus={() => {
        setIsFocused(true);
        setText(JSON.stringify(value ?? {}, null, 2));
      }}
      onBlur={() => {
        setIsFocused(false);

        try {
          const parsed = JSON.parse(text);

          if (isValidJsonValue(parsed)) {
            onChange(parsed);
            setText(JSON.stringify(parsed, null, 2));
          }
        } catch {
          // Keep the user's text so they can correct it.
        }
      }}
      onChange={(event) => {
        const nextText = event.target.value;

        setText(nextText);

        try {
          const parsed = JSON.parse(nextText);

          if (isValidJsonValue(parsed)) {
            onChange(parsed);
          }
        } catch {
          // JSON is temporarily invalid while typing.
        }
      }}
      placeholder={placeholder}
    />
  );
}