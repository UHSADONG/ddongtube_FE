// utils/sse.ts
import { EventSourcePolyfill, NativeEventSource } from 'event-source-polyfill';

export function createSSEConnection<D = unknown>(
  url: string,
  onMessage: (data: D) => void,
  onError?: (e: unknown) => void,
): EventSource {
  const fullURL = `${import.meta.env.VITE_REACT_SERVER_BASE_URL}${url}`;
  const EventSource = EventSourcePolyfill || NativeEventSource;
  const accessToken = sessionStorage.getItem('accessToken');
  const eventSource = new EventSource(
    fullURL,
    accessToken
      ? {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
          heartbeatTimeout: 30 * 60 * 1000,
        }
      : {},
  );

  eventSource.onmessage = (event) => {
    try {
      const parsedData = JSON.parse(event.data);
      onMessage(parsedData);
    } catch (e) {
      console.warn('Failed to parse SSE message:', e);
    }
  };

  eventSource.onerror = function (
    this: EventSource,
    ev: import('event-source-polyfill').Event,
  ): void {
    console.error('SSE Error:', ev);
    onError?.(ev);
  };

  return eventSource;
}
