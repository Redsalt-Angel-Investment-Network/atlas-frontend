import { z } from "zod";

import type { NodeDefinition } from "../types";
import { WebhookConfigForm } from "./configs/webhook-config";

const webhookConfigSchema = z.object({
  method: z.enum([
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
  ]),
});

export type WebhookConfig = z.infer<
  typeof webhookConfigSchema
>;

export const webhookNode: NodeDefinition<WebhookConfig> = {
  type: "webhook",

  label: "Webhook",

  description: "Receive an incoming HTTP request.",

  category: "trigger",

  inputs: [],

  outputs: [
    {
      id: "output",
      label: "Output",
      type: "default",
    },
  ],

  defaultConfig: {
    method: "POST",
  },

  configSchema: webhookConfigSchema,

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
  ],

  configComponent: WebhookConfigForm,
};
