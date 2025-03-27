const baseURL = import.meta.env.VITE_REACT_SERVER_BASE_URL;

async function handleResponse<T>(response: Response): Promise<T | boolean> {
    if (!response.ok) {
        switch (response.status) {
        default:
            throw new Error(`Unexpected Error: ${response.status} ${response.statusText}`);
        }
    }
    const contentType = response.headers.get("content-type");

    if (contentType?.includes("application/json")) {
    return response.json() as Promise<T>;
    }

    return true;
}

async function request<T>(url: string, options: RequestInit): Promise<T> {
  if (import.meta.env.DEV) {
    console.log(`${options.method} : `, url);
  }

  const response = await fetch(`${baseURL}${url}`, options);
  return handleResponse(response) as Promise<T>;
}

export async function getFetch<T>(
  url: string,
  params?: Record<string, string | number | boolean>,
): Promise<T> {
  const queryString = params
    ? `?${new URLSearchParams(
        Object.entries(params).map(([key, value]) => [key, String(value)]),
      ).toString()}`
    : "";
  return request<T>(`${url}${queryString}`, { method: "GET" });
}

export async function postFetch<T, K>(
  url: string,
  body?: Record<string, K | K[]>,
): Promise<T | boolean> {
  return request<T | boolean>(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export async function putFetch<T, K>(
  url: string,
  body?: Record<string, K>,
): Promise<T> {
  return request<T>(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export async function deleteFetch<T>(
    url: string
): Promise<T> {
    return request<T>(url, { method: "DELETE" });
}
