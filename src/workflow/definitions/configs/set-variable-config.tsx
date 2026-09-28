"use client";

import { NodeConfigProps } from "@/workflow/types";
import { SetVariableConfig } from "../set-variable";

export function SetVariableConfigForm({
  value,
  onChange,
}: NodeConfigProps<SetVariableConfig>) {
  const isSetOperation = value.operation === "set";

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Operation
        </label>

        <select
          value={value.operation}
          onChange={(event) => {
            const operation = event.target.value;

            if (operation === "set") {
              onChange({
                operation: "set",
                name: "",
                value: "",
              });
              return;
            }

            onChange({
              operation: "transform",
              values: {},
            });
          }}
          className="h-9 w-full rounded-md border bg-background px-3 text-sm"
        >
          <option value="set">Set</option>
          <option value="transform">Transform</option>
        </select>
      </div>

      {isSetOperation ? (
        <>
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Variable Name
            </label>

            <input
              value={value.name}
              onChange={(event) =>
                onChange({
                  ...value,
                  name: event.target.value,
                })
              }
              placeholder="customer_name"
              className="h-9 w-full rounded-md border bg-background px-3 text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Value
            </label>

            <input
              value={value.value}
              onChange={(event) =>
                onChange({
                  ...value,
                  value: event.target.value,
                })
              }
              placeholder="{{input.name}}"
              className="h-9 w-full rounded-md border bg-background px-3 text-sm"
            />

            <p className="text-xs text-muted-foreground">
              Workflow references such as {"{{input.name}}"} are
              resolved when the workflow runs.
            </p>
          </div>
        </>
      ) : (
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Values
          </label>

          <textarea
            value={JSON.stringify(value.values, null, 2)}
            onChange={(event) => {
              try {
                const values = JSON.parse(event.target.value);

                if (
                  values &&
                  typeof values === "object" &&
                  !Array.isArray(values)
                ) {
                  onChange({
                    ...value,
                    values,
                  });
                }
              } catch {
                // Keep the current value until valid JSON is entered.
              }
            }}
            placeholder={'{"customer_name":"{{input.name}}"}'}
            rows={8}
            className="w-full resize-none rounded-md border bg-background p-3 font-mono text-xs"
          />

          <p className="text-xs text-muted-foreground">
            Define the variables to set as a JSON object.
            Workflow references are resolved when the workflow runs.
          </p>
        </div>
      )}
    </div>
  );
}
