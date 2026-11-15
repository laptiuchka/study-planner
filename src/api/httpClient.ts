const BASE_URL = import.meta.env.VITE_API_URL || 'https://dummyjson.com';

export interface RequestOptions extends RequestInit {
  signal?: AbortSignal;
}

export const httpClient = {
  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP помилка! Статус: ${response.status}`);
    }

    return response.json();
  },

  async post<T>(endpoint: string, body: unknown, options?: RequestOptions): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP помилка! Статус: ${response.status}`);
    }

    return response.json();
  },

  async put<T>(endpoint: string, body: unknown, options?: RequestOptions): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP помилка! Статус: ${response.status}`);
    }

    return response.json();
  },

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP помилка! Статус: ${response.status}`);
    }

    return response.json();
  },
};