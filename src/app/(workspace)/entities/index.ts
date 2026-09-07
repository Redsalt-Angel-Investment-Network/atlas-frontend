import { Entity } from "@/_types/entities";
import { authFetch } from "@/utils/apiClient";

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