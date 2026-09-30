import { WorkflowFlowNode } from "@/workflow/stores/editor-store";
import type { Edge } from "@xyflow/react";

export type WorkflowStatus = "active" | "draft" | "paused" | "archived";
export type TriggerType = "webhook" | "schedule" | "event" | "manual";
export type ExecutionStatus = "success" | "failed" | "running" | "idle";

export type WorkflowDefinition = {
  nodes: WorkflowFlowNode[];
  edges: Edge[];
};

export type WorkflowType = {
  id: string;
  reference: string;
  workspace: string;
  name: string;
  description: string;
  is_active: boolean;
  version: number;
  created_at: string;
  updated_at: string;
  trigger_type?: TriggerType;
  last_run_status?: ExecutionStatus;
  total_runs?: number;
  definition: WorkflowDefinition;
};

export type CreateWorkflowPayload = {
  name: string;
  description: string;
  is_active: boolean;
  trigger_type?: TriggerType;
  definition?: WorkflowDefinition;
}

export type UpdateWorkflowPayload = {
  name?: string;
  description?: string;
  is_active?: boolean;
  definition: WorkflowDefinition;
};

export type WorkflowExecutionStatus =
  | "pending"
  | "running"
  | "completed"
  | "failed"
  | "cancelled";

export type WorkflowNodeExecutionStatus =
  | "pending"
  | "running"
  | "completed"
  | "failed"
  | "skipped"
  | "cancelled";

export type WorkflowNodeExecution = {
  id: string;
  node_id: string;
  node_type: string;
  status: WorkflowNodeExecutionStatus;
  output: Record<string, unknown> | null;
  error: Record<string, unknown> | null;
};

export type WorkflowExecutionResponse = {
  id: string;
  reference: string;
  workflow: string;
  workflow_version: number;
  status: WorkflowExecutionStatus;

  created_at: string;
  started_at: string | null;
  completed_at: string | null;

  input: Record<string, unknown> | null;
  output: Record<string, unknown> | null;

  error: {
    code: string;
    type: string;
    message: string;
  } | null;

  node_executions: WorkflowNodeExecution[];
};

export type WorkflowNodeExecutionState = {
  status: WorkflowNodeExecutionStatus;
  output: Record<string, unknown> | null;
  error: Record<string, unknown> | null;
};

export type WorkflowExecutionHistoryItem = {
  id: string;
  reference: string;
  workflow: string;
  workflow_version: number;
  status: WorkflowExecutionStatus;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
};
