import { authAxios } from './axiosInstance';

function unwrap(response) {
  return response.data?.data ?? response.data;
}

export async function login(email, password) {
  const res = await authAxios.post('/auth/login', { email, password });
  return unwrap(res);
}

export async function logout(refreshToken) {
  const res = await authAxios.post('/auth/logout', null, {
    params: { refreshToken },
  });
  return unwrap(res);
}

export async function refreshToken(token) {
  const res = await authAxios.post('/auth/refresh', { refreshToken: token });
  return unwrap(res);
}

export async function verifyToken(token) {
  const res = await authAxios.post('/auth/verify', { token });
  return unwrap(res);
}

// ─── User management (SUPER_ADMIN only) ──────────────────────────────────────

export async function getUsers(params = {}) {
  const res = await authAxios.get('/users', { params });
  return unwrap(res);
}

export async function getUserById(id) {
  const res = await authAxios.get(`/users/${id}`);
  return unwrap(res);
}

export async function createUser(userData) {
  const res = await authAxios.post('/auth/register', userData);
  return unwrap(res);
}

export async function updateUserRole(id, role) {
  const res = await authAxios.patch(`/users/${id}/role`, { role });
  return unwrap(res);
}

export async function updateUserStatus(id, active) {
  const res = await authAxios.patch(`/users/${id}/status`, { active });
  return unwrap(res);
}

export async function deleteUser(id) {
  const res = await authAxios.delete(`/users/${id}`);
  return unwrap(res);
}

export async function getRoles() {
  const res = await authAxios.get('/roles');
  return unwrap(res);
}

export async function getAuditLogs(params = {}) {
  const res = await authAxios.get('/audit-logs', { params });
  return unwrap(res);
}
