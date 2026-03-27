import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAnalytics } from '../../hooks/useAnalytics';
import { ROLE_TO_AGENCY, AGENCY_COLORS } from '../../utils/constants';
import { Spinner } from '../../components/common/Spinner';
import { Card } from '../../components/common/Card';
import { IncidentBarChart } from '../../components/charts/IncidentBarChart';
import { ResponseTimeChart } from '../../components/charts/ResponseTimeChart';
import { AgencyPieChart } from '../../components/charts/AgencyPieChart';

function StatCard({ label, value, sub }) {
  return (
    <Card className="p-4">
      <p className="text-xs font-medium uppercase tracking-widest text-[#94A3B8] mb-1">{label}</p>
      <p className="text-xl font-semibold text-[#F1F5F9]">{value ?? '—'}</p>
      {sub && <p className="text-xs text-[#94A3B8] mt-0.5">{sub}</p>}
    </Card>
  );
}

export function AnalyticsTab() {
  const { user } = useAuth();
  const agencyType = ROLE_TO_AGENCY[user?.role];
  const agencyStyle = AGENCY_COLORS[agencyType] || { color: '#1D4ED8' };

  const {
    dashboard,
    incidentsByType,
    responseTimeTrend,
    statusBreakdown,
    loading,
  } = useAnalytics({ agencyType });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  const pieData = statusBreakdown.map((s) => ({
    name: s.status || s.label || s.name,
    value: s.count || s.value || 0,
  }));

  const barData = incidentsByType.map((d) => ({
    label: d.severity || d.label || d.date,
    count: d.count || d.value || 0,
  }));

  const lineData = responseTimeTrend.map((d) => ({
    date: d.date || d.label,
    avgMinutes: d.avgMinutes || d.value || 0,
  }));

  return (
    <div className="px-4 py-4 space-y-5">
      <h3 className="text-sm font-semibold text-[#F1F5F9]">Performance Overview</h3>

      {/* Stat cards 2x2 */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          label="Incidents Today"
          value={dashboard?.totalIncidentsToday ?? '—'}
        />
        <StatCard
          label="Avg Response Time"
          value={dashboard?.avgResponseTime != null ? `${Math.round(dashboard.avgResponseTime)} min` : '—'}
        />
        <StatCard
          label="Vehicles Deployed"
          value={dashboard?.vehiclesDeployed ?? '—'}
        />
        <StatCard
          label="Resolved Today"
          value={dashboard?.resolvedToday ?? '—'}
        />
      </div>

      {/* Bar chart */}
      <div>
        <p className="text-xs font-medium uppercase tracking-widest text-[#94A3B8] mb-2">
          Incidents by Severity (Last 7 days)
        </p>
        <IncidentBarChart
          data={barData}
          mode="severity"
          color={agencyStyle.color}
          height={180}
        />
      </div>

      {/* Line chart */}
      <div>
        <p className="text-xs font-medium uppercase tracking-widest text-[#94A3B8] mb-2">
          Response Time Trend (Last 14 days)
        </p>
        <ResponseTimeChart
          data={lineData}
          color={agencyStyle.color}
          height={180}
        />
      </div>

      {/* Donut */}
      <div>
        <p className="text-xs font-medium uppercase tracking-widest text-[#94A3B8] mb-2">
          Incident Status Breakdown
        </p>
        <AgencyPieChart
          data={pieData}
          colors={['#1D4ED8', '#D97706', '#EA580C', '#16A34A']}
          height={200}
        />
      </div>
    </div>
  );
}
