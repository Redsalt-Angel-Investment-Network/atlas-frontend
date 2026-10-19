import { z } from "zod";

import type { NodeDefinition } from "../types";
import { AgentConfigForm } from "./configs/agent-config";

const agentConfigSchema = z.object({
  provider: z
    .string()
    .min(1, "Provider is required"),

  model: z
    .string()
    .min(1, "Model is required"),

  system_prompt: z.string(),

  input: z
    .string()
    .min(1, "Input is required"),

  tools: z.array(
    z.string().min(1, "Tool name cannot be empty"),
  ),

  max_iterations: z
    .number()
    .int("Max iterations must be an integer")
    .min(1, "Max iterations must be at least 1")
    .max(100, "Max iterations cannot exceed 100"),
  
  temperature: z
    .number()
    .min(0)
    .max(2)
    .nullable(),
});

export type AgentConfig = z.infer<
  typeof agentConfigSchema
>;

export const agentNode: NodeDefinition<AgentConfig> = {
  type: "agent",

  label: "Agent",

  description: "Run an agent that can reason and use configured tools.",

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
    provider: "",
    model: "",
    temperature: null,
    system_prompt: "",
    input: "",
    tools: [],
    max_iterations: 10,
  },

  configSchema: agentConfigSchema,

  fields: [
    {
      name: "provider",
      label: "Provider",
      type: "text",
      placeholder: "openai",
    },
    {
      name: "model",
      label: "Model",
      type: "text",
      placeholder: "gpt-4.1-mini",
    },
    {
      name: "temperature",
      label: "Temperature",
      type: "number",
      placeholder: "0.7",
      min: 0,
      max: 2,
      step: 0.1,
    },
    {
      name: "system_prompt",
      label: "System Prompt",
      type: "textarea",
      placeholder: "You are a helpful workspace assistant.",
    },
    {
      name: "input",
      label: "Input",
      type: "textarea",
      placeholder: "{{input.message}}",
    },
    {
      name: "tools",
      label: "Tools",
      type: "json",
      placeholder: '["search_entities", "create_entity"]',
    },
    {
      name: "max_iterations",
      label: "Max Iterations",
      type: "number",
      placeholder: "10",
      min: 1,
      max: 100,
      step: 1,
    },
  ],

  configComponent: AgentConfigForm,
};
