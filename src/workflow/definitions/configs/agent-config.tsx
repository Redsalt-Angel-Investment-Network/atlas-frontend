import type { NodeConfigProps } from "../../types";
import type { AgentConfig } from "../agent";

export function AgentConfigForm({
  value,
  onChange,
}: NodeConfigProps<AgentConfig>) {
  const update = <K extends keyof AgentConfig>(
    field: K,
    fieldValue: AgentConfig[K],
  ) => {
    onChange({
      ...value,
      [field]: fieldValue,
    });
  };

  const toolsValue = Array.isArray(value.tools)
    ? value.tools.join(", ")
    : "";

  return (
    <div className="space-y-4">
      <div>
        <label
          htmlFor="agent-model"
          className="block text-sm font-medium"
        >
          Model
        </label>

        <input
          id="agent-model"
          type="text"
          value={value.model}
          onChange={(event) =>
            update("model", event.target.value)
          }
          placeholder="gpt-4.1-mini"
        />
      </div>

      <div>
        <label
          htmlFor="agent-system-prompt"
          className="block text-sm font-medium"
        >
          System Prompt
        </label>

        <textarea
          id="agent-system-prompt"
          value={value.system_prompt}
          onChange={(event) =>
            update("system_prompt", event.target.value)
          }
          placeholder="You are a helpful workspace assistant."
        />
      </div>

      <div>
        <label
          htmlFor="agent-input"
          className="block text-sm font-medium"
        >
          Input
        </label>

        <textarea
          id="agent-input"
          value={value.input}
          onChange={(event) =>
            update("input", event.target.value)
          }
          placeholder="{{input.message}}"
        />
      </div>

      <div>
        <label
          htmlFor="agent-tools"
          className="block text-sm font-medium"
        >
          Tools
        </label>

        <textarea
          id="agent-tools"
          value={toolsValue}
          onChange={(event) => {
            const tools = event.target.value
              .split(",")
              .map((tool) => tool.trim())
              .filter(Boolean);

            update("tools", tools);
          }}
          placeholder="search_entities, create_entity"
        />
      </div>

      <div>
        <label
          htmlFor="agent-max-iterations"
          className="block text-sm font-medium"
        >
          Max Iterations
        </label>

        <input
          id="agent-max-iterations"
          type="number"
          min={1}
          max={100}
          step={1}
          value={value.max_iterations}
          onChange={(event) => {
            const parsed = Number(event.target.value);

            if (Number.isNaN(parsed)) {
              return;
            }

            update("max_iterations", parsed);
          }}
        />
      </div>
    </div>
  );
}
