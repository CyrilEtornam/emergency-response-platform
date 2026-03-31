import React, { useState, useEffect, useCallback } from 'react';
import clsx from 'clsx';
import { Badge } from '../../components/common/Badge';
import { Spinner } from '../../components/common/Spinner';
import { EmptyState } from '../../components/common/EmptyState';
import { Button } from '../../components/common/Button';
import { toast } from '../../components/common/Toast';
import { VEHICLE_TYPE_TO_ICON, VEHICLE_STATUSES } from '../../utils/constants';
import { getDispatches, updateDispatchStatus } from '../../api/dispatchApi';
import { formatTimeAgo } from '../../utils/formatters';
import logger from '../../utils/logger';

const selectCls =
  'bg-input border border-subtle text-primary text-[12px] rounded-[4px] px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-accent cursor-pointer appearance-none';

function VehicleRow({ vehicle, isSelected, onClick }) {
  const iconUrl = VEHICLE_TYPE_TO_ICON[vehicle.type] || VEHICLE_TYPE_TO_ICON.AMBULANCE;

  return (
    <div
      onClick={() => onClick(vehicle)}
      className={clsx(
        'flex items-center gap-3 px-4 py-3 border-b border-subtle last:border-0 cursor-pointer transition-colors',
        'hover:bg-elevated',
        isSelected && 'bg-accent/10'
      )}
    >
      <div className="w-8 h-8 shrink-0 flex items-center justify-center bg-input border border-subtle rounded-[4px]">
        <img src={iconUrl} alt={vehicle.type} className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-medium text-primary">
            {vehicle.registrationNumber || vehicle.plateNumber || vehicle.callSign || vehicle.id?.slice(0, 8)}
          </span>
          <Badge variant="status" value={vehicle.status} />
        </div>
        <p className="text-[12px] text-secondary truncate">
          {vehicle.driverName || vehicle.driver || 'Unassigned'}
          {vehicle.speed != null && ` · ${vehicle.speed} km/h`}
        </p>
        {vehicle.incidentId && (
          <p className="text-[12px] text-accent mt-0.5">→ Incident #{vehicle.incidentId?.slice(0, 8)}</p>
        )}
      </div>
    </div>
  );
}

function DispatchRecord({ record }) {
  const [updatingStatus, setUpdatingStatus] = useState(false);

  async function handleStatusChange(newStatus) {
    setUpdatingStatus(true);
    try {
      await updateDispatchStatus(record.id, newStatus);
      toast(`Status updated to ${newStatus}`, 'success');
    } catch (err) {
      logger.warn('Failed to update dispatch status', err);
      toast(err?.message || 'Failed to update status', 'error');
    } finally {
      setUpdatingStatus(false);
    }
  }

  const nextStatus = {
    ASSIGNED: 'EN_ROUTE',
    EN_ROUTE: 'ON_SCENE',
    ON_SCENE: 'COMPLETED',
  }[record.status];

  return (
    <div className="flex items-start gap-3 px-4 py-3 border-b border-subtle last:border-0">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <Badge variant="status" value={record.status} />
          <span className="text-[12px] text-secondary">
            {formatTimeAgo(record.dispatchedAt)}
          </span>
        </div>
        <p className="text-[12px] text-secondary truncate">
          Incident #{record.incidentId?.slice(0, 8)} · Vehicle #{record.vehicleId?.slice(0, 8)}
        </p>
        {record.notes && (
          <p className="text-[12px] text-muted mt-0.5 truncate">{record.notes}</p>
        )}
      </div>
      {nextStatus && (
        <Button
          variant="ghost"
          size="sm"
          loading={updatingStatus}
          onClick={() => handleStatusChange(nextStatus)}
        >
          → {nextStatus.replace('_', ' ')}
        </Button>
      )}
    </div>
  );
}

