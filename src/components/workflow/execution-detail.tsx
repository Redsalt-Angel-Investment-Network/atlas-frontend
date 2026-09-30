"use client";

import type {
  WorkflowExecutionResponse,
  WorkflowNodeExecution,
} from "@/_types/workflows";

type WorkflowExecutionDetailProps = {
  execution: WorkflowExecutionResponse | null;
  isLoading: boolean;
  error: string | null;
  onClose: () => void;
};

function getExecutionStatusLabel(
  status: WorkflowExecutionResponse["status"]
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
  status: WorkflowExecutionResponse["status"]
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

function getNodeExecutionStatusLabel(
  status: WorkflowNodeExecution["status"]
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

function getNodeExecutionStatusClass(
  status: WorkflowNodeExecution["status"]
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

    case "skipped":
      return "bg-muted-foreground";

    case "cancelled":
      return "bg-yellow-500";
  }
}

function formatDate(
  value: string | null
): string {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat(
    undefined,
    {
      dateStyle: "medium",
      timeStyle: "short",
    }
  ).format(new Date(value));
}

function hasError(
  error: Record<string, unknown> | null
): boolean {
  return (
    error !== null &&
    Object.keys(error).length > 0
  );
}

function JsonBlock({
  value,
}: {
  value: Record<string, unknown> | null;
}) {
  if (!value || Object.keys(value).length === 0) {
    return (
      <p className="text-xs text-muted-foreground">
        No data.
      </p>
    );
  }

  return (
    <pre className="max-h-64 overflow-auto rounded-md border bg-muted/30 p-3 text-xs">
      {JSON.stringify(value, null, 2)}
    </pre>
  );
}

function NodeExecution({
  execution,
}: {
  execution: WorkflowNodeExecution;
}) {
  const failed = execution.status === "failed";

  return (
    <div className="rounded-md border p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">
            {execution.node_id}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            {execution.node_type}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <span
            className={[
              "h-2 w-2 rounded-full",
              getNodeExecutionStatusClass(
                execution.status
              ),
            ].join(" ")}
          />

          <span className="text-xs text-muted-foreground">
            {getNodeExecutionStatusLabel(
              execution.status
            )}
          </span>
        </div>
      </div>

      {execution.output && (
        <div className="mt-3">
          <p className="mb-1 text-xs font-medium">
            Output
          </p>

          <JsonBlock
            value={execution.output}
          />
        </div>
      )}

      {failed &&
        hasError(execution.error) && (
          <div className="mt-3">
            <p className="mb-1 text-xs font-medium text-destructive">
              Error
            </p>

            <JsonBlock
              value={execution.error}
            />
          </div>
        )}
    </div>
  );
}

export function WorkflowExecutionDetail({
  execution,
  isLoading,
  error,
  onClose,
}: WorkflowExecutionDetailProps) {
  return (
    <aside className="flex h-full w-[360px] shrink-0 flex-col border-l bg-background">
      <div className="flex h-14 shrink-0 items-center justify-between border-b px-4">
        <div>
          <h2 className="text-sm font-semibold">
            Execution Detail
          </h2>

          {execution && (
            <p className="text-xs text-muted-foreground">
              {execution.reference}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Close
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <p className="text-sm text-muted-foreground">
              Loading execution...
            </p>
          </div>
        )}

        {!isLoading && error && (
          <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3">
            <p className="text-sm text-destructive">
              {error}
            </p>
          </div>
        )}

        {!isLoading &&
          !error &&
          !execution && (
            <p className="text-sm text-muted-foreground">
              Select an execution to view its details.
            </p>
          )}

        {!isLoading &&
          !error &&
          execution && (
            <div className="space-y-6">
              <section>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Status
                    </p>

                    <div className="mt-1 flex items-center gap-2">
                      <span
                        className={[
                          "h-2 w-2 rounded-full",
                          getExecutionStatusClass(
                            execution.status
                          ),
                        ].join(" ")}
                      />

                      <span className="text-sm font-medium">
                        {getExecutionStatusLabel(
                          execution.status
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">
                      Version
                    </p>

                    <p className="mt-1 text-sm font-medium">
                      v{execution.workflow_version}
                    </p>
                  </div>
                </div>
              </section>

              <section className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Created
                  </p>

                  <p className="text-sm">
                    {formatDate(
                      execution.created_at
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Started
                  </p>

                  <p className="text-sm">
                    {formatDate(
                      execution.started_at
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Completed
                  </p>

                  <p className="text-sm">
                    {formatDate(
                      execution.completed_at
                    )}
                  </p>
                </div>
              </section>

              {execution.input &&
                Object.keys(
                  execution.input
                ).length > 0 && (
                  <section>
                    <p className="mb-2 text-xs font-medium">
                      Input
                    </p>

                    <JsonBlock
                      value={execution.input}
                    />
                  </section>
                )}

              {execution.output &&
                Object.keys(
                  execution.output
                ).length > 0 && (
                  <section>
                    <p className="mb-2 text-xs font-medium">
                      Output
                    </p>

                    <JsonBlock
                      value={execution.output}
                    />
                  </section>
                )}

              {execution.status === "failed" &&
                hasError(execution.error) && (
                  <section>
                    <p className="mb-2 text-xs font-medium text-destructive">
                      Execution Error
                    </p>

                    <JsonBlock
                      value={execution.error}
                    />
                  </section>
                )}

              <section>
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs font-medium">
                    Node Executions
                  </p>

                  <span className="text-xs text-muted-foreground">
                    {execution.node_executions.length}
                  </span>
                </div>

                <div className="space-y-2">
                  {execution.node_executions.map(
                    (nodeExecution) => (
                      <NodeExecution
                        key={nodeExecution.id}
                        execution={nodeExecution}
                      />
                    )
                  )}
                </div>
              </section>
            </div>
          )}
      </div>
    </aside>
  );
}
