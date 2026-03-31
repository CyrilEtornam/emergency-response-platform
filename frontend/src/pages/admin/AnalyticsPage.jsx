import React, { useState } from 'react';
import { useAnalytics } from '../../hooks/useAnalytics';
import { Spinner } from '../../components/common/Spinner';
import { Card } from '../../components/common/Card';
import { IncidentBarChart } from '../../components/charts/IncidentBarChart';
import { ResponseTimeChart } from '../../components/charts/ResponseTimeChart';
import { AgencyPieChart } from '../../components/charts/AgencyPieChart';

const DATE_RANGES = [
  { label: 'Last 7 days', value: '7d' },
  { label: 'Last 14 days', value: '14d' },
  { label: 'Last 30 days', value: '30d' },
];

const AGENCY_LINES = [
  { key: 'medical', name: 'Hospital', color: '#4a9ee8' },
  { key: 'police', name: 'Police', color: '#e8a82a' },
  { key: 'fire', name: 'Fire', color: '#e84242' },
];

const AGENCY_BARS = [
  { key: 'medical', name: 'Hospital', color: '#4a9ee8' },
  { key: 'police', name: 'Police', color: '#e8a82a' },
  { key: 'fire', name: 'Fire', color: '#e84242' },
];

function SummaryCard({ label, value }) {
  return (
    <Card className="p-4 text-center">
      <p className="text-[11px] font-medium uppercase tracking-widest text-secondary mb-1">{label}</p>
      <p className="text-[28px] font-semibold text-primary leading-none">{value ?? '—'}</p>
    </Card>
  );
}

function ChartCard({ title, children }) {
  return (
    <Card>
      <div className="px-5 py-4 border-b border-subtle">
        <p className="text-[13px] font-semibold text-primary">{title}</p>
      </div>
      <div className="px-5 py-4">{children}</div>
    </Card>
  );
}

export function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('7d');

  const {
    dashboard,
    incidentsByType,
    responseTimeTrend,
    crossAgency,
    loading,
  } = useAnalytics({ dateRange });

  const groupedBarData = (crossAgency?.daily || incidentsByType || []).map((d) => ({
    label: d.date || d.label,
    medical: d.medical || d.MEDICAL || 0,
    police: d.police || d.POLICE || 0,
    fire: d.fire || d.FIRE || 0,
  }));

  const lineData = responseTimeTrend.map((d) => ({
    date: d.date || d.label,
    medical: d.medical || d.MEDICAL || d.avgMinutes || 0,
    police: d.police || d.POLICE || 0,
    fire: d.fire || d.FIRE || 0,
  }));

  const regionData = (crossAgency?.byRegion || []).map((r) => ({
    label: r.region || r.label,
    count: r.count || r.value || 0,
  }));

  const cumulativeData = (crossAgency?.cumulative || []).map((d) => ({
    date: d.date || d.label,
    value: d.count || d.value || 0,
  }));

  const agencyTypePie = [
    { name: 'Medical', value: crossAgency?.totalMedical || 0 },
    { name: 'Police', value: crossAgency?.totalPolice || 0 },
    { name: 'Fire', value: crossAgency?.totalFire || 0 },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header + date range */}
      <div className="flex items-center justify-between">
        <h1 className="text-[20px] font-semibold text-primary">Analytics</h1>
        <div className="flex gap-1 border border-subtle rounded-[4px] p-0.5 bg-input">
          {DATE_RANGES.map((r) => (
            <button
              key={r.value}
              onClick={() => setDateRange(r.value)}
              className={`px-3 py-1.5 text-[12px] font-medium rounded-[4px] transition-colors ${
                dateRange === r.value
                  ? 'bg-surface text-primary'
                  : 'text-secondary hover:text-primary'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-4 gap-4">
            <SummaryCard label="Total Incidents" value={dashboard?.totalActiveIncidents} />
            <SummaryCard
              label="Avg Response Time"
              value={dashboard?.avgResponseTime != null ? `${Math.round(dashboard.avgResponseTime)} min` : null}
            />
            <SummaryCard
              label="Fastest Response"
              value={crossAgency?.fastestResponse != null ? `${Math.round(crossAgency.fastestResponse)} min` : null}
            />
            <SummaryCard
              label="Worst Response"
              value={crossAgency?.worstResponse != null ? `${Math.round(crossAgency.worstResponse)} min` : null}
            />
          </div>

          {/* Charts grid */}
          <div className="grid grid-cols-2 gap-5">
            <ChartCard title="Incidents per Agency per Day">
              <IncidentBarChart
                data={groupedBarData}
                mode="agency"
                bars={AGENCY_BARS}
                nameKey="label"
                height={220}
              />
            </ChartCard>

            <ChartCard title="Response Time Trend per Agency">
              <ResponseTimeChart
                data={lineData}
                mode="multi"
                lines={AGENCY_LINES}
                nameKey="date"
                height={220}
              />
            </ChartCard>

            <ChartCard title="Total Incidents by Region">
              <IncidentBarChart
                data={regionData}
                dataKey="count"
                nameKey="label"
                color="#e8622a"
                height={220}
              />
            </ChartCard>

            <ChartCard title="Incident Type Breakdown">
              <AgencyPieChart
                data={agencyTypePie}
                colors={['#4a9ee8', '#e8a82a', '#e84242']}
                height={220}
              />
            </ChartCard>

            <div className="col-span-2">
              <ChartCard title="Cumulative Incidents">
                <ResponseTimeChart
                  data={cumulativeData}
                  mode="area"
                  dataKey="value"
                  nameKey="date"
                  color="#e8622a"
                  height={200}
                />
              </ChartCard>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
