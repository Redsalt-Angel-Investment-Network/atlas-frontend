"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { WorkflowCanvas } from "@/components/workflow/canvas";
import { WorkflowInspector } from "@/components/workflow/inspector";
import { WorkflowNodeLibrary } from "@/components/workflow/node-library";
import { WorkflowValidation } from "@/components/workflow/validation";
import { useWorkflowEditorStore } from "@/workflow/stores/editor-store";

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

  return (
    <main className="flex h-full min-h-0 w-full flex-col">
      <div className="flex shrink-0 items-center justify-between border-b px-4 py-2">
        <div className="text-sm font-medium">
          Workflow
        </div>

        <div className="flex items-center gap-3">
          <span
            className={
              saveError
                ? "text-xs text-destructive"
                : "text-xs text-muted-foreground"
            }
          >
            {isSaving
              ? "Saving..."
              : saveError
                ? "Save failed"
                : isDirty
                  ? "Unsaved changes"
                  : "Saved"}
          </span>

          <Button
            onClick={() => void saveWorkflow()}
            disabled={!isDirty || isSaving}
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>

          <Button onClick={validate}>
            Validate
          </Button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1">
        <WorkflowNodeLibrary />

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
      </div>
    </main>
  );
}