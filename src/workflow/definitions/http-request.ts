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
      id: "success",
      label: "Success",
      type: "default",
    },
    {
      id: "error",
      label: "Error",
      type: "error",
    },
  ],

  defaultConfig: {
    method: "GET",
    url: "",
    headers: {},
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
      name: "body",
      label: "Body",
      type: "textarea",
      placeholder: '{"name":"John"}',
    },
  ],

  configComponent: HttpRequestConfigForm,
};