import { z } from "zod";

import type { NodeDefinition } from "../types";
import { ConditionConfigForm } from "./configs/condition-config";

const conditionConfigSchema = z.object({
  left: z.unknown(),

  operator: z.enum([
    "equals",
    "notEquals",
    "contains",
    "notContains",
    "greaterThan",
    "greaterThanOrEqual",
    "lessThan",
    "lessThanOrEqual",
    "isEmpty",
    "isNotEmpty",
  ]),

  right: z.unknown(),

  trueHandle: z.string().default("true"),

  falseHandle: z.string().default("false"),
});

export type ConditionConfig = z.infer<
  typeof conditionConfigSchema
>;

export const conditionNode: NodeDefinition<ConditionConfig> = {
  type: "condition",

  label: "Condition",

  description: "Branch the workflow based on a condition.",

  category: "logic",

  inputs: [
    {
      id: "input",
      label: "Input",
      type: "default",
    },
  ],

  outputs: [
    {
      id: "true",
      label: "True",
      type: "boolean",
    },
    {
      id: "false",
      label: "False",
      type: "boolean",
    },
  ],

  defaultConfig: {
    left: "",
    operator: "equals",
    right: "",
    trueHandle: "true",
    falseHandle: "false",
  },

  configSchema: conditionConfigSchema,

  fields: [
    {
      name: "left",
      label: "Value",
      type: "text",
      placeholder: "{{input.status}}",
    },
    {
      name: "operator",
      label: "Operator",
      type: "select",
      options: [
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
      ],
    },
    {
      name: "right",
      label: "Compare with",
      type: "text",
      placeholder: "active",
    },
  ],

  configComponent: ConditionConfigForm,
};
