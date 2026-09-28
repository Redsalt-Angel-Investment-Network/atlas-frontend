import { z } from "zod";

import type { NodeDefinition } from "../types";
import { LlmConfigForm } from "./configs/llm-config";

const llmConfigSchema = z.object({
  provider: z
    .string()
    .min(1, "Provider is required"),

  model: z
    .string()
    .min(1, "Model is required"),

  prompt: z
    .string()
    .min(1, "Prompt is required"),

  systemPrompt: z.string(),

  temperature: z
    .number()
    .min(0)
    .max(2)
    .nullable(),
});

export type LlmConfig = z.infer<
  typeof llmConfigSchema
>;

export const llmNode: NodeDefinition<LlmConfig> = {
  type: "llm",

  label: "LLM",

  description: "Generate text using a language model.",

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
    prompt: "",
    systemPrompt: "",
    temperature: null,
  },

  configSchema: llmConfigSchema,

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
      name: "systemPrompt",
      label: "System Prompt",
      type: "textarea",
      placeholder: "You are a helpful assistant.",
    },
    {
      name: "prompt",
      label: "Prompt",
      type: "textarea",
      placeholder: "Summarize {{input.text}}.",
    },
    {
      name: "temperature",
      label: "Temperature",
      type: "number",
      placeholder: "0.7",
      min: 0,
      max: 2,
      step: 0.1,
    }
  ],

  configComponent: LlmConfigForm,
};