export function DispatchTab({ vehicles, loading, error, selectedId, onSelect }) {
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [view, setView] = useState('vehicles'); // 'vehicles' | 'dispatches'
  const [dispatches, setDispatches] = useState([]);
  const [dispatchesLoading, setDispatchesLoading] = useState(false);

  const loadDispatches = useCallback(async () => {
    setDispatchesLoading(true);
    try {
      const data = await getDispatches();
      setDispatches(Array.isArray(data) ? data : data?.content ?? []);
    } catch (err) {
      logger.warn('Failed to load dispatches', err);
    } finally {
      setDispatchesLoading(false);
    }
  }, []);

  useEffect(() => {
    if (view === 'dispatches') loadDispatches();
  }, [view, loadDispatches]);

  const activeCount = vehicles.filter(
    (v) => v.status === 'EN_ROUTE' || v.status === 'ON_SCENE'
  ).length;

  const filtered = statusFilter === 'ALL'
    ? vehicles
    : vehicles.filter((v) => v.status === statusFilter);

  const activeDispatches = dispatches.filter(
    (d) => d.status === 'ASSIGNED' || d.status === 'EN_ROUTE' || d.status === 'ON_SCENE'
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-subtle shrink-0">
        <div className="flex items-center gap-2">
          <h3 className="text-[14px] font-semibold text-primary">Dispatch</h3>
          {!loading && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-info/15 text-info">
              {activeCount} deployed
            </span>
          )}
        </div>
        <span className="text-[12px] text-secondary">{filtered.length} vehicles</span>
      </div>

      {/* View toggle */}
      <div className="flex border-b border-subtle shrink-0 bg-input">
        {[['vehicles', 'Vehicles'], ['dispatches', 'Active Dispatches']].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setView(key)}
            className={clsx(
              'flex-1 py-2 text-[12px] font-medium transition-colors',
              view === key
                ? 'text-accent border-b-2 border-accent'
                : 'text-secondary hover:text-primary'
            )}
          >
            {label}
            {key === 'dispatches' && activeDispatches.length > 0 && (
              <span className="ml-1.5 inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] bg-accent/20 text-accent">
                {activeDispatches.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Vehicles view */}
      {view === 'vehicles' && (
        <>
          {!loading && !error && (
            <div className="px-3 py-2 border-b border-subtle flex gap-2 items-center shrink-0 bg-input">
              <span className="text-[12px] text-secondary shrink-0">Status</span>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={selectCls}>
                <option value="ALL">All</option>
                {VEHICLE_STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Spinner size="lg" />
            </div>
          ) : error ? (
            <div className="px-4 py-8 text-center space-y-2">
              <p className="text-[13px] text-danger">{error}</p>
              <p className="text-[12px] text-secondary">Ensure the dispatch service is running on port 8083</p>
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              title={vehicles.length === 0 ? 'No vehicles' : 'No matches'}
              description={
                vehicles.length === 0
                  ? 'Vehicle data will appear when the dispatch service is available.'
                  : 'Try a different status filter.'
              }
            />
          ) : (
            <div className="overflow-y-auto flex-1">
              {filtered.map((v) => (
                <VehicleRow
                  key={v.id}
                  vehicle={v}
                  isSelected={v.id === selectedId}
                  onClick={onSelect}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Dispatches view */}
      {view === 'dispatches' && (
        <>
          {dispatchesLoading ? (
            <div className="flex items-center justify-center py-16">
              <Spinner size="lg" />
            </div>
          ) : dispatches.length === 0 ? (
            <EmptyState
              title="No dispatches"
              description="Dispatches will appear here once incidents are assigned."
            />
          ) : (
            <div className="overflow-y-auto flex-1">
              {/* Active first */}
              {activeDispatches.length > 0 && (
                <>
                  <div className="px-4 py-2 bg-elevated border-b border-subtle">
                    <span className="text-[11px] font-medium uppercase tracking-widest text-secondary">Active</span>
                  </div>
                  {activeDispatches.map((d) => (
                    <DispatchRecord key={d.id} record={d} />
                  ))}
                </>
              )}
              {/* Completed */}
              {dispatches.filter((d) => d.status === 'COMPLETED').length > 0 && (
                <>
                  <div className="px-4 py-2 bg-elevated border-b border-subtle border-t border-subtle">
                    <span className="text-[11px] font-medium uppercase tracking-widest text-secondary">Completed</span>
                  </div>
                  {dispatches.filter((d) => d.status === 'COMPLETED').slice(0, 10).map((d) => (
                    <DispatchRecord key={d.id} record={d} />
                  ))}
                </>
              )}
            </div>
          )}
          <div className="px-4 py-2 border-t border-subtle shrink-0">
            <button
              onClick={loadDispatches}
              className="text-[12px] text-secondary hover:text-primary transition-colors"
            >
              Refresh
            </button>
          </div>
        </>
      )}
    </div>
  );
}
