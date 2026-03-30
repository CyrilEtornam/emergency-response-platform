import { useState, useEffect, useCallback } from 'react';
import {
  getDashboard,
  getIncidentsByType,
  getResponseTimeTrend,
  getStatusBreakdown,
  getCrossAgencyStats,
} from '../api/analyticsApi';
import logger from '../utils/logger';

const MOCK_ANALYTICS = {
  dashboard: { totalIncidentsToday: 12, avgResponseTime: 8.4, vehiclesDeployed: 7, resolvedToday: 5 },
  incidentsByType: [
    { severity: 'CRITICAL', count: 3 },
    { severity: 'HIGH',     count: 5 },
    { severity: 'MEDIUM',   count: 7 },
    { severity: 'LOW',      count: 4 },
  ],
  responseTimeTrend: Array.from({ length: 14 }, (_, i) => ({
    date: new Date(Date.now() - (13 - i) * 86400000).toISOString().slice(0, 10),
    avgMinutes: Math.max(3, 8 + Math.round(Math.sin(i * 0.8) * 3)),
  })),
  statusBreakdown: [
    { status: 'REPORTED',  count: 4 },
    { status: 'ASSIGNED',  count: 3 },
    { status: 'EN_ROUTE',  count: 2 },
    { status: 'RESOLVED',  count: 5 },
  ],
};

/**
 * Fetches analytics data for the agency tab or admin analytics page.
 * Falls back to demo data when the analytics service is unavailable.
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

    // Fall back to mock data if all failed (analytics service is unavailable)
    const allFailed = results.every((r) => r.status === 'rejected');
    if (allFailed) {
      logger.warn('All analytics requests failed — using demo data');
      setDashboard(MOCK_ANALYTICS.dashboard);
      setIncidentsByType(MOCK_ANALYTICS.incidentsByType);
      setResponseTimeTrend(MOCK_ANALYTICS.responseTimeTrend);
      setStatusBreakdown(MOCK_ANALYTICS.statusBreakdown);
    }

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
