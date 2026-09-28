"use client";

import { NodeConfigProps } from "@/workflow/types";
import { LlmConfig } from "../llm";

export function LlmConfigForm({
  value,
  onChange,
}: NodeConfigProps<LlmConfig>) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Provider
        </label>

        <input
          value={value.provider}
          onChange={(event) =>
            onChange({
              ...value,
              provider: event.target.value,
            })
          }
          placeholder="openai"
          className="h-9 w-full rounded-md border bg-background px-3 text-sm"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Model
        </label>

        <input
          value={value.model}
          onChange={(event) =>
            onChange({
              ...value,
              model: event.target.value,
            })
          }
          placeholder="gpt-4.1-mini"
          className="h-9 w-full rounded-md border bg-background px-3 text-sm"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          System Prompt
        </label>

        <textarea
          value={value.systemPrompt}
          onChange={(event) =>
            onChange({
              ...value,
              systemPrompt: event.target.value,
            })
          }
          placeholder="You are a helpful assistant."
          rows={5}
          className="w-full resize-none rounded-md border bg-background p-3 font-mono text-xs"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Prompt
        </label>

        <textarea
          value={value.prompt}
          onChange={(event) =>
            onChange({
              ...value,
              prompt: event.target.value,
            })
          }
          placeholder="Summarize {{input.text}}."
          rows={8}
          className="w-full resize-none rounded-md border bg-background p-3 font-mono text-xs"
        />

        <p className="text-xs text-muted-foreground">
          Workflow references such as {"{{input.text}}"} are
          resolved before the model is called.
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Temperature
        </label>

        <input
          type="number"
          min={0}
          max={2}
          step={0.1}
          value={value.temperature ?? ""}
          onChange={(event) => {
            const rawValue = event.target.value;

            onChange({
              ...value,
              temperature:
                rawValue === ""
                  ? null
                  : Number(rawValue),
            });
          }}
          placeholder="0.7"
          className="h-9 w-full rounded-md border bg-background px-3 text-sm"
        />

        <p className="text-xs text-muted-foreground">
          Leave empty to use the model default.
        </p>
      </div>
    </div>
  );
}
