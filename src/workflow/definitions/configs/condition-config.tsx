"use client";

import { NodeConfigProps } from "@/workflow/types";
import { ConditionConfig } from "../condition";

export function ConditionConfigForm({
  value,
  onChange,
}: NodeConfigProps<ConditionConfig>) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Expression
        </label>

        <textarea
          value={value.expression}
          onChange={(event) =>
            onChange({
              ...value,
              expression: event.target.value,
            })
          }
          placeholder="e.g. input.status === 'active'"
          rows={6}
          className="w-full resize-none rounded-md border bg-background p-3 font-mono text-xs"
        />

        <p className="text-xs text-muted-foreground">
          The expression should evaluate to true or false.
        </p>
      </div>
    </div>
  );
}