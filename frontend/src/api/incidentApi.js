import { incidentAxios } from './axiosInstance';

function unwrap(response) {
  return response.data?.data ?? response.data;
}

export async function getIncidents(params = {}) {
  const res = await incidentAxios.get('/incidents', { params });
  return unwrap(res);
}

export async function getIncident(id) {
  const res = await incidentAxios.get(`/incidents/${id}`);
  return unwrap(res);
}

export async function createIncident(data) {
  const res = await incidentAxios.post('/incidents', data);
  return unwrap(res);
}

export async function updateIncident(id, data) {
  const res = await incidentAxios.put(`/incidents/${id}`, data);
  return unwrap(res);
}

export async function resolveIncident(id) {
  const res = await incidentAxios.patch(`/incidents/${id}/resolve`);
  return unwrap(res);
}

export async function getResponders(params = {}) {
  const res = await incidentAxios.get('/responders', { params });
  return unwrap(res);
}

export async function assignVehicle(incidentId, vehicleId) {
  const res = await incidentAxios.patch(`/incidents/${incidentId}/assign`, { vehicleId });
  return unwrap(res);
}
