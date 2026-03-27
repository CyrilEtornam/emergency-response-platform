import { useState, useEffect, useCallback } from 'react';
import {
  getDashboard,
  getIncidentsByType,
  getResponseTimeTrend,
  getStatusBreakdown,
  getCrossAgencyStats,
} from '../api/analyticsApi';
import logger from '../utils/logger';

/**
 * Fetches analytics data for the agency tab or admin analytics page.
 * @param {object} options - { dateRange: '7d'|'14d'|'30d', agencyType: string }
 */
export function useAnalytics({ dateRange = '7d', agencyType } = {}) {
  const [dashboard, setDashboard] = useState(null);
  const [incidentsByType, setIncidentsByType] = useState([]);
  const [responseTimeTrend, setResponseTimeTrend] = useState([]);
  const [statusBreakdown, setStatusBreakdown] = useState([]);
  const [crossAgency, setCrossAgency] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const params = { dateRange, ...(agencyType ? { type: agencyType } : {}) };

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    const results = await Promise.allSettled([
      getDashboard(),
      getIncidentsByType(params),
      getResponseTimeTrend(params),
      getStatusBreakdown(params),
      getCrossAgencyStats(params),
    ]);

    const [dash, byType, trend, status, cross] = results;

    if (dash.status === 'fulfilled') setDashboard(dash.value);
    else logger.warn('getDashboard failed', dash.reason);

    if (byType.status === 'fulfilled') setIncidentsByType(Array.isArray(byType.value) ? byType.value : []);
    if (trend.status === 'fulfilled') setResponseTimeTrend(Array.isArray(trend.value) ? trend.value : []);
    if (status.status === 'fulfilled') setStatusBreakdown(Array.isArray(status.value) ? status.value : []);
    if (cross.status === 'fulfilled') setCrossAgency(cross.value);

    // Report error only if all failed
    const allFailed = results.every((r) => r.status === 'rejected');
    if (allFailed) setError('Analytics service unavailable');

    setLoading(false);
  }, [dateRange, agencyType]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { fetch(); }, [fetch]);

  return {
    dashboard,
    incidentsByType,
    responseTimeTrend,
    statusBreakdown,
    crossAgency,
    loading,
    error,
    refetch: fetch,
  };
}
