import { z } from "zod";

import type { NodeDefinition } from "../types";
import { HttpRequestConfigForm } from "./configs/http-request-config";

const httpRequestConfigSchema = z.object({
  method: z.enum([
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
  ]),

  url: z
    .string()
    .min(1, "URL is required")
    .url("Enter a valid URL"),

  headers: z.record(z.string(), z.string()),

  query: z.record(z.string(), z.string()),

  body: z.string(),
});

export type HttpRequestConfig = z.infer<
  typeof httpRequestConfigSchema
>;

export const httpRequestNode: NodeDefinition<HttpRequestConfig> = {
  type: "httpRequest",

  label: "HTTP Request",

  description: "Make an HTTP request.",

  category: "action",

  inputs: [
    {
      id: "input",
      label: "Input",
      type: "default",
    },
  ],

  outputs: [
    {
      id: "output",
      label: "Output",
      type: "default",
    },
  ],

  defaultConfig: {
    method: "GET",
    url: "",
    headers: {},
    query: {},
    body: "",
  },

  configSchema: httpRequestConfigSchema,

  fields: [
    {
      name: "method",
      label: "Method",
      type: "select",
      options: [
        { label: "GET", value: "GET" },
        { label: "POST", value: "POST" },
        { label: "PUT", value: "PUT" },
        { label: "PATCH", value: "PATCH" },
        { label: "DELETE", value: "DELETE" },
      ],
    },
    {
      name: "url",
      label: "URL",
      type: "url",
      placeholder: "https://api.example.com/users",
    },
    {
      name: "headers",
      label: "Headers",
      type: "json",
      placeholder: '{"Authorization":"Bearer {{input.token}}"}',
    },
    {
      name: "query",
      label: "Query Parameters",
      type: "json",
      placeholder: '{"status":"active"}',
    },
    {
      name: "body",
      label: "Body",
      type: "textarea",
      placeholder: '{"name":"John"}',
    },
  ],

  configComponent: HttpRequestConfigForm,
};
