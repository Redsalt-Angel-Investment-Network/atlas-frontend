export type WorkflowStatus = "active" | "draft" | "paused" | "archived";
export type TriggerType = "webhook" | "schedule" | "event" | "manual";
export type ExecutionStatus = "success" | "failed" | "running" | "idle";

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
}

export type CreateWorkflowPayload = {
  name: string;
  description: string;
  is_active: boolean;
  trigger_type?: TriggerType;
}