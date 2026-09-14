import { z } from "zod";

import type { NodeDefinition } from "../types";
import { ConditionConfigForm } from "./configs/condition-config";

const conditionConfigSchema = z.object({
  expression: z
    .string()
    .min(1, "Expression is required"),
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
    expression: "",
  },

  configSchema: conditionConfigSchema,

  fields: [
    {
      name: "expression",
      label: "Expression",
      type: "textarea",
      placeholder: "status === 200",
      description:
        "Expression that determines which branch is followed.",
    },
  ],

  configComponent: ConditionConfigForm,
};