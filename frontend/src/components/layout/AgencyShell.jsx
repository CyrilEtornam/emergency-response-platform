import React, { useState, useCallback } from 'react';
import { Navbar } from './Navbar';
import { AgencySidebar } from './AgencySidebar';
import { MapPanel } from '../map/MapPanel';
import { useAuth } from '../../context/AuthContext';
import { useIncidents } from '../../hooks/useIncidents';
import { useVehicles } from '../../hooks/useVehicles';
import { useWebSocket } from '../../hooks/useWebSocket';
import { ROLE_TO_AGENCY, WS_BASE_URL } from '../../utils/constants';


export function AgencyShell() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('incidents');
  const [selectedIncidentId, setSelectedIncidentId] = useState(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState(null);
  const [reportPin, setReportPin] = useState(null);
  const [wsLost, setWsLost] = useState(false);

  const agencyType = ROLE_TO_AGENCY[user?.role];

  const { incidents, loading: incidentsLoading, error: incidentsError, refetch: refetchIncidents } =
    useIncidents(agencyType ? { type: agencyType } : {});

  const { vehicles, loading: vehiclesLoading, error: vehiclesError, updateVehicle } =
    useVehicles(agencyType ? { agency: agencyType } : {});

  // WebSocket for live vehicle positions
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

  const { isMaxRetriesReached } = useWebSocket(
    `${WS_BASE_URL}/ws/vehicles/track`,
    handleWsMessage,
    true
  );

  React.useEffect(() => {
    setWsLost(isMaxRetriesReached);
  }, [isMaxRetriesReached]);

  const handleMapClick = useCallback((latLng) => {
    if (activeTab === 'report') {
      setReportPin(latLng);
    }
  }, [activeTab]);

  const handleIncidentSelect = useCallback((incident) => {
    setSelectedIncidentId(incident?.id || null);
  }, []);

  const handleVehicleSelect = useCallback((vehicle) => {
    setSelectedVehicleId(vehicle?.id || null);
  }, []);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-base">
      <Navbar />

      {wsLost && (
        <div className="bg-surface border-b border-subtle px-5 py-2 text-[13px] text-secondary font-medium shrink-0 flex items-center gap-2">
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
          </svg>
          Connection lost — live vehicle tracking unavailable. Please refresh the page.
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Map — 65% width, never unmounts */}
        <div className="flex-[65] min-w-0 h-full">
          <MapPanel
            activeTab={activeTab}
            incidents={incidents}
            vehicles={vehicles}
            selectedIncidentId={selectedIncidentId}
            selectedVehicleId={selectedVehicleId}
            onIncidentClick={handleIncidentSelect}
            onVehicleClick={handleVehicleSelect}
            onMapClick={handleMapClick}
            reportPin={reportPin}
          />
        </div>

        {/* Sidebar — 35% width */}
        <div className="flex-[35] min-w-0 h-full overflow-hidden">
          <AgencySidebar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            incidents={incidents}
            incidentsLoading={incidentsLoading}
            incidentsError={incidentsError}
            onRefreshIncidents={refetchIncidents}
            vehicles={vehicles}
            vehiclesLoading={vehiclesLoading}
            vehiclesError={vehiclesError}
            selectedIncidentId={selectedIncidentId}
            onIncidentSelect={handleIncidentSelect}
            selectedVehicleId={selectedVehicleId}
            onVehicleSelect={handleVehicleSelect}
            onReportPin={setReportPin}
            reportPin={reportPin}
          />
        </div>
      </div>
    </div>
  );
}
