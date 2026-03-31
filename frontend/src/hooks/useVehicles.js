import { useState, useEffect, useCallback } from 'react';
import { getVehicles } from '../api/dispatchApi';
import logger from '../utils/logger';

/**
 * Loads initial vehicle list via REST.
 * Real-time position updates come through useWebSocket in AgencyShell.
 * @param {object} filters - e.g. { type: 'AMBULANCE' }
 */
export function useVehicles(filters = {}) {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getVehicles(filters);
      setVehicles(Array.isArray(data) ? data : data?.content ?? []);
      setError(null);
    } catch (err) {
      logger.warn('useVehicles fetch error', err);
      setError(err?.message || 'Failed to load vehicles');
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { fetch(); }, [fetch]);

  /**
   * Updates a vehicle's position/state from a WebSocket message.
   */
  const updateVehicle = useCallback((update) => {
    if (!update) return;
    const normalized = { ...update };
    if (update.location) {
      normalized.latitude = update.location.latitude;
      normalized.longitude = update.location.longitude;
    }

    setVehicles((prev) => {
      const idx = prev.findIndex((v) => v.id === normalized.vehicleId || v.id === normalized.id);
      if (idx === -1) {
        return [...prev, normalized];
      }
      const updated = [...prev];
      updated[idx] = { ...updated[idx], ...normalized };
      return updated;
    });
  }, []);

  return { vehicles, loading, error, refetch: fetch, updateVehicle };
}
