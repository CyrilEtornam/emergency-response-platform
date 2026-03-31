import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Spinner } from '../../components/common/Spinner';
import { EmptyState } from '../../components/common/EmptyState';
import { SEVERITY_COLORS, SEVERITY_LEVELS, INCIDENT_STATUSES } from '../../utils/constants';
import { formatTimeAgo, formatDate, getLocationLabel } from '../../utils/formatters';
import { assignVehicle, getSuggestedResponders, assignResponder } from '../../api/incidentApi';
import logger from '../../utils/logger';

// Shared select style to keep filter dropdowns consistent
const selectCls =
  'bg-[#0F172A] border border-[#334155] text-[#F1F5F9] text-xs rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#3B82F6] cursor-pointer';

function IncidentCard({ incident, isSelected, onClick }) {
  const severityStyle = SEVERITY_COLORS[incident.severity] || SEVERITY_COLORS.LOW;
  const location = incident.address || getLocationLabel(incident.latitude, incident.longitude);

  return (
    <div
      onClick={() => onClick(incident)}
      className={clsx(
        'px-4 py-3 cursor-pointer border-b border-[#334155] last:border-0 transition-colors relative',
        'hover:bg-[#263147]',
        isSelected && 'bg-[#1E3A5F]'
      )}
      style={{ borderLeft: `3px solid ${severityStyle.border}` }}
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="agency" value={incident.type} />
          <Badge variant="severity" value={incident.severity} />
        </div>
        <Badge variant="status" value={incident.status} />
      </div>
      <p className="text-sm text-[#F1F5F9] font-medium truncate mb-0.5">{location}</p>
      <p className="text-xs text-[#94A3B8] truncate">{incident.description}</p>
      <p className="text-xs text-[#94A3B8] mt-1">{formatTimeAgo(incident.createdAt || incident.reportedAt)}</p>
    </div>
  );
}

function AssignVehiclePanel({ incident, vehicles, onAssigned, onCancel }) {
  const available = vehicles.filter((v) => v.status === 'AVAILABLE');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);

  async function handleAssign(vehicle) {
    setBusy(true);
    setErr(null);
    try {
      await assignVehicle(incident.id, vehicle.id);
      onAssigned();
    } catch (e) {
      logger.warn('assignVehicle failed', e);
      setErr(e?.message || 'Assignment failed. Please try again.');
      setBusy(false);
    }
  }

  return (
    <div className="mt-3 border border-[#334155] rounded bg-[#0F172A]">
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#334155]">
        <span className="text-xs font-semibold text-[#F1F5F9]">Select Available Vehicle</span>
        <button
          onClick={onCancel}
          className="text-[#94A3B8] hover:text-[#F1F5F9] text-xs"
        >
          Cancel
        </button>
      </div>

      {available.length === 0 ? (
        <p className="px-3 py-3 text-xs text-[#94A3B8]">No available vehicles at this time.</p>
      ) : (
        <div className="divide-y divide-[#1E293B]">
          {available.map((v) => (
            <div key={v.id} className="flex items-center justify-between px-3 py-2">
              <div>
                <p className="text-xs font-medium text-[#F1F5F9]">
                  {v.registrationNumber || v.plateNumber || v.id?.slice(0, 8)}
                </p>
                <p className="text-xs text-[#94A3B8]">{v.driverName || v.driver || 'Unassigned'}</p>
              </div>
              <Button
                size="sm"
                variant="primary"
                disabled={busy}
                onClick={() => handleAssign(v)}
              >
                {busy ? <Spinner size="sm" /> : 'Assign'}
              </Button>
            </div>
          ))}
        </div>
      )}

      {err && (
        <p className="px-3 pb-2 text-xs text-[#F87171]">{err}</p>
      )}
    </div>
  );
}

