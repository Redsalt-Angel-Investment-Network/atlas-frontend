import { CreateWorkflowPayload, UpdateWorkflowPayload, WorkflowType } from "@/_types/workflows";
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

export async function getWorkflowApi(
  workflowId: string
): Promise<WorkflowType> {
  const response = await authFetch(`/workflows/${workflowId}/`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.message || "Failed to create workflow");
  }

  const data: WorkflowType = await response.json();
  return data;
}

export async function updateWorkflowApi(
  workflowId: string,
  payload: UpdateWorkflowPayload
): Promise<WorkflowType> {
  const response = await authFetch(`/workflows/${workflowId}/`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.message || "Failed to update workflow");
  }

  const data: WorkflowType = await response.json();
  return data;
}

export async function deleteWorkflowAPI(id: string): Promise<void> {
  const endpoint = `/workflows/${id}/`;

  const res = await authFetch(endpoint, {
    method: "DELETE",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData?.message || "Failed to delete workflow");
  }
}