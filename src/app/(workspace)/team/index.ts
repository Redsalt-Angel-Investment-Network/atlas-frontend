import { WorkspaceMemberType } from "@/_types/workspaceMembers";
import { authFetch } from "@/utils/apiClient";

export async function getWorkspaceMembers(
  workspaceId: string,
): Promise<WorkspaceMemberType[]> {
  const res = await authFetch(`/workspace/${workspaceId}/members/`);

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData?.message || 'Failed to fetch workspace members');
  }

  const data: WorkspaceMemberType[] = await res.json();
  return data;
}
