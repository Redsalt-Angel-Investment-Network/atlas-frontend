"use client";

import { NodeConfigProps } from "@/workflow/types";
import { ConditionConfig } from "../condition";

const operators: Array<{
  label: string;
  value: ConditionConfig["operator"];
}> = [
  { label: "Equals", value: "equals" },
  { label: "Does not equal", value: "notEquals" },
  { label: "Contains", value: "contains" },
  { label: "Does not contain", value: "notContains" },
  { label: "Greater than", value: "greaterThan" },
  {
    label: "Greater than or equal",
    value: "greaterThanOrEqual",
  },
  { label: "Less than", value: "lessThan" },
  {
    label: "Less than or equal",
    value: "lessThanOrEqual",
  },
  { label: "Is empty", value: "isEmpty" },
  { label: "Is not empty", value: "isNotEmpty" },
];

export function ConditionConfigForm({
  value,
  onChange,
}: NodeConfigProps<ConditionConfig>) {
  const showRightValue =
    value.operator !== "isEmpty" &&
    value.operator !== "isNotEmpty";

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Value
        </label>

        <input
          value={
            typeof value.left === "string"
              ? value.left
              : JSON.stringify(value.left)
          }
          onChange={(event) =>
            onChange({
              ...value,
              left: event.target.value,
            })
          }
          placeholder="{{input.status}}"
          className="h-9 w-full rounded-md border bg-background px-3 text-sm"
        />

        <p className="text-xs text-muted-foreground">
          Use a workflow value such as {"{{input.status}}"}.
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Operator
        </label>

        <select
          value={value.operator}
          onChange={(event) =>
            onChange({
              ...value,
              operator:
                event.target.value as ConditionConfig["operator"],
            })
          }
          className="h-9 w-full rounded-md border bg-background px-3 text-sm"
        >
          {operators.map((operator) => (
            <option
              key={operator.value}
              value={operator.value}
            >
              {operator.label}
            </option>
          ))}
        </select>
      </div>

      {showRightValue && (
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Compare with
          </label>

          <input
            value={
              typeof value.right === "string"
                ? value.right
                : JSON.stringify(value.right)
            }
            onChange={(event) =>
              onChange({
                ...value,
                right: event.target.value,
              })
            }
            placeholder="active"
            className="h-9 w-full rounded-md border bg-background px-3 text-sm"
          />
        </div>
      )}
    </div>
  );
}
