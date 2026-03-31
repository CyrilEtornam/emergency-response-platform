import React, { useState, useEffect } from 'react';
import { getAuditLogs } from '../../api/authApi';
import { Table, Pagination } from '../../components/common/Table';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { formatDate } from '../../utils/formatters';
import { downloadCsv } from '../../utils/formatters';
import logger from '../../utils/logger';

const PAGE_SIZE = 50;

const filterInputCls = 'px-3 py-2 text-[13px] bg-input border border-subtle text-primary placeholder:text-muted rounded-[4px] focus:outline-none focus:ring-1 focus:ring-accent';

export function AuditLogsPage() {
  const [allLogs, setAllLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [page, setPage] = useState(0);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await getAuditLogs();
        setAllLogs(Array.isArray(data) ? data : data?.content ?? []);
        setError(null);
      } catch (err) {
        logger.warn('AuditLogs fetch error', err);
        setError(err?.message || 'Failed to load audit logs');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Reset page on filter change
  useEffect(() => { setPage(0); }, [search, actionFilter, startDate, endDate]);

  const filtered = allLogs.filter((log) => {
    const matchesSearch =
      !search ||
      log.userName?.toLowerCase().includes(search.toLowerCase()) ||
      log.userEmail?.toLowerCase().includes(search.toLowerCase()) ||
      log.email?.toLowerCase().includes(search.toLowerCase());
    const matchesAction = !actionFilter || log.action === actionFilter || log.actionType === actionFilter;
    const ts = log.timestamp || log.createdAt;
    const matchesStart = !startDate || (ts && new Date(ts) >= new Date(startDate));
    const matchesEnd = !endDate || (ts && new Date(ts) <= new Date(endDate + 'T23:59:59'));
    return matchesSearch && matchesAction && matchesStart && matchesEnd;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const uniqueActions = [...new Set(allLogs.map((l) => l.action || l.actionType).filter(Boolean))];

  function handleExport() {
    downloadCsv('audit-logs.csv', filtered, ['timestamp', 'userName', 'email', 'action', 'ipAddress']);
  }

  const columns = [
    { key: 'timestamp', label: 'Timestamp', render: (v, row) => formatDate(v || row.createdAt) },
    { key: 'userName', label: 'User', render: (v, row) => v || row.userFullName || '—' },
    { key: 'email', label: 'Email', render: (v, row) => v || row.userEmail || '—' },
    { key: 'action', label: 'Action', render: (v, row) => (
      <span className="font-mono text-[11px] bg-input border border-subtle text-secondary px-2 py-0.5 rounded-[4px]">
        {v || row.actionType || '—'}
      </span>
    )},
    { key: 'ipAddress', label: 'IP Address', render: (v) => (
      <span className="text-secondary font-mono text-[12px]">{v || '—'}</span>
    )},
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-[20px] font-semibold text-primary">Audit Logs</h1>
          <p className="text-[13px] text-secondary mt-0.5">{filtered.length} records</p>
        </div>
        <Button variant="secondary" onClick={handleExport}>
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-4 flex-wrap">
        <input
          type="search"
          placeholder="Search by user or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`flex-1 min-w-[180px] ${filterInputCls}`}
        />
        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className={`${filterInputCls} appearance-none`}
        >
          <option value="">All actions</option>
          {uniqueActions.map((a) => <option key={a} value={a}>{a}</option>)}
        </select>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className={filterInputCls}
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className={filterInputCls}
        />
        {(search || actionFilter || startDate || endDate) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { setSearch(''); setActionFilter(''); setStartDate(''); setEndDate(''); }}
          >
            Clear filters
          </Button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-surface border border-danger/30 rounded-[4px] text-[13px] text-danger">
          {error}
        </div>
      )}

      <Card>
        <Table
          columns={columns}
          data={paged}
          loading={loading}
          emptyTitle="No audit logs found"
          emptyDescription="Try adjusting your filters or date range."
        />
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </Card>
    </div>
  );
}
