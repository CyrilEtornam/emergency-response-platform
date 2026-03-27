import React, { useState } from 'react';
import clsx from 'clsx';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Spinner } from '../../components/common/Spinner';
import { EmptyState } from '../../components/common/EmptyState';
import { SEVERITY_COLORS } from '../../utils/constants';
import { formatTimeAgo, formatDate } from '../../utils/formatters';

function IncidentCard({ incident, isSelected, onClick }) {
  const severityStyle = SEVERITY_COLORS[incident.severity] || SEVERITY_COLORS.LOW;

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
      <p className="text-sm text-[#F1F5F9] font-medium truncate mb-0.5">
        {incident.address || `${incident.latitude?.toFixed(4)}, ${incident.longitude?.toFixed(4)}`}
      </p>
      <p className="text-xs text-[#94A3B8] truncate">{incident.description}</p>
      <p className="text-xs text-[#94A3B8] mt-1">{formatTimeAgo(incident.createdAt || incident.reportedAt)}</p>
    </div>
  );
}

function IncidentDetail({ incident, onViewOnMap }) {
  return (
    <div className="px-4 py-4 bg-[#0F172A] border-t-2 border-[#3B82F6]">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-[#F1F5F9]">Incident Detail</h4>
        <Button size="sm" variant="secondary" onClick={onViewOnMap}>
          View on Map
        </Button>
      </div>

      <div className="space-y-2 text-sm">
        <Row label="Type" value={<Badge variant="agency" value={incident.type} />} />
        <Row label="Severity" value={<Badge variant="severity" value={incident.severity} />} />
        <Row label="Status" value={<Badge variant="status" value={incident.status} />} />
        <Row label="Location" value={incident.address || `${incident.latitude}, ${incident.longitude}`} />
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

export function IncidentsTab({ incidents, loading, error, onRefresh, selectedId, onSelect }) {
  const [detailId, setDetailId] = useState(null);
  const detailIncident = incidents.find((i) => i.id === detailId);

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
              {incidents.length}
            </span>
          )}
        </div>
        <Button size="sm" variant="secondary" onClick={onRefresh} disabled={loading}>
          {loading ? <Spinner size="sm" /> : 'Refresh'}
        </Button>
      </div>

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
      ) : incidents.length === 0 ? (
        <EmptyState
          title="No active incidents"
          description="New incidents will appear here automatically."
        />
      ) : (
        <>
          <div>
            {incidents.map((inc) => (
              <React.Fragment key={inc.id}>
                <IncidentCard
                  incident={inc}
                  isSelected={inc.id === selectedId || inc.id === detailId}
                  onClick={handleClick}
                />
                {detailIncident && detailIncident.id === inc.id && (
                  <IncidentDetail
                    incident={detailIncident}
                    onViewOnMap={() => onSelect?.(detailIncident)}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
