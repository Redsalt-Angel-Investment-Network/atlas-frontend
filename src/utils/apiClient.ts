const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

function getClientToken(): string | undefined {
  if (typeof window === 'undefined') {
    return undefined;
  }

  return document.cookie
    .split('; ')
     .find((row) => row.startsWith('accessToken='))
    ?.split('=')[1];
}

function redirectToLogin() {
  if (typeof window === 'undefined') {
    return;
  }
  const locale = window.location.pathname.match(/^\/(en|ja)(?:\/|$)/)?.[1] ?? 'en';
  window.location.href = `/${locale}/login`;
}

export function isTokenExpired(token: string): boolean {
  try {
    const payload = token.split('.')[1];

    if (!payload) {
      return true;
    }

    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = atob(
      normalized + '='.repeat((4 - (normalized.length % 4)) % 4)
    );
    const data = JSON.parse(decoded) as { exp?: number };

    if (typeof data.exp !== 'number') {
      return true;
    }

    return data.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
}

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const url = `${BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers: defaultHeaders,
  });

  return response
}

export async function authFetch(endpoint: string, options: RequestInit = {}) {
  let token: string | undefined;

  if (typeof window !== 'undefined') {
    token = getClientToken();
  }

  if (token && isTokenExpired(token)) {
    redirectToLogin();
    throw new Error('Authentication token expired');
  }

  const authHeaders = {
    ...options.headers,
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };

  const response = await apiFetch(endpoint, { ...options, headers: authHeaders });

  if (response.status === 401) {
    redirectToLogin();
  }

  return response;
}