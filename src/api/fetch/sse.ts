// utils/sse.ts
export function createSSEConnection(
  url: string,
  onMessage: (data: any) => void,
  onError?: (e: Event) => void,
  headers?: Record<string, string>
): EventSource {
  let fullURL = `${import.meta.env.VITE_REACT_SERVER_BASE_URL}${url}`;
  // headers가 있으면 쿼리 파라미터로 붙임 (EventSource는 headers 지원 안 함)
  if (headers) {
    const params = new URLSearchParams();
    for (const key in headers) {
      params.append(key, headers[key]);
    }
    fullURL += `?${params.toString()}`;
  }
  const eventSource = new EventSource(fullURL);

  eventSource.onmessage = (event) => {
    try {
      const parsedData = JSON.parse(event.data);
      onMessage(parsedData);
    } catch (e) {
      console.warn("Failed to parse SSE message:", e);
    }
  };

  eventSource.onerror = (e) => {
    console.error("SSE Error:", e);
    onError?.(e);
  };

  return eventSource;
}