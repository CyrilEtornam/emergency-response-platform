import React, { useState, useCallback } from 'react';
import { MapPanel } from '../../components/map/MapPanel';
import { useIncidents } from '../../hooks/useIncidents';
import { useVehicles } from '../../hooks/useVehicles';
import { useWebSocket } from '../../hooks/useWebSocket';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { WS_BASE_URL, AGENCY_COLORS } from '../../utils/constants';
import { formatTimeAgo } from '../../utils/formatters';

const AGENCY_FILTERS_DEFAULT = { MEDICAL: true, POLICE: true, FIRE: true };

function FilterPanel({ agencyFilters, onAgencyToggle, showIncidents, showVehicles, onToggleIncidents, onToggleVehicles, incidentCount }) {
  return (
    <div className="absolute top-3 right-3 z-10 w-56">
      <Card className="p-4">
        <p className="text-[11px] font-medium uppercase tracking-widest text-secondary mb-3">Agency Filters</p>
        <div className="space-y-2 mb-4">
          {Object.entries(AGENCY_COLORS).filter(([k]) => ['MEDICAL', 'POLICE', 'FIRE'].includes(k)).map(([key, style]) => (
            <label key={key} className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={agencyFilters[key] !== false}
                onChange={() => onAgencyToggle(key)}
                className="rounded border-subtle"
              />
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: style.color }} />
              <span className="text-[13px] text-primary">{style.label}</span>
            </label>
          ))}
        </div>

        <p className="text-[11px] font-medium uppercase tracking-widest text-secondary mb-2">Show</p>
        <div className="space-y-2 mb-3">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input type="checkbox" checked={showIncidents} onChange={onToggleIncidents} className="rounded border-subtle" />
            <span className="text-[13px] text-primary">Incidents</span>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input type="checkbox" checked={showVehicles} onChange={onToggleVehicles} className="rounded border-subtle" />
            <span className="text-[13px] text-primary">Vehicles</span>
          </label>
        </div>

        <div className="pt-3 border-t border-subtle flex items-center justify-between">
          <span className="text-[12px] text-secondary">Live incidents</span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-elevated text-secondary">
            {incidentCount}
          </span>
        </div>
      </Card>
    </div>
  );
}

function IncidentInfoPanel({ incident, onClose }) {
  if (!incident) return null;
  return (
    <div className="absolute bottom-6 left-3 z-10 w-64">
      <Card className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <Badge variant="agency" value={incident.type} />
            <Badge variant="severity" value={incident.severity} />
          </div>
          <button onClick={onClose} className="text-secondary hover:text-primary transition-colors">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M10.5 3.5L3.5 10.5M3.5 3.5l7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        <p className="text-[13px] text-primary mb-1">{incident.description?.slice(0, 80)}</p>
        {incident.address && <p className="text-[12px] text-secondary mb-2">{incident.address}</p>}
        <div className="flex items-center justify-between">
          <span className="text-[12px] text-secondary">{formatTimeAgo(incident.createdAt)}</span>
          <Badge variant="status" value={incident.status} />
        </div>
      </Card>
    </div>
  );
}

export function MapPage() {
  const [agencyFilters, setAgencyFilters] = useState(AGENCY_FILTERS_DEFAULT);
  const [showIncidents, setShowIncidents] = useState(true);
  const [showVehicles, setShowVehicles] = useState(true);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const { incidents } = useIncidents();
  const { vehicles, updateVehicle } = useVehicles();

  const handleWsMessage = useCallback((data) => {
    if (!data?.eventType) return;
    if (data.eventType === 'location.updated') {
      updateVehicle({
        vehicleId: data.vehicleId,
        location: data.location,
        status: data.status,
        callSign: data.callSign,
        vehicleType: data.vehicleType,
      });
    } else if (data.eventType === 'dispatch.assigned') {
      updateVehicle({
        vehicleId: data.vehicleId,
        status: data.status || 'EN_ROUTE',
        incidentId: data.incidentId,
      });
    }
  }, [updateVehicle]);
  useWebSocket(`${WS_BASE_URL}/ws/vehicles/track`, handleWsMessage, true);

  function toggleAgency(key) {
    setAgencyFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <div className="relative h-full w-full">
      <MapPanel
        activeTab="admin-map"
        incidents={incidents}
        vehicles={vehicles}
        selectedIncidentId={selectedIncident?.id}
        selectedVehicleId={selectedVehicle?.id}
        onIncidentClick={setSelectedIncident}
        onVehicleClick={setSelectedVehicle}
        agencyFilters={agencyFilters}
        showIncidents={showIncidents}
        showVehicles={showVehicles}
      />
      <FilterPanel
        agencyFilters={agencyFilters}
        onAgencyToggle={toggleAgency}
        showIncidents={showIncidents}
        showVehicles={showVehicles}
        onToggleIncidents={() => setShowIncidents((v) => !v)}
        onToggleVehicles={() => setShowVehicles((v) => !v)}
        incidentCount={incidents.length}
      />
      <IncidentInfoPanel incident={selectedIncident} onClose={() => setSelectedIncident(null)} />
    </div>
  );
}
