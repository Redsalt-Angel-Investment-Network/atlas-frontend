import { z } from "zod";

import type { NodeDefinition } from "../types";
import { ToolConfigForm } from "./configs/tool-config";

const toolConfigSchema = z.object({
  tool: z
    .string()
    .min(1, "Tool is required"),

  input: z.union([
    z.string(),
    z.record(z.string(), z.unknown()),
  ]),
});

export type ToolConfig = z.infer<
  typeof toolConfigSchema
>;

export const toolNode: NodeDefinition<ToolConfig> = {
  type: "tool",

  label: "Tool",

  description: "Execute a configured LangChain tool.",

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
    tool: "",
    input: "",
  },

  configSchema: toolConfigSchema,

  fields: [
    {
      name: "tool",
      label: "Tool",
      type: "text",
      placeholder: "search",
    },
    {
      name: "input",
      label: "Input",
      type: "textarea",
      placeholder: "{{input.query}}",
    },
  ],

  configComponent: ToolConfigForm,
};
