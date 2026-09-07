import { CategoryType, CreateCategoryPayload } from "@/_types/category";
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