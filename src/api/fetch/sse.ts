export function createSSEConnection(
  url: string,
  onMessage: (data: any) => void,
  onError?: (e: Event) => void,
): EventSource {
  const fullURL = `${import.meta.env.VITE_REACT_SERVER_BASE_URL}${url}`;
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