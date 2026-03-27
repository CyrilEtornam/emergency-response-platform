import { useState, useEffect, useCallback } from 'react';
import { getUsers } from '../api/authApi';
import logger from '../utils/logger';

const PAGE_SIZE = 20;

/**
 * Fetches and filters users for the admin user management page.
 */
export function useUsers() {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(0);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getUsers();
      setAllUsers(Array.isArray(data) ? data : data?.content ?? []);
      setError(null);
    } catch (err) {
      logger.warn('useUsers fetch error', err);
      setError(err?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  // Reset page when filters change
  useEffect(() => { setPage(0); }, [search, roleFilter, statusFilter]);

  const filtered = allUsers.filter((u) => {
    const matchesSearch =
      !search ||
      u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    const matchesRole = !roleFilter || u.role === roleFilter;
    const matchesStatus =
      !statusFilter ||
      (statusFilter === 'ACTIVE' && u.active !== false) ||
      (statusFilter === 'INACTIVE' && u.active === false);
    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return {
    users: paged,
    totalUsers: filtered.length,
    loading,
    error,
    refetch: fetch,
    search, setSearch,
    roleFilter, setRoleFilter,
    statusFilter, setStatusFilter,
    page, setPage,
    totalPages,
    PAGE_SIZE,
  };
}
