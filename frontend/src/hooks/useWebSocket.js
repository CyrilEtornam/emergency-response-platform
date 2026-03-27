import { useEffect, useRef, useCallback } from 'react';
import { getAccessToken } from '../api/axiosInstance';
import logger from '../utils/logger';

const MAX_RETRIES = 5;
const BACKOFF_MS = 3000;

/**
 * Manages a WebSocket connection with automatic reconnection.
 * @param {string} url - WebSocket URL (without token)
 * @param {function} onMessage - callback(parsedData)
 * @param {boolean} enabled - connect only when true
 */
export function useWebSocket(url, onMessage, enabled = true) {
  const wsRef = useRef(null);
  const retriesRef = useRef(0);
  const reconnectTimerRef = useRef(null);
  const enabledRef = useRef(enabled);
  const onMessageRef = useRef(onMessage);
  const unmountedRef = useRef(false);

  // Keep refs up to date without triggering reconnects
  useEffect(() => { enabledRef.current = enabled; }, [enabled]);
  useEffect(() => { onMessageRef.current = onMessage; }, [onMessage]);

  const connect = useCallback(() => {
    if (!enabledRef.current || unmountedRef.current) return;

    const token = getAccessToken();
    const fullUrl = token ? `${url}?token=${token}` : url;

    logger.info(`WebSocket connecting to ${url} (attempt ${retriesRef.current + 1})`);

    const ws = new WebSocket(fullUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      logger.info('WebSocket connected');
      retriesRef.current = 0;
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessageRef.current?.(data);
      } catch {
        // non-JSON message — ignore
      }
    };

    ws.onerror = (err) => {
      logger.warn('WebSocket error', err);
    };

    ws.onclose = () => {
      if (unmountedRef.current) return;
      logger.info('WebSocket disconnected');

      if (retriesRef.current < MAX_RETRIES && enabledRef.current) {
        retriesRef.current += 1;
        logger.info(`Reconnecting in ${BACKOFF_MS}ms (retry ${retriesRef.current}/${MAX_RETRIES})`);
        reconnectTimerRef.current = setTimeout(connect, BACKOFF_MS);
      } else if (retriesRef.current >= MAX_RETRIES) {
        logger.warn('WebSocket max retries reached');
      }
    };
  }, [url]);

  useEffect(() => {
    unmountedRef.current = false;
    if (enabled && url) {
      connect();
    }
    return () => {
      unmountedRef.current = true;
      clearTimeout(reconnectTimerRef.current);
      if (wsRef.current) {
        wsRef.current.onclose = null; // prevent reconnect on intentional close
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [url, enabled, connect]);

  const isConnected = wsRef.current?.readyState === WebSocket.OPEN;
  const isMaxRetriesReached = retriesRef.current >= MAX_RETRIES;

  return { isConnected, isMaxRetriesReached };
}
