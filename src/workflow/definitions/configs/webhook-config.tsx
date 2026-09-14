"use client";

import { NodeConfigProps } from "@/workflow/types";
import { WebhookConfig } from "../webhook";

export function WebhookConfigForm({
  value,
  onChange,
}: NodeConfigProps<WebhookConfig>) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Method
        </label>

        <select
          value={value.method}
          onChange={(event) =>
            onChange({
              ...value,
              method: event.target.value as WebhookConfig["method"],
            })
          }
          className="h-9 w-full rounded-md border bg-background px-3 text-sm"
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="PATCH">PATCH</option>
          <option value="DELETE">DELETE</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Path
        </label>

        <input
          value={value.path}
          onChange={(event) =>
            onChange({
              ...value,
              path: event.target.value,
            })
          }
          placeholder="/webhook"
          className="h-9 w-full rounded-md border bg-background px-3 text-sm"
        />
      </div>
    </div>
  );
}