import { CategoryType, CreateCategoryPayload } from "@/_types/category";
import { Entity } from "@/_types/entities";
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

export async function getCategoryApi(): Promise<CategoryType[]> {
  const res = await authFetch(`/categories/`);

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData?.message || "Failed to fetch categories");
  }

  const data: CategoryType[] = await res.json();
  return data;
}

export async function getEntitiesApi(
  categoryId?: string,
): Promise<Entity[]> {
  const query = categoryId
    ? `?category_id=${encodeURIComponent(categoryId)}`
    : "";
  const res = await authFetch(`/entities/${query}`);

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData?.message || "Failed to fetch entities",
    );
  }

  const data: Entity[] = await res.json();
  return data;
}

export async function createCategoryApi(
  categoryCreateData: CreateCategoryPayload,
): Promise<CategoryType> {
  const res = await authFetch("/categories/", {
    method: "POST",
    body: JSON.stringify(categoryCreateData),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData?.message || "Failed to create categories");
  }

  const data: CategoryType = await res.json();
  return data;
}
