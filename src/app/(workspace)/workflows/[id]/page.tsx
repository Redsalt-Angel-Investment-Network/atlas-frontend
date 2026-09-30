"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { WorkflowCanvas } from "@/components/workflow/canvas";
import { WorkflowInspector } from "@/components/workflow/inspector";
import { WorkflowNodeLibrary } from "@/components/workflow/node-library";
import { WorkflowValidation } from "@/components/workflow/validation";
import { useWorkflowEditorStore } from "@/workflow/stores/editor-store";
import { WorkflowExecutionStatus } from "@/_types/workflows";
import { WorkflowExecutionHistory } from "@/components/workflow/execution-history";
import { WorkflowExecutionDetail } from "@/components/workflow/execution-detail";

export default function WorkflowPage() {
  const params = useParams<{ id: string }>();

  const nodes = useWorkflowEditorStore(
    (state) => state.nodes
  );

  const edges = useWorkflowEditorStore(
    (state) => state.edges
  );

  const selectedNodeId = useWorkflowEditorStore(
    (state) => state.selectedNodeId
  );

  const onNodesChange = useWorkflowEditorStore(
    (state) => state.onNodesChange
  );

  const onEdgesChange = useWorkflowEditorStore(
    (state) => state.onEdgesChange
  );

  const onConnect = useWorkflowEditorStore(
    (state) => state.onConnect
  );

  const selectNode = useWorkflowEditorStore(
    (state) => state.selectNode
  );

  const updateNodeConfig = useWorkflowEditorStore(
    (state) => state.updateNodeConfig
  );

  const loadWorkflow = useWorkflowEditorStore(
    (state) => state.loadWorkflow
  );

  const saveWorkflow = useWorkflowEditorStore(
    (state) => state.saveWorkflow
  );

  const validate = useWorkflowEditorStore(
    (state) => state.validate
  );

  const isLoading = useWorkflowEditorStore(
    (state) => state.isLoading
  );

  const isSaving = useWorkflowEditorStore(
    (state) => state.isSaving
  );

  const isDirty = useWorkflowEditorStore(
    (state) => state.isDirty
  );

  const saveError = useWorkflowEditorStore(
    (state) => state.saveError
  );

  const selectedNode =
    nodes.find(
      (node) => node.id === selectedNodeId
    ) ?? null;


  const executeWorkflow =
    useWorkflowEditorStore(
      (state) => state.executeWorkflow
    );

  const isExecuting =
    useWorkflowEditorStore(
      (state) => state.isExecuting
    );

  const executionError =
    useWorkflowEditorStore(
      (state) => state.executionError
    );

  const execution =
    useWorkflowEditorStore(
      (state) => state.execution
    );

  const executionHistory =
    useWorkflowEditorStore(
      (state) => state.executionHistory
    );

  const isLoadingExecutionHistory =
    useWorkflowEditorStore(
      (state) =>
        state.isLoadingExecutionHistory
    );

  const executionHistoryError =
    useWorkflowEditorStore(
      (state) =>
        state.executionHistoryError
    );

  const selectedExecution =
    useWorkflowEditorStore(
      (state) => state.selectedExecution
    );

  const isLoadingExecution =
    useWorkflowEditorStore(
      (state) => state.isLoadingExecution
    );

  const executionDetailError =
    useWorkflowEditorStore(
      (state) => state.executionDetailError
    );

  const selectedExecutionId =
    useWorkflowEditorStore(
      (state) => state.selectedExecutionId
    );

  const selectExecution =
    useWorkflowEditorStore(
      (state) => state.selectExecution
    );

  const loadExecution =
    useWorkflowEditorStore(
      (state) => state.loadExecution
    );

  const handleExecutionSelect = (
    executionId: string
  ) => {
    selectExecution(executionId);
    void loadExecution(executionId);
  };


  const hasWorkflowExecutionError =
    execution !== null &&
    hasExecutionError(execution.error);

  const validationStatus =
    useWorkflowEditorStore(
      (state) => state.validationStatus
    );

  useEffect(() => {
    if (!params.id) {
      return;
    }

    void loadWorkflow(params.id);
  }, [params.id, loadWorkflow]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        (event.metaKey || event.ctrlKey) &&
        event.key.toLowerCase() === "s"
      ) {
        event.preventDefault();

        void saveWorkflow();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [saveWorkflow]);

  useEffect(() => {
    if (!isDirty) {
      return;
    }

    const handleBeforeUnload = (
      event: BeforeUnloadEvent
    ) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener(
      "beforeunload",
      handleBeforeUnload
    );

    return () => {
      window.removeEventListener(
        "beforeunload",
        handleBeforeUnload
      );
    };
  }, [isDirty]);

  useEffect(() => {
    if (!isDirty || isSaving) {
      return;
    }

    const timeout = window.setTimeout(() => {
      void saveWorkflow();
    }, 1500);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [isDirty, isSaving, saveWorkflow]);

  if (isLoading) {
    return (
      <main className="flex h-full min-h-0 w-full items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Loading workflow...
        </p>
      </main>
    );
  }

  function getExecutionStatusLabel(status: string): string {
    switch (status) {
      case "pending":
        return "Queued";
      case "running":
        return "Running...";
      case "completed":
        return "Completed";
      case "failed":
        return "Failed";
      case "cancelled":
        return "Cancelled";
      default:
        return status;
    }
  }

  function hasExecutionError(
    error: Record<string, unknown> | null
  ): boolean {
    return (
      error !== null &&
      Object.keys(error).length > 0
    );
  }

  return (
    <main className="flex h-full min-h-0 w-full flex-col">
      <div className="flex shrink-0 items-center justify-between border-b px-4 py-2">
        <div className="text-sm font-medium">
          Workflow
        </div>

        <div className="flex items-center gap-3">
          <span
            className={
              saveError || executionError
                ? "text-xs text-destructive"
                : "text-xs text-muted-foreground"
            }
          >
            {isExecuting
              ? "Running..."
              : executionError
                ? "Run request failed"
                : saveError
                  ? "Save failed"
                  : isSaving
                    ? "Saving..."
                    : isDirty
                      ? "Unsaved changes"
                      : hasWorkflowExecutionError
                        ? "Last run: Failed"
                        : execution
                          ? `Last run: ${getExecutionStatusLabel(execution.status)}`
                          : "Saved"}
          </span>

          <Button
            onClick={() => void saveWorkflow()}
            disabled={!isDirty || isSaving || isExecuting}
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>

          <Button
            onClick={() => void executeWorkflow()}
            disabled={
              isExecuting ||
              isSaving ||
              validationStatus === "invalid"
            }
          >
            {isExecuting ? "Running..." : "Run"}
          </Button>

          <Button onClick={validate}>
            Validate
          </Button>
        </div>
      </div>

      {hasWorkflowExecutionError && execution?.error && (
        <div className="shrink-0 border-b border-destructive/30 bg-destructive/5 px-4 py-3">
          <div className="text-sm font-medium text-destructive">
            Workflow execution failed
          </div>

          <div className="mt-1 text-sm text-destructive/80">
            {typeof execution.error.message === "string"
              ? execution.error.message
              : "The workflow execution failed."}
          </div>

          {typeof execution.error.code === "string" && (
            <div className="mt-1 text-xs text-muted-foreground">
              Code: {execution.error.code}
            </div>
          )}
        </div>
      )}

      <div className="flex min-h-0 flex-1">
        <WorkflowNodeLibrary />

        <WorkflowExecutionHistory
          executions={executionHistory}
          isLoading={isLoadingExecutionHistory}
          error={executionHistoryError}
          selectedExecutionId={selectedExecutionId}
          onSelectExecution={handleExecutionSelect}
        />

        <div className="relative min-h-0 min-w-0 flex-1">
          <WorkflowCanvas
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={selectNode}
            onPaneClick={() => selectNode(null)}
          />

          <WorkflowValidation />
        </div>

        {selectedExecutionId ? (
          <WorkflowExecutionDetail
            execution={selectedExecution}
            isLoading={isLoadingExecution}
            error={executionDetailError}
            onClose={() => selectExecution(null)}
          />
        ) : (
          <WorkflowInspector
            node={
              selectedNode
                ? {
                  id: selectedNode.id,
                  type: selectedNode.data.type,
                  position: selectedNode.position,
                  config: selectedNode.data.config,
                }
                : null
            }
            onClose={() => selectNode(null)}
            onConfigChange={updateNodeConfig}
          />
        )}
      </div>
    </main>
  );
}