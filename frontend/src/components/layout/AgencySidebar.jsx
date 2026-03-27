import React from 'react';
import clsx from 'clsx';
import { AGENCY_COLORS, ROLE_TO_AGENCY } from '../../utils/constants';
import { useAuth } from '../../context/AuthContext';
import { IncidentsTab } from '../../pages/agency/IncidentsTab';
import { DispatchTab } from '../../pages/agency/DispatchTab';
import { ReportTab } from '../../pages/agency/ReportTab';
import { AnalyticsTab } from '../../pages/agency/AnalyticsTab';

const TABS = [
  { key: 'incidents', label: 'Incidents' },
  { key: 'dispatch', label: 'Dispatch' },
  { key: 'report', label: 'Report' },
  { key: 'analytics', label: 'Analytics' },
];

export function AgencySidebar({
  activeTab,
  onTabChange,
  incidents,
  incidentsLoading,
  incidentsError,
  onRefreshIncidents,
  vehicles,
  vehiclesLoading,
  vehiclesError,
  selectedIncidentId,
  onIncidentSelect,
  selectedVehicleId,
  onVehicleSelect,
  onReportPin,
  reportPin,
}) {
  const { user } = useAuth();
  const agencyType = ROLE_TO_AGENCY[user?.role];
  const agencyStyle = AGENCY_COLORS[agencyType] || { color: '#1D4ED8' };

  return (
    <div className="flex flex-col h-full bg-[#1E293B] border-l border-[#334155]">
      {/* Tab bar */}
      <div className="flex border-b border-[#334155] shrink-0">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={clsx(
              'flex-1 py-3 text-sm font-medium transition-colors relative',
              activeTab === tab.key
                ? 'text-[#3B82F6]'
                : 'text-[#94A3B8] hover:text-[#F1F5F9]'
            )}
          >
            {tab.label}
            {activeTab === tab.key && (
              <span
                className="absolute bottom-0 left-0 right-0 h-0.5"
                style={{ backgroundColor: agencyStyle.color }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {activeTab === 'incidents' && (
          <IncidentsTab
            incidents={incidents}
            loading={incidentsLoading}
            error={incidentsError}
            onRefresh={onRefreshIncidents}
            selectedId={selectedIncidentId}
            onSelect={onIncidentSelect}
          />
        )}
        {activeTab === 'dispatch' && (
          <DispatchTab
            vehicles={vehicles}
            loading={vehiclesLoading}
            error={vehiclesError}
            selectedId={selectedVehicleId}
            onSelect={onVehicleSelect}
          />
        )}
        {activeTab === 'report' && (
          <ReportTab
            pin={reportPin}
            onPinClear={() => onReportPin(null)}
            onSuccess={() => {
              onTabChange('incidents');
              onRefreshIncidents();
            }}
          />
        )}
        {activeTab === 'analytics' && <AnalyticsTab />}
      </div>
    </div>
  );
}
