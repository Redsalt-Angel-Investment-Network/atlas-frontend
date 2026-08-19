import { RegisterPayload, RegisterResponse } from "@/_types/auth";
import { apiFetch } from "@/utils/apiClient";

export async function registerApi(
  payload: RegisterPayload,
): Promise<RegisterResponse> {
  const res = await apiFetch("/accounts/register/", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw {
      statusCode: res.status,
      responseBody: data,
    };
  }

  return data;
}