function IncidentDetail({ incident, vehicles, onViewOnMap, onAssign }) {
  const [showAssign, setShowAssign] = useState(false);
  const [suggested, setSuggested] = useState([]);
  const [loadingSuggested, setLoadingSuggested] = useState(false);
  const location = incident.address || getLocationLabel(incident.latitude, incident.longitude);

  // Fetch suggested responders when incident detail opens
  useEffect(() => {
    if (incident && incident.status !== 'RESOLVED') {
      setLoadingSuggested(true);
      getSuggestedResponders(incident.id)
        .then((data) => {
          setSuggested(data || []);
        })
        .catch((err) => {
          logger.warn('Failed to fetch suggested responders', err);
          setSuggested([]);
        })
        .finally(() => setLoadingSuggested(false));
    }
  }, [incident?.id]);

  async function handleAssignSuggested(responder) {
    try {
      await assignResponder(responder.id, incident.id, true);
      onAssign?.();
    } catch (err) {
      logger.error('Failed to assign suggested responder', err);
    }
  }

  function handleAssigned() {
    setShowAssign(false);
    onAssign?.();
  }

  const topSuggestion = suggested.length > 0 ? suggested[0] : null;

  return (
    <div className="px-4 py-4 bg-[#0F172A] border-t-2 border-[#3B82F6]">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-[#F1F5F9]">Incident Detail</h4>
        <div className="flex items-center gap-2">
          {incident.status !== 'RESOLVED' && (
            <Button
              size="sm"
              variant="primary"
              onClick={() => setShowAssign((v) => !v)}
            >
              {showAssign ? 'Cancel' : 'Assign Vehicle'}
            </Button>
          )}
          <Button size="sm" variant="secondary" onClick={onViewOnMap}>
            View on Map
          </Button>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <Row label="Type"     value={<Badge variant="agency" value={incident.type} />} />
        <Row label="Severity" value={<Badge variant="severity" value={incident.severity} />} />
        <Row label="Status"   value={<Badge variant="status" value={incident.status} />} />
        <Row label="Location" value={location} />
        <Row label="Reported" value={formatDate(incident.createdAt || incident.reportedAt)} />
        {incident.description && (
          <Row label="Description" value={incident.description} />
        )}
        {incident.assignedResponder && (
          <Row label="Responder" value={incident.assignedResponder} />
        )}
        {incident.vehicleId && (
          <Row label="Vehicle" value={incident.vehicleId} />
        )}
      </div>

      {/* Suggested Responder Section */}
      {!showAssign && incident.status !== 'RESOLVED' && !incident.vehicleId && (
        <div className="mt-4 p-3 border border-[#334155] rounded bg-[#1E293B]">
          <p className="text-xs font-medium uppercase tracking-widest text-[#94A3B8] mb-2">
            Nearest Available
          </p>
          {loadingSuggested ? (
            <div className="flex items-center gap-2 text-xs text-[#94A3B8]">
              <Spinner size="sm" />
              <span>Finding nearest responders...</span>
            </div>
          ) : topSuggestion ? (
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-[#F1F5F9]">{topSuggestion.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="agency" value={topSuggestion.type} />
                  <span className="text-xs text-[#94A3B8]">{topSuggestion.distanceKm} km away</span>
                </div>
              </div>
              <Button
                size="sm"
                variant="primary"
                onClick={() => handleAssignSuggested(topSuggestion)}
              >
                Assign
              </Button>
            </div>
          ) : (
            <p className="text-xs text-[#94A3B8]">No available responders nearby</p>
          )}
        </div>
      )}

      {showAssign && (
        <AssignVehiclePanel
          incident={incident}
          vehicles={vehicles}
          onAssigned={handleAssigned}
          onCancel={() => setShowAssign(false)}
        />
      )}

      {incident.timeline && incident.timeline.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-medium uppercase tracking-widest text-[#94A3B8] mb-2">Timeline</p>
          <div className="space-y-1">
            {incident.timeline.map((event, i) => (
              <div key={i} className="flex gap-3 text-xs">
                <span className="text-[#94A3B8] shrink-0">{formatDate(event.timestamp)}</span>
                <span className="text-[#F1F5F9]">{event.description || event.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex gap-2">
      <span className="text-[#94A3B8] shrink-0 w-24">{label}</span>
      <span className="text-[#F1F5F9]">{value}</span>
    </div>
  );
}

export function IncidentsTab({ incidents, loading, error, onRefresh, selectedId, onSelect, vehicles = [] }) {
  const [detailId, setDetailId] = useState(null);
  const [search, setSearch]     = useState('');
  const [severity, setSeverity] = useState('ALL');
  const [status, setStatus]     = useState('ALL');

  const filtered = incidents.filter((inc) => {
    if (severity !== 'ALL' && inc.severity !== severity) return false;
    if (status   !== 'ALL' && inc.status   !== status)   return false;
    if (search) {
      const q = search.toLowerCase();
      const inDescription = inc.description?.toLowerCase().includes(q);
      const inAddress     = inc.address?.toLowerCase().includes(q);
      const inLocation    = getLocationLabel(inc.latitude, inc.longitude)?.toLowerCase().includes(q);
      if (!inDescription && !inAddress && !inLocation) return false;
    }
    return true;
  });

  const detailIncident = filtered.find((i) => i.id === detailId);

  const handleClick = (incident) => {
    setDetailId((prev) => (prev === incident.id ? null : incident.id));
    onSelect?.(incident);
  };

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#334155] shrink-0">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-[#F1F5F9]">Active Incidents</h3>
          {!loading && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#1E293B] text-[#94A3B8]">
              {filtered.length}
            </span>
          )}
        </div>
        <Button size="sm" variant="secondary" onClick={onRefresh} disabled={loading}>
          {loading ? <Spinner size="sm" /> : 'Refresh'}
        </Button>
      </div>

      {/* Filter bar */}
      {!loading && !error && (
        <div className="px-3 py-2 border-b border-[#334155] flex gap-2 flex-wrap items-center shrink-0 bg-[#0F172A]">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search description or location…"
            className="flex-1 min-w-0 bg-[#1E293B] border border-[#334155] text-[#F1F5F9] text-xs rounded px-2 py-1.5 placeholder:text-[#475569] focus:outline-none focus:ring-1 focus:ring-[#3B82F6]"
          />
          <select value={severity} onChange={(e) => setSeverity(e.target.value)} className={selectCls}>
            <option value="ALL">All Severities</option>
            {SEVERITY_LEVELS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className={selectCls}>
            <option value="ALL">All Statuses</option>
            {INCIDENT_STATUSES.map((s) => (
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
          <p className="text-sm text-[#F87171] mb-3">{error}</p>
          <Button size="sm" variant="secondary" onClick={onRefresh}>Retry</Button>
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title={incidents.length === 0 ? 'No active incidents' : 'No matches'}
          description={
            incidents.length === 0
              ? 'New incidents will appear here automatically.'
              : 'Try adjusting your filters.'
          }
        />
      ) : (
        <div>
          {filtered.map((inc) => (
            <React.Fragment key={inc.id}>
              <IncidentCard
                incident={inc}
                isSelected={inc.id === selectedId || inc.id === detailId}
                onClick={handleClick}
              />
              {detailIncident && detailIncident.id === inc.id && (
                <IncidentDetail
                  incident={detailIncident}
                  vehicles={vehicles}
                  onViewOnMap={() => onSelect?.(detailIncident)}
                  onAssign={onRefresh}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}
