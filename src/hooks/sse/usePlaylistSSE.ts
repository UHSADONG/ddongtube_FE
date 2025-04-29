import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { EventSourcePolyfill, NativeEventSource } from 'event-source-polyfill';
import * as Sentry from '@sentry/react';
import { usePlaylistContext } from '@/providers/PlaylistProvider';

interface UsePlaylistSSEProps {
  playlistCode: string;
  accessToken: string;
}

export const usePlaylistSSE = ({ playlistCode, accessToken }: UsePlaylistSSEProps) => {
    
  const queryClient = useQueryClient();
  const { dispatch } = usePlaylistContext();

  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectAttemptRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const sixteenCountRef = useRef(0);

  useEffect(() => {
    if (!playlistCode || !accessToken) return;

    const fullURL = `${import.meta.env.VITE_REACT_SERVER_BASE_URL}/sse/${playlistCode}/connect`;
    const EventSourceImpl = EventSourcePolyfill || NativeEventSource;

    const connect = () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      eventSourceRef.current = new EventSourceImpl(fullURL, {
        headers: { Authorization: `Bearer ${accessToken}` },
        heartbeatTimeout: 30 * 60 * 1000,
      });

      eventSourceRef.current.addEventListener('connect', (message: MessageEvent) => {
        dispatch({ type: 'SET_LIVE', live: true });
        const data = JSON.parse(message.data);
        dispatch({ type: 'SET_LISTENER', listenerCount: data.clientCount });
        reconnectAttemptRef.current = 0;
      });

      eventSourceRef.current.addEventListener('video', (message: MessageEvent) => {
        const data = JSON.parse(message.data);

        if (data.status === 'DELETE') {
          queryClient.setQueryData(['playlist', playlistCode], (oldData: any) => {
            const updatedList = oldData.result.videoList.filter((v: any) => v.code !== data.videoCode);
            return {
              ...oldData,
              result: { ...oldData.result, videoList: updatedList },
            };
          });
        }

        if (data.status === 'ADD') {
          queryClient.setQueryData(['playlist', playlistCode], (oldData: any) => {
            const updatedList = [...oldData.result.videoList, data.video];
            return {
              ...oldData,
              result: { ...oldData.result, videoList: updatedList },
            };
          });
        }
      });

      eventSourceRef.current.addEventListener('playing', (message: MessageEvent) => {
        const data = JSON.parse(message.data);
        if (data?.videoCode) {
          queryClient.setQueryData(['playlist', playlistCode], (oldData: any) => {
            return {
              ...oldData,
              result: {
                ...oldData.result,
                nowPlayingVideoCode: data.videoCode,
              },
            };
          });

        const oldData: any = queryClient.getQueryData(['playlist', playlistCode]);
        if (oldData) {
            const videoList = oldData.result.videoList ?? [];
            const foundIndex = videoList.findIndex((v: any) => v.code === data.videoCode);
            if (foundIndex !== -1) {
                dispatch({ type: 'SET_INDEX', index: foundIndex });
            }
        }
        }
      });

      eventSourceRef.current.addEventListener('enter', (message: MessageEvent) => {
        const data = JSON.parse(message.data);
        if (data?.clientCount) {
          dispatch({ type: 'SET_LISTENER', listenerCount: data.clientCount });
        }
      });

      eventSourceRef.current.addEventListener('ping', (message: MessageEvent) => {
        const data = JSON.parse(message.data);
        if (data?.clientCount) {
          dispatch({ type: 'SET_LISTENER', listenerCount: data.clientCount });
        }
      });

      eventSourceRef.current.onerror = (error) => {
        eventSourceRef.current?.close();
        dispatch({ type: 'SET_LIVE', live: false });
        Sentry.withScope((scope) => {
          scope.setContext('SSE', { playlistCode });
          scope.setTag('errorType', 'SSE Error');
          Sentry.captureException(error);
        });

        reconnectAttemptRef.current++;
        const backoffSec = Math.min(Math.pow(2, reconnectAttemptRef.current), 16);
        const backoffMs = backoffSec * 1000;

        if (backoffSec === 16) sixteenCountRef.current++;
        else sixteenCountRef.current = 0;

        if (sixteenCountRef.current >= 10) {
          console.error('SSE connection failed after multiple attempts.');
          return;
        }

        if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = setTimeout(connect, backoffMs);
      };
    };

    connect();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      dispatch({ type: 'SET_LIVE', live: false });
    };
  }, [playlistCode, accessToken]);
};
