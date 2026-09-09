import {
  CategoryType,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from "@/_types/category";
import { authFetch } from "@/utils/apiClient";

export async function getCategoryApi(): Promise<CategoryType[]> {
  const res = await authFetch(`/categories/`);

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData?.message || "Failed to fetch categories");
  }

  const data: CategoryType[] = await res.json();
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

export async function deleteCategoryAPI(id: string): Promise<void> {
  const endpoint = `/categories/${id}/`;

  const res = await authFetch(endpoint, {
    method: "DELETE",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData?.message || "Failed to deactivate category");
  }
}

export async function updateCategoryApi(
  categoryId: string,
  updates: UpdateCategoryPayload,
): Promise<CategoryType> {
  const endpoint = `/categories/${categoryId}/`;

  const res = await authFetch(endpoint, {
    method: "PATCH",
    body: JSON.stringify(updates),
  });

  if (!res.ok) {
    const errorData = await res.text();
    throw new Error(errorData || "Failed to update category");
  }

  const data: CategoryType = await res.json();

  return data;
}