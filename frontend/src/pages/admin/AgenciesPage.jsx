import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAnalytics } from '../../hooks/useAnalytics';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Spinner } from '../../components/common/Spinner';
import { IncidentBarChart } from '../../components/charts/IncidentBarChart';
import { SparkLine } from '../../components/charts/SparkLine';
import { AGENCY_COLORS } from '../../utils/constants';

const AGENCIES = [
  { key: 'MEDICAL', label: 'Hospital Services', vehicleType: 'Ambulances' },
  { key: 'POLICE', label: 'Police Services', vehicleType: 'Police Cars' },
  { key: 'FIRE', label: 'Fire Services', vehicleType: 'Fire Trucks' },
];

function VehicleBar({ label, value, total, color }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div>
      <div className="flex items-center justify-between text-[12px] mb-1">
        <span className="text-secondary">{label}</span>
        <span className="text-primary font-medium">{value}/{total}</span>
      </div>
      <div className="h-2 bg-subtle rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

function AgencyExpandCard({ agency, data, responseTimeTrend }) {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const style = AGENCY_COLORS[agency.key] || { color: '#a09d96' };

  const severityData = data?.incidentsBySeverity || [];
  const barData = severityData.map((s) => ({ label: s.severity || s.label, count: s.count || s.value || 0 }));

  const sparkData = (responseTimeTrend || []).map((d) => ({
    date: d.date,
    value: d.avgMinutes || d.value || 0,
  }));

  return (
    <Card className="overflow-hidden">
      {/* Header row — always visible */}
      <div
        className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-elevated transition-colors"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: style.color }} />
          <div>
            <p className="text-[13px] font-semibold text-primary">{agency.label}</p>
            <p className="text-[12px] text-secondary">{agency.vehicleType}</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className="text-[20px] font-semibold text-primary leading-none">{data?.activeIncidents ?? '—'}</p>
            <p className="text-[11px] text-secondary mt-1">Active</p>
          </div>
          <div className="text-center">
            <p className="text-[20px] font-semibold text-primary leading-none">
              {data?.avgResponseTime != null ? `${Math.round(data.avgResponseTime)}m` : '—'}
            </p>
            <p className="text-[11px] text-secondary mt-1">Avg resp.</p>
          </div>
          <svg
            className={`w-4 h-4 text-secondary transition-transform ${expanded ? 'rotate-180' : ''}`}
            viewBox="0 0 20 20" fill="currentColor"
          >
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
          </svg>
        </div>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="border-t border-subtle px-5 py-5 grid grid-cols-3 gap-6">
          {/* Severity breakdown */}
          <div>
            <p className="text-[11px] font-medium uppercase tracking-widest text-secondary mb-3">
              Incidents by Severity
            </p>
            <IncidentBarChart
              data={barData}
              mode="severity"
              color={style.color}
              height={120}
            />
          </div>

          {/* Vehicle status */}
          <div>
            <p className="text-[11px] font-medium uppercase tracking-widest text-secondary mb-3">
              Vehicle Status
            </p>
            <div className="space-y-3">
              <VehicleBar label="Available" value={data?.vehiclesAvailable ?? 0} total={data?.totalVehicles ?? 0} color="#4caf6e" />
              <VehicleBar label="Deployed" value={data?.vehiclesDeployed ?? 0} total={data?.totalVehicles ?? 0} color={style.color} />
              <VehicleBar label="Maintenance" value={data?.vehiclesMaintenance ?? 0} total={data?.totalVehicles ?? 0} color="#e8a82a" />
            </div>
          </div>

          {/* Response time sparkline */}
          <div>
            <p className="text-[11px] font-medium uppercase tracking-widest text-secondary mb-3">
              Response Time (7 days)
            </p>
            <SparkLine data={sparkData} dataKey="value" color={style.color} height={80} />
            <Button
              variant="secondary"
              size="sm"
              className="w-full mt-3"
              onClick={() => navigate('/admin/map')}
            >
              View on Map
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}

export function AgenciesPage() {
  const { dashboard, responseTimeTrend, loading } = useAnalytics();

  return (
    <div className="p-6">
      <h1 className="text-[20px] font-semibold text-primary mb-5">Agency Overview</h1>

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : (
        <div className="space-y-4">
          {AGENCIES.map((agency) => (
            <AgencyExpandCard
              key={agency.key}
              agency={agency}
              data={dashboard?.agencies?.[agency.key]}
              responseTimeTrend={responseTimeTrend}
            />
          ))}
        </div>
      )}
    </div>
  );
}
