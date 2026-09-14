"use client";

import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

import { useWorkflowEditorStore } from "@/workflow/stores/editor-store";

export function WorkflowValidation() {
  const issues = useWorkflowEditorStore(
    (state) => state.validationIssues
  );

  const validationStatus = useWorkflowEditorStore(
    (state) => state.validationStatus
  );

  const selectNode = useWorkflowEditorStore(
    (state) => state.selectNode
  );

  const errorCount = issues.filter(
    (issue) => issue.severity === "error"
  ).length;

  const warningCount = issues.filter(
    (issue) => issue.severity === "warning"
  ).length;

  if (validationStatus === "valid") {
    return (
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 rounded-lg border bg-background px-4 py-3 shadow-md">
        <CheckCircle2 className="size-4 text-green-600" />

        <div>
          <div className="text-sm font-medium">
            Workflow is valid
          </div>

          {warningCount > 0 && (
            <div className="text-xs text-muted-foreground">
              {warningCount} warning
              {warningCount === 1 ? "" : "s"}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (validationStatus === "idle") {
    return null;
  }

  return (
    <div className="absolute top-4 left-4 z-10 w-80 rounded-lg border bg-background shadow-md">
      <div className="border-b px-4 py-3">
        <div className="text-sm font-semibold">
          Workflow issues
        </div>

        <div className="mt-1 text-xs text-muted-foreground">
          {errorCount > 0 && (
            <>
              {errorCount} error
              {errorCount === 1 ? "" : "s"}
            </>
          )}

          {errorCount > 0 && warningCount > 0 && (
            <> · </>
          )}

          {warningCount > 0 && (
            <>
              {warningCount} warning
              {warningCount === 1 ? "" : "s"}
            </>
          )}
        </div>
      </div>

      <div className="max-h-64 overflow-auto p-2">
        {issues.map((issue) => {
          const content = (
            <>
              {issue.severity === "error" ? (
                <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
              ) : (
                <AlertTriangle className="mt-0.5 size-4 shrink-0 text-yellow-600" />
              )}

              <span className="text-left">
                {issue.message}
              </span>
            </>
          );

          if (issue.nodeId) {
            return (
              <button
                key={issue.id}
                type="button"
                onClick={() =>
                  selectNode(issue.nodeId ?? null)
                }
                className="flex w-full gap-2 rounded-md px-2 py-2 text-sm hover:bg-accent"
              >
                {content}
              </button>
            );
          }

          return (
            <div
              key={issue.id}
              className="flex gap-2 rounded-md px-2 py-2 text-sm"
            >
              {content}
            </div>
          );
        })}
      </div>
    </div>
  );
}