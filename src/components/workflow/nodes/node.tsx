"use client";

import {
  Handle,
  Position,
  type NodeProps,
} from "@xyflow/react";

import { getNodeDefinition } from "@/workflow/registry";
import { useWorkflowEditorStore } from "@/workflow/stores/editor-store";
import type { WorkflowFlowNode } from "@/workflow/stores/editor-store";
import { WorkflowNodeExecutionStatus } from "@/_types/workflows";

function getExecutionStatusLabel(
  status: WorkflowNodeExecutionStatus
): string {
  switch (status) {
    case "pending":
      return "Queued";

    case "running":
      return "Running...";

    case "completed":
      return "Completed";

    case "failed":
      return "Failed";

    case "skipped":
      return "Skipped";

    case "cancelled":
      return "Cancelled";
  }
}

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

  const executionStatus =
    data.execution?.status;

  const executionStatusLabel =
    executionStatus
      ? getExecutionStatusLabel(
        executionStatus
      )
      : null;

  const executionStatusClass =
    executionStatus === "running"
      ? "bg-blue-500 animate-pulse"
      : executionStatus === "completed"
        ? "bg-green-500"
        : executionStatus === "failed"
          ? "bg-destructive"
          : executionStatus === "pending"
            ? "bg-muted-foreground"
            : executionStatus === "skipped"
              ? "bg-muted-foreground"
              : executionStatus === "cancelled"
                ? "bg-yellow-500"
                : "";

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
        <div className="flex items-start justify-between gap-3">
          <div className="text-sm font-semibold">
            {definition.label}
          </div>

          {executionStatus && (
            <div
              className="flex items-center gap-1.5 text-xs text-muted-foreground"
              title={executionStatusLabel ?? undefined}
            >
              <span
                className={[
                  "h-2 w-2 rounded-full",
                  executionStatusClass,
                ].join(" ")}
              />

              <span>
                {executionStatusLabel}
              </span>
            </div>
          )}
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

        {data.execution?.status === "failed" && (
          <div className="mt-2 text-xs text-destructive">
            Execution failed
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
