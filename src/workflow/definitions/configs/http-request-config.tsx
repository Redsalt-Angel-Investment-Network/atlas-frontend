"use client";

import { NodeConfigProps } from "@/workflow/types";
import { HttpRequestConfig } from "../http-request";


export function HttpRequestConfigForm({
  value,
  onChange,
}: NodeConfigProps<HttpRequestConfig>) {
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
              method:
                event.target.value as HttpRequestConfig["method"],
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
          URL
        </label>

        <input
          value={value.url}
          onChange={(event) =>
            onChange({
              ...value,
              url: event.target.value,
            })
          }
          placeholder="https://api.example.com"
          className="h-9 w-full rounded-md border bg-background px-3 text-sm"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Body
        </label>

        <textarea
          value={value.body}
          onChange={(event) =>
            onChange({
              ...value,
              body: event.target.value,
            })
          }
          placeholder="Request body..."
          rows={8}
          className="w-full resize-none rounded-md border bg-background p-3 font-mono text-xs"
        />
      </div>
    </div>
  );
}