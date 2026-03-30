import React, { useState } from 'react';
import clsx from 'clsx';
import { Badge } from '../../components/common/Badge';
import { Spinner } from '../../components/common/Spinner';
import { EmptyState } from '../../components/common/EmptyState';
import { VEHICLE_TYPE_TO_ICON, VEHICLE_STATUSES } from '../../utils/constants';

const selectCls =
  'bg-[#0F172A] border border-[#334155] text-[#F1F5F9] text-xs rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#3B82F6] cursor-pointer';

function VehicleRow({ vehicle, isSelected, onClick }) {
  const iconUrl = VEHICLE_TYPE_TO_ICON[vehicle.type] || VEHICLE_TYPE_TO_ICON.AMBULANCE;

  return (
    <div
      onClick={() => onClick(vehicle)}
      className={clsx(
        'flex items-center gap-3 px-4 py-3 border-b border-[#334155] last:border-0 cursor-pointer transition-colors',
        'hover:bg-[#263147]',
        isSelected && 'bg-[#1E3A5F]'
      )}
    >
      {/* Icon */}
      <div className="w-8 h-8 shrink-0 flex items-center justify-center bg-[#0F172A] border border-[#334155] rounded">
        <img src={iconUrl} alt={vehicle.type} className="w-5 h-5" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[#F1F5F9]">
            {vehicle.registrationNumber || vehicle.plateNumber || vehicle.id?.slice(0, 8)}
          </span>
          <Badge variant="status" value={vehicle.status} />
        </div>
        <p className="text-xs text-[#94A3B8] truncate">
          {vehicle.driverName || vehicle.driver || 'Unassigned'}
          {vehicle.speed != null && ` · ${vehicle.speed} km/h`}
        </p>
        {vehicle.incidentId && (
          <p className="text-xs text-accent mt-0.5">→ Incident #{vehicle.incidentId?.slice(0, 8)}</p>
        )}
      </div>
    </div>
  );
}

export function DispatchTab({ vehicles, loading, error, selectedId, onSelect }) {
  const [statusFilter, setStatusFilter] = useState('ALL');

  const activeCount = vehicles.filter(
    (v) => v.status === 'EN_ROUTE' || v.status === 'ON_SCENE'
  ).length;

  const filtered = statusFilter === 'ALL'
    ? vehicles
    : vehicles.filter((v) => v.status === statusFilter);

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#334155] shrink-0">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-[#F1F5F9]">Active Dispatches</h3>
          {!loading && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#1E3A5F] text-[#3B82F6]">
              {activeCount} deployed
            </span>
          )}
        </div>
        <span className="text-xs text-[#94A3B8]">{filtered.length} vehicles</span>
      </div>

      {/* Filter bar */}
      {!loading && !error && (
        <div className="px-3 py-2 border-b border-[#334155] flex gap-2 items-center shrink-0 bg-[#0F172A]">
          <span className="text-xs text-[#94A3B8] shrink-0">Status</span>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={selectCls}>
            <option value="ALL">All</option>
            {VEHICLE_STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : error ? (
        <div className="px-4 py-8 text-center">
          <p className="text-sm text-[#F87171]">{error}</p>
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
        <div>
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
    </div>
  );
}
