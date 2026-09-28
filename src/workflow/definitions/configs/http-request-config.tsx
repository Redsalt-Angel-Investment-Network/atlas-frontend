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
          Headers
        </label>

        <textarea
          value={JSON.stringify(value.headers, null, 2)}
          onChange={(event) => {
            try {
              const headers = JSON.parse(event.target.value);

              if (
                headers &&
                typeof headers === "object" &&
                !Array.isArray(headers)
              ) {
                onChange({
                  ...value,
                  headers,
                });
              }
            } catch {
              // Keep the current value until valid JSON is entered.
            }
          }}
          placeholder={'{"Authorization":"Bearer token"}'}
          rows={5}
          className="w-full resize-none rounded-md border bg-background p-3 font-mono text-xs"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Query Parameters
        </label>

        <textarea
          value={JSON.stringify(value.query, null, 2)}
          onChange={(event) => {
            try {
              const query = JSON.parse(event.target.value);

              if (
                query &&
                typeof query === "object" &&
                !Array.isArray(query)
              ) {
                onChange({
                  ...value,
                  query,
                });
              }
            } catch {
              // Keep the current value until valid JSON is entered.
            }
          }}
          placeholder={'{"status":"active"}'}
          rows={5}
          className="w-full resize-none rounded-md border bg-background p-3 font-mono text-xs"
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
          placeholder={'{"name":"John"}'}
          rows={8}
          className="w-full resize-none rounded-md border bg-background p-3 font-mono text-xs"
        />
      </div>
    </div>
  );
}
