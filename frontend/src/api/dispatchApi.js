import { dispatchAxios } from './axiosInstance';

function unwrap(response) {
  return response.data?.data ?? response.data;
}

export async function getVehicles(params = {}) {
  const res = await dispatchAxios.get('/vehicles', { params });
  return unwrap(res);
}

export async function getVehicle(id) {
  const res = await dispatchAxios.get(`/vehicles/${id}`);
  return unwrap(res);
}

export async function getDispatches(params = {}) {
  const res = await dispatchAxios.get('/dispatches', { params });
  return unwrap(res);
}

export async function getDispatch(id) {
  const res = await dispatchAxios.get(`/dispatches/${id}`);
  return unwrap(res);
}

export async function getStations(params = {}) {
  const res = await dispatchAxios.get('/stations', { params });
  return unwrap(res);
}

export async function createDispatch(data) {
  const res = await dispatchAxios.post('/dispatches', data);
  return unwrap(res);
}

export async function updateDispatchStatus(id, status) {
  const res = await dispatchAxios.patch(`/dispatches/${id}/status`, null, { params: { status } });
  return unwrap(res);
}
