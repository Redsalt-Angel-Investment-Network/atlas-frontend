import { CreateWorkflowPayload, UpdateWorkflowPayload, WorkflowExecutionHistoryItem, WorkflowExecutionResponse, WorkflowType } from "@/_types/workflows";
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
export const restoreWorkflowApi = async (
  workflowId: string,
): Promise<WorkflowType> => {
  const response = await authFetch(`/workflows/${workflowId}/restore/`, {
    method: "POST",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(
      errorData?.detail || "Failed to restore workflow",
    );
  }

  const data: WorkflowType = await response.json();
  return data;
};

export async function executeWorkflowApi(
  workflowId: string
): Promise<WorkflowExecutionResponse> {
  const response = await authFetch(
    `/workflows/${workflowId}/execute/`,
    {
      method: "POST",
    }
  );

  if (!response.ok) {
    const errorData =
      await response.json().catch(() => ({}));

    throw new Error(
      errorData?.message ||
        "Failed to execute workflow"
    );
  }

  const data: WorkflowExecutionResponse = await response.json();

  return data;
}

export async function getWorkflowExecutionsApi(
  workflowId: string
): Promise<WorkflowExecutionHistoryItem[]> {
  const response = await authFetch(
    `/workflows/${workflowId}/executions/`
  );

  if (!response.ok) {
    const errorData =
      await response.json().catch(() => ({}));

    throw new Error(
      errorData?.message ||
        errorData?.detail ||
        "Failed to load workflow executions"
    );
  }

  const data: WorkflowExecutionHistoryItem[] = await response.json();

  return data;
}

export async function getWorkflowExecutionApi(
  workflowId: string,
  executionId: string
): Promise<WorkflowExecutionResponse> {
  const response = await authFetch(
    `/workflows/${workflowId}/executions/${executionId}/`
  );

  if (!response.ok) {
    const errorData =
      await response.json().catch(() => ({}));

    throw new Error(
      errorData?.message ||
        errorData?.detail ||
        "Failed to load workflow execution"
    );
  }

  const data: WorkflowExecutionResponse = await response.json();

  return data;
}
