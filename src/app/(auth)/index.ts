import { LogoutPayload, RegisterPayload, RegisterResponse } from "@/_types/auth";
import { apiFetch } from "@/utils/apiClient";
import { LoginPayload, LoginResponse } from "@/_types/auth";

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


export async function loginApi(payload: LoginPayload): Promise<LoginResponse> {
  const response = await apiFetch("/accounts/login/", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "An error occurred during login.");
  }

  return data;
}


export async function logoutApi(payload: LogoutPayload): Promise<void> {
  const response = await apiFetch("/accounts/logout/", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "An error occurred during login.");
  }

  return data;
}
