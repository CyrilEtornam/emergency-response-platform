import { analyticsAxios } from './axiosInstance';

function unwrap(response) {
  return response.data?.data ?? response.data;
}

export async function getDashboard(params = {}) {
  const res = await analyticsAxios.get('/analytics/dashboard', { params });
  return unwrap(res);
}

export async function getIncidentsByType(params = {}) {
  const res = await analyticsAxios.get('/analytics/incidents/by-type', { params });
  return unwrap(res);
}

export async function getResponseTimeTrend(params = {}) {
  const res = await analyticsAxios.get('/analytics/response-times/trend', { params });
  return unwrap(res);
}

export async function getStatusBreakdown(params = {}) {
  const res = await analyticsAxios.get('/analytics/incidents/status-breakdown', { params });
  return unwrap(res);
}

export async function getCrossAgencyStats(params = {}) {
  const res = await analyticsAxios.get('/analytics/cross-agency', { params });
  return unwrap(res);
}

export async function getIncidentsList(params = {}) {
  const res = await analyticsAxios.get('/analytics/incidents', { params });
  return unwrap(res);
}

export async function getIncidentsByRegion(params = {}) {
  const res = await analyticsAxios.get('/analytics/incidents/by-region', { params });
  return unwrap(res);
}
