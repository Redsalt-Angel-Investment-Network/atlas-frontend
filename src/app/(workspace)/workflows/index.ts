import { CreateWorkflowPayload, WorkflowType } from "@/_types/workflows";
import { authFetch } from "@/utils/apiClient";


export async function getWorkflowsApi(): Promise<WorkflowType[]> {
  const res = await authFetch(`/workflows/`);

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData?.message || "Failed to fetch workflows");
  }

  const data: WorkflowType[] = await res.json();
  return data;
}

export async function createWorkflowApi(
  workflowCreateData: CreateWorkflowPayload,
): Promise<WorkflowType> {
  const res = await authFetch(`/workflows/`, {
    method: "POST",
    body: JSON.stringify(workflowCreateData),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData?.message || "Failed to create workflow");
  }

  const data: WorkflowType = await res.json();
  return data;
}