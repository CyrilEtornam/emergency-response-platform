import React from 'react';
import clsx from 'clsx';
import { ROLE_TO_AGENCY } from '../../utils/constants';
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

  return (
    <div className="bg-surface border-l border-subtle h-full flex flex-col">
      {/* Tab bar */}
      <div className="bg-elevated border-b border-subtle flex shrink-0">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={clsx(
              'flex-1 px-4 py-3 text-[13px] transition-colors relative',
              activeTab === tab.key
                ? 'text-accent border-b-2 border-accent font-medium'
                : 'text-secondary hover:text-primary'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'incidents' && (
          <IncidentsTab
            incidents={incidents}
            loading={incidentsLoading}
            error={incidentsError}
            onRefresh={onRefreshIncidents}
            selectedId={selectedIncidentId}
            onSelect={onIncidentSelect}
            vehicles={vehicles}
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
        {activeTab === 'analytics' && <AnalyticsTab agencyType={agencyType} />}
      </div>
    </div>
  );
}
