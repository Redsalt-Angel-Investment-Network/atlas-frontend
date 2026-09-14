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
