"use client";

import { X } from "lucide-react";
import type { ComponentType } from "react";

import { Button } from "@/components/ui/button";
import { NodeConfigForm } from "@/components/workflow/node-config-form";

import type { WorkflowNodeExecutionState } from "@/_types/workflows";
import { getNodeDefinition } from "@/workflow/registry";
import type { WorkflowNode } from "@/workflow/types";
import { useWorkflowEditorStore } from "@/workflow/stores/editor-store";
import type { WorkflowValidationIssue } from "@/workflow/validation/workflow";

type WorkflowInspectorProps = {
  node: WorkflowNode | null;
  onClose: () => void;
  onConfigChange: (
    nodeId: string,
    config: Record<string, unknown>
  ) => void;
};

function hasError(
  error: Record<string, unknown> | null
): boolean {
  return !!error && Object.keys(error).length > 0;
}

function getExecutionStatusLabel(
  status: WorkflowNodeExecutionState["status"]
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

function ExecutionOutput({
  execution,
}: {
  execution: WorkflowNodeExecutionState | undefined;
}) {
  if (!execution) {
    return (
      <section className="mt-8 border-t pt-6">
        <h3 className="text-sm font-semibold">
          Execution
        </h3>

        <p className="mt-2 text-sm text-muted-foreground">
          No execution result.
        </p>
      </section>
    );
  }

  return (
    <section className="mt-8 border-t pt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">
          Execution
        </h3>

        <span className="text-xs text-muted-foreground">
          {getExecutionStatusLabel(execution.status)}
        </span>
      </div>

      {execution.output && (
        <div className="mt-4">
          <p className="mb-2 text-xs font-medium text-muted-foreground">
            Output
          </p>

          <pre className="max-h-[320px] overflow-auto rounded-md border bg-muted/40 p-3 text-xs">
            {JSON.stringify(
              execution.output,
              null,
              2
            )}
          </pre>
        </div>
      )}

      {hasError(execution.error) && (
        <div className="mt-4">
          <p className="mb-2 text-xs font-medium text-destructive">
            Error
          </p>

          <pre className="max-h-[320px] overflow-auto rounded-md border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive">
            {JSON.stringify(
              execution.error,
              null,
              2
            )}
          </pre>
        </div>
      )}

      {!execution.output &&
        !hasError(execution.error) && (
          <p className="mt-2 text-sm text-muted-foreground">
            No output was produced.
          </p>
        )}
    </section>
  );
}

function NodeConfig({
  node,
  validationIssues,
  onConfigChange,
}: {
  node: WorkflowNode;
  validationIssues: WorkflowValidationIssue[];
  onConfigChange: (
    nodeId: string,
    config: Record<string, unknown>
  ) => void;
}) {
  const definition = getNodeDefinition(node.type);

  if (definition.fields) {
    return (
      <NodeConfigForm
        definition={definition}
        value={node.config}
        validationIssues={validationIssues}
        onChange={(config) => onConfigChange(node.id, config)}
      />
    );
  }

  const ConfigComponent = definition.configComponent;

  if (ConfigComponent) {
    const config = definition.configSchema.parse(node.config);

    const TypedConfigComponent =
      ConfigComponent as unknown as ComponentType<{
        value: Record<string, unknown>;
        onChange: (config: Record<string, unknown>) => void;
      }>;

    return (
      <TypedConfigComponent
        value={config as Record<string, unknown>}
        onChange={(config) => onConfigChange(node.id, config)}
      />
    );
  }

  return (
    <p className="text-sm text-muted-foreground">
      This node has no configuration.
    </p>
  );
}

export function WorkflowInspector({
  node,
  onClose,
  onConfigChange,
}: WorkflowInspectorProps) {
  const validationIssues = useWorkflowEditorStore(
    (state) => state.validationIssues
  );

  const execution = useWorkflowEditorStore(
    (state) =>
      node
        ? state.nodes.find(
          (editorNode) => editorNode.id === node.id
        )?.data.execution
        : undefined
  );

  if (!node) {
    return null;
  }

  const definition = getNodeDefinition(node.type);

  const nodeValidationIssues = validationIssues.filter(
    (issue) => issue.nodeId === node.id
  );

  return (
    <aside className="flex h-full w-[360px] shrink-0 flex-col border-l bg-background">
      <div className="flex h-14 items-center justify-between border-b px-4">
        <div>
          <h2 className="text-sm font-semibold">
            {definition.label}
          </h2>

          <p className="text-xs capitalize text-muted-foreground">
            {definition.category}
          </p>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
        >
          <X className="size-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {definition.description && (
          <p className="mb-6 text-sm text-muted-foreground">
            {definition.description}
          </p>
        )}

        <NodeConfig
          node={node}
          validationIssues={nodeValidationIssues}
          onConfigChange={onConfigChange}
        />

        <ExecutionOutput execution={execution} />
      </div>
    </aside>
  );
}