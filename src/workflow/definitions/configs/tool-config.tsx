"use client";

import { NodeConfigProps } from "@/workflow/types";
import { ToolConfig } from "../tool";

export function ToolConfigForm({
  value,
  onChange,
}: NodeConfigProps<ToolConfig>) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Tool
        </label>

        <input
          value={value.tool}
          onChange={(event) =>
            onChange({
              ...value,
              tool: event.target.value,
            })
          }
          placeholder="search"
          className="h-9 w-full rounded-md border bg-background px-3 text-sm"
        />

        <p className="text-xs text-muted-foreground">
          The tool name is resolved by the workflow runtime.
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Input
        </label>

        <textarea
          value={
            typeof value.input === "string"
              ? value.input
              : JSON.stringify(value.input, null, 2)
          }
          onChange={(event) => {
            const rawValue = event.target.value;

            try {
              const parsed = JSON.parse(rawValue);

              if (
                parsed &&
                typeof parsed === "object" &&
                !Array.isArray(parsed)
              ) {
                onChange({
                  ...value,
                  input: parsed,
                });
                return;
              }
            } catch {
              // Treat non-JSON input as a string.
            }

            onChange({
              ...value,
              input: rawValue,
            });
          }}
          placeholder="{{input.query}}"
          rows={8}
          className="w-full resize-none rounded-md border bg-background p-3 font-mono text-xs"
        />

        <p className="text-xs text-muted-foreground">
          Use text, a workflow reference, or a JSON object.
        </p>
      </div>
    </div>
  );
}
