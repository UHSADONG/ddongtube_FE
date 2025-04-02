// utils/sse.ts
import { EventSourcePolyfill, NativeEventSource } from "event-source-polyfill";
export function createSSEConnection(
  url: string,
  onMessage: (data: any) => void,
  onError?: (e: Event) => void,
): EventSource {
  let fullURL = `${import.meta.env.VITE_REACT_SERVER_BASE_URL}${url}`;
  const EventSource = EventSourcePolyfill || NativeEventSource;
  const accessToken = sessionStorage.getItem("accessToken")
  const eventSource = new EventSource(fullURL,
    accessToken ? 
    {
    headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
  } : {});

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