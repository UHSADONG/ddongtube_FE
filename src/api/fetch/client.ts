import { ApiError } from '@/error/apiError';
import { getSessionStorage } from '@/utils/sessionStorage';
import * as Sentry from '@sentry/react';

const baseURL = import.meta.env.VITE_REACT_SERVER_BASE_URL;

async function handleResponse<T>(response: Response): Promise<T | boolean> {
  if (!response.ok) {
    const contentType = response.headers.get('content-type');
    let parsedResponse = null;
    if (contentType?.includes('application/json')) {
      parsedResponse = await response.json();
    }

    const message = parsedResponse?.message || response.statusText;
    const code = parsedResponse?.code || `HTTP_${response.status}`;
    throw new ApiError(response.status, response.statusText, message, code, parsedResponse);
  }
  const contentType = response.headers.get('content-type');
  if (contentType?.includes('application/json')) {
    return response.json() as Promise<T>;
  }
  return true;
}

async function request<T>(url: string, options: RequestInit): Promise<T> {
  if (import.meta.env.DEV) {
    console.log(`${options.method} : `, url);
  }

  const storage = getSessionStorage();
  if (storage) {
    const { accessToken } = storage;
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    };
  }

  try {
    const response = await fetch(`${baseURL}${url}`, options);
    return handleResponse(response) as Promise<T>;
  } catch (error: unknown) {
    console.error(error);
    Sentry.withScope((scope) => {
      scope.setContext('fetch', {
        url,
        ...options,
      });
      if (error instanceof ApiError) {
        scope.setTag('errorType', error.name);
        scope.setTag('errorCode', error.code);
        scope.setExtra('requestUrl', url);
        scope.setExtra('requestOptions', options);
        Sentry.captureException(error);
      } else {
        scope.setTag('errorType', 'UnknownError');
        scope.setTag('errorCode', 'UNE000');
        scope.setExtra('requestUrl', url);
        scope.setExtra('requestOptions', options);
        Sentry.captureException(error);
      }
    });
    throw error;
  }
}

export async function getFetch<T>(
  url: string,
  params?: Record<string, string | number | boolean>,
): Promise<T> {
  const queryString = params
    ? `?${new URLSearchParams(
        Object.entries(params).map(([key, value]) => [key, String(value)]),
      ).toString()}`
    : '';
  return request<T>(`${url}${queryString}`, { method: 'GET' });
}

export async function postFetch<T, K>(
  url: string,
  body?: Record<string, K | K[]> | K,
): Promise<T | boolean> {
  return request<T | boolean>(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

export async function postFormFetch<T>(url: string, formData: FormData): Promise<T | boolean> {
  return request<T | boolean>(url, {
    method: 'POST',
    body: formData,
  });
}

export async function putFetch<T, K>(url: string, body?: Record<string, K>): Promise<T> {
  return request<T>(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

export async function patchFetch<T, K>(url: string, body?: Record<string, K> | K): Promise<T> {
  return request<T>(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

export async function deleteFetch<T>(url: string): Promise<T> {
  return request<T>(url, { method: 'DELETE' });
}
