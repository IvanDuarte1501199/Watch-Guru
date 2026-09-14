'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { matchSocketUrl, type ClientMessage, type RoomCredentials, type RoomState } from '@/lib/match';

export type ConnectionStatus = 'connecting' | 'open' | 'reconnecting' | 'unauthorized';

const MAX_BACKOFF_MS = 10_000;

/**
 * Keeps a WebSocket to the room open (reconnecting with backoff) and exposes
 * the latest personalized room state pushed by the server.
 */
export function useMatchRoom(code: string, credentials: RoomCredentials | null) {
  const [state, setState] = useState<RoomState | null>(null);
  const [connection, setConnection] = useState<ConnectionStatus>('connecting');
  const [lastError, setLastError] = useState<{ code: string; at: number } | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!credentials) return;
    let attempt = 0;
    let stopped = false;
    let retryTimer: number | undefined;

    const open = () => {
      const socket = new WebSocket(matchSocketUrl());
      socketRef.current = socket;

      socket.onopen = () => {
        attempt = 0;
        setConnection('open');
        socket.send(JSON.stringify({ type: 'auth', code, token: credentials.token }));
      };

      socket.onmessage = (event) => {
        const message = JSON.parse(event.data as string) as
          | { type: 'state'; state: RoomState }
          | { type: 'error'; error: string };
        if (message.type === 'state') {
          setState(message.state);
          setLastError(null);
        } else {
          setLastError({ code: message.error, at: Date.now() });
        }
      };

      socket.onclose = (event) => {
        if (socketRef.current === socket) socketRef.current = null;
        if (stopped) return;
        // 4003: bad token, 4004: participant removed. Retrying won't help.
        if (event.code === 4003 || event.code === 4004) {
          setConnection('unauthorized');
          return;
        }
        setConnection('reconnecting');
        const delay = Math.min(MAX_BACKOFF_MS, 500 * 2 ** attempt++);
        retryTimer = window.setTimeout(open, delay);
      };
    };

    open();

    // Phones suspend sockets in the background; reconnect as soon as the tab is visible again.
    const onVisible = () => {
      if (document.visibilityState === 'visible' && !socketRef.current) {
        window.clearTimeout(retryTimer);
        attempt = 0;
        open();
      }
    };
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      stopped = true;
      window.clearTimeout(retryTimer);
      document.removeEventListener('visibilitychange', onVisible);
      socketRef.current?.close();
    };
  }, [code, credentials]);

  const send = useCallback((message: ClientMessage) => {
    const socket = socketRef.current;
    if (socket?.readyState !== WebSocket.OPEN) return false;
    socket.send(JSON.stringify(message));
    return true;
  }, []);

  return { state, connection, lastError, send };
}
