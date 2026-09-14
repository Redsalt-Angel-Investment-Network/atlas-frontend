"use client";

import {
  Handle,
  Position,
  type NodeProps,
} from "@xyflow/react";

import { getNodeDefinition } from "@/workflow/registry";
import { useWorkflowEditorStore } from "@/workflow/stores/editor-store";
import type { WorkflowFlowNode } from "@/workflow/stores/editor-store";

export function WorkflowNode({
  id,
  data,
  selected,
}: NodeProps<WorkflowFlowNode>) {
  const definition = getNodeDefinition(data.type);

  const validationIssues = useWorkflowEditorStore(
    (state) => state.validationIssues
  );

  const nodeValidationIssues = validationIssues.filter(
    (issue) => issue.nodeId === id
  );

  const hasError = nodeValidationIssues.some(
    (issue) => issue.severity === "error"
  );

  const hasWarning = nodeValidationIssues.some(
    (issue) => issue.severity === "warning"
  );

  return (
    <div
      className={[
        "min-w-[220px] rounded-lg border bg-background shadow-sm",
        hasError
          ? "border-destructive"
          : hasWarning
            ? "border-yellow-500"
            : selected
              ? "border-primary ring-2 ring-primary/20"
              : "border-border",
      ].join(" ")}
    >
      {definition.inputs.map((input, index) => (
        <Handle
          key={input.id}
          type="target"
          position={Position.Left}
          id={input.id}
          style={{
            top: `${30 + index * 20}%`,
          }}
        />
      ))}

      <div className="border-b px-4 py-3">
        <div className="text-sm font-semibold">
          {definition.label}
        </div>

        {definition.description && (
          <div className="mt-1 text-xs text-muted-foreground">
            {definition.description}
          </div>
        )}
      </div>

      <div className="px-4 py-3">
        <div className="text-xs text-muted-foreground">
          {definition.category}
        </div>

        {hasError && (
          <div className="mt-2 text-xs text-destructive">
            Configuration error
          </div>
        )}

        {!hasError && hasWarning && (
          <div className="mt-2 text-xs text-yellow-600">
            Needs attention
          </div>
        )}
      </div>

      {definition.outputs.map((output, index) => (
        <Handle
          key={output.id}
          type="source"
          position={Position.Right}
          id={output.id}
          style={{
            top: `${30 + index * 20}%`,
          }}
        />
      ))}
    </div>
  );
}