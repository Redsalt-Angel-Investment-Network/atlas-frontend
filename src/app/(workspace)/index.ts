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

export async function getWorkspaceMemberships(): Promise<WorkspaceMemberType[]> {
  const res = await authFetch("/workspace/memberships");

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));

    throw new Error(
      errorData?.message || "Failed to fetch workspace memberships",
    );
  }

  const data: WorkspaceMemberType[] = await res.json();

  return data;
}

export async function switchWorkspaceApi(membershipId: string,): Promise<WorkspaceMemberType> {
  const res = await authFetch("/workspace/switch/", {
    method: "POST",
    body: JSON.stringify({
      membership_id: membershipId,
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));

    throw new Error(
      errorData?.message || "Failed to switch workspace",
    );
  }

  const data: WorkspaceMemberType = await res.json();

  return data;
}
