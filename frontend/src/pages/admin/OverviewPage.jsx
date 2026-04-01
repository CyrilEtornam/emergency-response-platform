import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAnalytics } from '../../hooks/useAnalytics';
import { getIncidentsList } from '../../api/analyticsApi';
import { Card, StatCard } from '../../components/common/Card';
import { Spinner } from '../../components/common/Spinner';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { AGENCY_COLORS } from '../../utils/constants';
import { formatTimeAgo } from '../../utils/formatters';

const AGENCIES = [
  { key: 'MEDICAL', label: 'Hospital Services' },
  { key: 'POLICE', label: 'Police Services' },
  { key: 'FIRE', label: 'Fire Services' },
];

function AgencyCard({ agency, data }) {
  const navigate = useNavigate();
  const style = AGENCY_COLORS[agency.key] || { color: '#a09d96' };

  return (
    <Card className="p-5 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: style.color }} />
        <span className="text-[13px] font-semibold text-primary">{agency.label}</span>
      </div>
      <div className="grid grid-cols-3 gap-3 text-center">
        <div>
          <p className="text-[22px] font-semibold text-primary leading-none">{data?.activeIncidents ?? '—'}</p>
          <p className="text-[11px] text-secondary mt-1">Active</p>
        </div>
        <div>
          <p className="text-[22px] font-semibold text-primary leading-none">
            {data?.vehiclesDeployed ?? '—'}/{data?.totalVehicles ?? '—'}
          </p>
          <p className="text-[11px] text-secondary mt-1">Vehicles</p>
        </div>
        <div>
          <p className="text-[22px] font-semibold text-primary leading-none">
            {data?.avgResponseTimeMinutes != null ? `${Math.round(data.avgResponseTimeMinutes)}m` : '—'}
          </p>
          <p className="text-[11px] text-secondary mt-1">Avg resp.</p>
        </div>
      </div>
      <Button
        variant="secondary"
        size="sm"
        className="w-full"
        onClick={() => navigate('/admin/agencies')}
      >
        View Details
      </Button>
    </Card>
  );
}

function ActivityFeed({ items, loading }) {
  if (loading) return <div className="flex justify-center py-8"><Spinner /></div>;
  if (!items.length) {
    return <p className="text-[13px] text-secondary text-center py-8">No recent activity</p>;
  }
  return (
    <div className="divide-y divide-subtle">
      {items.map((item, i) => (
        <div key={item.id || i} className="flex items-start gap-3 px-5 py-3">
          <div
            className="w-2 h-2 rounded-full mt-2 shrink-0"
            style={{ backgroundColor: AGENCY_COLORS[item.type]?.color || '#a09d96' }}
          />
          <div className="flex-1 min-w-0">
            <p className="text-[13px] text-primary truncate">
              <span className="font-medium">{item.type}</span>
              {item.description && ` — ${item.description.slice(0, 60)}`}
            </p>
            <p className="text-[12px] text-secondary">{formatTimeAgo(item.createdAt || item.reportedAt)}</p>
          </div>
          <Badge variant="status" value={item.status} />
        </div>
      ))}
    </div>
  );
}

export function OverviewPage() {
  const { dashboard, loading } = useAnalytics();
  const [activity, setActivity] = useState([]);
  const [activityLoading, setActivityLoading] = useState(true);

  useEffect(() => {
    let timer;
    const load = async () => {
      try {
        const data = await getIncidentsList({ limit: 10 });
        setActivity(Array.isArray(data) ? data : data?.content ?? []);
      } catch {
        setActivity([]);
      } finally {
        setActivityLoading(false);
      }
    };
    load();
    timer = setInterval(load, 30000);
    return () => clearInterval(timer);
  }, []);

  const statuses = {
    systemOk: !dashboard?.servicesDown || dashboard.servicesDown === 0,
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <h1 className="text-[20px] font-semibold text-primary">System Overview</h1>
      </div>

      {/* Top stats */}
      {loading ? (
        <div className="flex justify-center py-8"><Spinner size="lg" /></div>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          <StatCard
            label="Active Incidents"
            value={dashboard?.totalActiveIncidents ?? '—'}
            sub="All agencies"
          />
          <StatCard
            label="Vehicles Deployed"
            value={dashboard?.vehiclesDeployed ?? '—'}
            sub="Real-time"
          />
          <StatCard
            label="Avg Response Time"
            value={dashboard?.avgResponseTimeMinutes != null ? `${Math.round(dashboard.avgResponseTimeMinutes)} min` : '—'}
            sub="Today"
          />
          <StatCard
            label="System Status"
            value={statuses.systemOk ? 'Operational' : `${dashboard?.servicesDown} services down`}
            sub={statuses.systemOk ? 'All systems normal' : 'Degraded'}
          />
        </div>
      )}

      {/* Agency cards */}
      <div>
        <h2 className="text-[13px] font-semibold text-primary mb-3">Agency Summary</h2>
        <div className="grid grid-cols-3 gap-4">
          {AGENCIES.map((agency) => (
            <AgencyCard
              key={agency.key}
              agency={agency}
              data={dashboard?.agencies?.[agency.key]}
            />
          ))}
        </div>
      </div>

      {/* Activity feed */}
      <Card>
        <div className="flex items-center justify-between px-5 py-4 border-b border-subtle">
          <h2 className="text-[13px] font-semibold text-primary">Recent Activity</h2>
          <span className="text-[12px] text-secondary">Auto-refreshes every 30s</span>
        </div>
        <ActivityFeed items={activity} loading={activityLoading} />
      </Card>
    </div>
  );
}
