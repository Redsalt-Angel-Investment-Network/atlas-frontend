import { z } from "zod";

import type { NodeDefinition } from "../types";
import { SetVariableConfigForm } from "./configs/set-variable-config";

const setVariableConfigSchema = z.discriminatedUnion(
  "operation",
  [
    z.object({
      operation: z.literal("set"),
      name: z
        .string()
        .min(1, "Variable name is required"),
      value: z.string(),
    }),

    z.object({
      operation: z.literal("transform"),
      values: z.record(z.string(), z.unknown()),
    }),
  ],
);

export type SetVariableConfig = z.infer<
  typeof setVariableConfigSchema
>;

export const setVariableNode: NodeDefinition<SetVariableConfig> = {
  type: "setVariable",

  label: "Set Variable",

  description: "Set or transform workflow variables.",

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
    operation: "set",
    name: "",
    value: "",
  },

  configSchema: setVariableConfigSchema,

  fields: [
    {
      name: "operation",
      label: "Operation",
      type: "select",
      options: [
        {
          label: "Set",
          value: "set",
        },
        {
          label: "Transform",
          value: "transform",
        },
      ],
    },
    {
      name: "name",
      label: "Variable Name",
      type: "text",
      placeholder: "customer_name",
    },
    {
      name: "value",
      label: "Value",
      type: "text",
      placeholder: "{{input.name}}",
    },
    {
      name: "values",
      label: "Values",
      type: "textarea",
      placeholder: '{"customer_name":"{{input.name}}"}',
    },
  ],

  configComponent: SetVariableConfigForm,
};
