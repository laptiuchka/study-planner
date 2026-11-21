const BASE_URL = import.meta.env.VITE_API_URL || 'https://dummyjson.com';

export interface RequestOptions extends RequestInit {
  signal?: AbortSignal;
  requiresAuth?: boolean;
}

let authToken: string | null = null;

export const setHttpClientToken = (token: string | null) => {
  authToken = token;
};

function buildHeaders(customHeaders?: HeadersInit, requiresAuth = false): Headers {
  const headers = new Headers(customHeaders);
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  if (requiresAuth && authToken) {
    headers.set('Authorization', `Bearer ${authToken}`);
  }
  return headers;
}

export const httpClient = {
  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    const { requiresAuth, headers, ...rest } = options || {};
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: buildHeaders(headers, requiresAuth),
      ...rest,
    });

    if (!response.ok) {
      throw new Error(`HTTP помилка! Статус: ${response.status}`);
    }

    return response.json();
  },

  async post<T>(endpoint: string, body: unknown, options?: RequestOptions): Promise<T> {
    const { requiresAuth, headers, ...rest } = options || {};
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: buildHeaders(headers, requiresAuth),
      body: JSON.stringify(body),
      ...rest,
    });

    if (!response.ok) {
      throw new Error(`HTTP помилка! Статус: ${response.status}`);
    }

    return response.json();
  },

  async put<T>(endpoint: string, body: unknown, options?: RequestOptions): Promise<T> {
    const { requiresAuth, headers, ...rest } = options || {};
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: buildHeaders(headers, requiresAuth),
      body: JSON.stringify(body),
      ...rest,
    });

    if (!response.ok) {
      throw new Error(`HTTP помилка! Статус: ${response.status}`);
    }

    return response.json();
  },

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    const { requiresAuth, headers, ...rest } = options || {};
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: buildHeaders(headers, requiresAuth),
      ...rest,
    });

    if (!response.ok) {
      throw new Error(`HTTP помилка! Статус: ${response.status}`);
    }

    return response.json();
  },
};