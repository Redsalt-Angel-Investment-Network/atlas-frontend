"use client";

import type { WorkflowExecutionHistoryItem } from "@/_types/workflows";

type WorkflowExecutionHistoryProps = {
  executions: WorkflowExecutionHistoryItem[];
  isLoading: boolean;
  error: string | null;
  selectedExecutionId: string | null;
  onSelectExecution: (
    executionId: string
  ) => void;
};

function getExecutionStatusLabel(
  status: WorkflowExecutionHistoryItem["status"]
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

    case "cancelled":
      return "Cancelled";
  }
}

function getExecutionStatusClass(
  status: WorkflowExecutionHistoryItem["status"]
): string {
  switch (status) {
    case "pending":
      return "bg-muted-foreground";

    case "running":
      return "bg-blue-500 animate-pulse";

    case "completed":
      return "bg-green-500";

    case "failed":
      return "bg-destructive";

    case "cancelled":
      return "bg-yellow-500";
  }
}

function formatExecutionDate(
  value: string
): string {
  return new Intl.DateTimeFormat(
    undefined,
    {
      dateStyle: "medium",
      timeStyle: "short",
    }
  ).format(new Date(value));
}

export function WorkflowExecutionHistory({
  executions,
  isLoading,
  error,
  selectedExecutionId,
  onSelectExecution,
}: WorkflowExecutionHistoryProps) {
  return (
    <aside className="flex h-full w-[300px] shrink-0 flex-col border-r bg-background">
      <div className="flex h-14 shrink-0 items-center border-b px-4">
        <h2 className="text-sm font-semibold">
          Execution History
        </h2>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {isLoading && (
          <div className="flex items-center justify-center p-6">
            <p className="text-sm text-muted-foreground">
              Loading execution history...
            </p>
          </div>
        )}

        {!isLoading && error && (
          <div className="p-4">
            <p className="text-sm text-destructive">
              {error}
            </p>
          </div>
        )}

        {!isLoading &&
          !error &&
          executions.length === 0 && (
            <div className="flex items-center justify-center p-6">
              <p className="text-center text-sm text-muted-foreground">
                No executions yet.
              </p>
            </div>
          )}

        {!isLoading &&
          !error &&
          executions.length > 0 && (
            <div className="divide-y">
              {executions.map((execution) => {
                const isSelected =
                  execution.id ===
                  selectedExecutionId;

                return (
                  <button
                    key={execution.id}
                    type="button"
                    onClick={() =>
                      onSelectExecution(
                        execution.id
                      )
                    }
                    className={[
                      "w-full px-4 py-3 text-left transition-colors",
                      "hover:bg-muted/50",
                      isSelected
                        ? "bg-muted"
                        : "",
                    ].join(" ")}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {execution.reference}
                        </p>

                        <div className="mt-1 flex items-center gap-2">
                          <span
                            className={[
                              "h-2 w-2 shrink-0 rounded-full",
                              getExecutionStatusClass(
                                execution.status
                              ),
                            ].join(" ")}
                          />

                          <span className="text-xs text-muted-foreground">
                            {getExecutionStatusLabel(
                              execution.status
                            )}
                          </span>
                        </div>
                      </div>

                      <span className="shrink-0 text-xs text-muted-foreground">
                        v{execution.workflow_version}
                      </span>
                    </div>

                    <p className="mt-2 text-xs text-muted-foreground">
                      {formatExecutionDate(
                        execution.created_at
                      )}
                    </p>
                  </button>
                );
              })}
            </div>
          )}
      </div>
    </aside>
  );
}
