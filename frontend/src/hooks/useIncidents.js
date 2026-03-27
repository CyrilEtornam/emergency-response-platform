import { useState, useEffect, useCallback, useRef } from 'react';
import { getIncidents } from '../api/incidentApi';
import logger from '../utils/logger';

const POLL_INTERVAL_MS = 30000;

/**
 * Fetches and polls incidents filtered by agency type.
 * @param {object} filters - e.g. { type: 'MEDICAL' }
 */
export function useIncidents(filters = {}) {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);
  const filtersRef = useRef(filters);

  useEffect(() => { filtersRef.current = filters; }, [filters]);

  const fetch = useCallback(async (isInitial = false) => {
    if (isInitial) setLoading(true);
    try {
      const data = await getIncidents(filtersRef.current);
      setIncidents(Array.isArray(data) ? data : data?.content ?? []);
      setError(null);
    } catch (err) {
      logger.warn('useIncidents fetch error', err);
      setError(err?.message || 'Failed to load incidents');
    } finally {
      if (isInitial) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch(true);
    intervalRef.current = setInterval(() => fetch(false), POLL_INTERVAL_MS);
    return () => clearInterval(intervalRef.current);
  }, [fetch, JSON.stringify(filters)]); // eslint-disable-line react-hooks/exhaustive-deps

  return { incidents, loading, error, refetch: () => fetch(true) };
}
