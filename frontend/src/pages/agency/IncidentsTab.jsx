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
  'bg-input border border-subtle text-primary text-[12px] rounded-[4px] px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-accent cursor-pointer appearance-none';

function IncidentCard({ incident, isSelected, onClick }) {
  const severityStyle = SEVERITY_COLORS[incident.severity] || SEVERITY_COLORS.LOW;
  const location = incident.address || getLocationLabel(incident.latitude, incident.longitude);

  return (
    <div
      onClick={() => onClick(incident)}
      className={clsx(
        'px-4 py-3 cursor-pointer border-b border-subtle last:border-0 transition-colors relative',
        'hover:bg-elevated',
        isSelected && 'bg-accent/10'
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
      <p className="text-[14px] text-primary font-medium truncate mb-0.5">{location}</p>
      <p className="text-[13px] text-secondary truncate">{incident.description}</p>
      <p className="text-[13px] text-secondary mt-1">{formatTimeAgo(incident.createdAt || incident.reportedAt)}</p>
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
    <div className="mt-3 border border-subtle rounded-[4px] bg-input">
      <div className="flex items-center justify-between px-3 py-2 border-b border-subtle">
        <span className="text-[12px] font-semibold text-primary">Select Available Vehicle</span>
        <button
          onClick={onCancel}
          className="text-secondary hover:text-primary text-[12px] transition-colors"
        >
          Cancel
        </button>
      </div>

      {available.length === 0 ? (
        <p className="px-3 py-3 text-[13px] text-secondary">No available vehicles at this time.</p>
      ) : (
        <div className="divide-y divide-subtle">
          {available.map((v) => (
            <div key={v.id} className="flex items-center justify-between px-3 py-2">
              <div>
                <p className="text-[13px] font-medium text-primary">
                  {v.registrationNumber || v.plateNumber || v.id?.slice(0, 8)}
                </p>
                <p className="text-[12px] text-secondary">{v.driverName || v.driver || 'Unassigned'}</p>
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
        <p className="px-3 pb-2 text-[13px] text-danger">{err}</p>
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
  }, [incident]);

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
    <div className="px-4 py-4 bg-input border-t-2 border-accent">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-[14px] font-semibold text-primary">Incident Detail</h4>
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

      <div className="space-y-2">
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
        <div className="mt-4 p-3 border border-subtle rounded-[4px] bg-surface">
          <p className="text-[11px] font-medium uppercase tracking-widest text-secondary mb-2">
            Nearest Available
          </p>
          {loadingSuggested ? (
            <div className="flex items-center gap-2 text-[13px] text-secondary">
              <Spinner size="sm" />
              <span>Finding nearest responders...</span>
            </div>
          ) : topSuggestion ? (
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-[14px] font-medium text-primary">{topSuggestion.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="agency" value={topSuggestion.type} />
                  <span className="text-[13px] text-secondary">{topSuggestion.distanceKm} km away</span>
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
            <p className="text-[13px] text-secondary">No available responders nearby</p>
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
          <p className="text-[11px] font-medium uppercase tracking-widest text-secondary mb-2">Timeline</p>
          <div className="space-y-1">
            {incident.timeline.map((event, i) => (
              <div key={i} className="flex gap-3 text-[13px]">
                <span className="text-secondary shrink-0">{formatDate(event.timestamp)}</span>
                <span className="text-primary">{event.description || event.status}</span>
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
      <span className="text-[13px] text-secondary shrink-0 w-24">{label}</span>
      <span className="text-[14px] text-primary">{value}</span>
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
      <div className="flex items-center justify-between px-4 py-3 border-b border-subtle shrink-0">
        <div className="flex items-center gap-2">
          <h3 className="text-[14px] font-semibold text-primary">Active Incidents</h3>
          {!loading && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-elevated text-secondary">
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
        <div className="px-3 py-2 border-b border-subtle flex gap-2 flex-wrap items-center shrink-0 bg-input">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search description or location…"
            className="flex-1 min-w-0 bg-surface border border-subtle text-primary text-[12px] rounded-[4px] px-2 py-1.5 placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-accent"
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
          <p className="text-[13px] text-danger mb-3">{error}</p>
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
