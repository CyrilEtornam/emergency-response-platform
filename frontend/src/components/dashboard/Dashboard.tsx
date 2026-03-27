import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { incidentService, Incident } from '../../services/incidentService';
import { userService } from '../../services/userService';
import './Dashboard.css';

interface DashboardStats {
  totalIncidents: number;
  activeIncidents: number;
  resolvedIncidents: number;
  totalUsers: number;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalIncidents: 0,
    activeIncidents: 0,
    resolvedIncidents: 0,
    totalUsers: 0
  });
  const [recentIncidents, setRecentIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [incidents, users] = await Promise.all([
          incidentService.getAllIncidents(),
          userService.getAllUsers()
        ]);

        const activeIncidents = incidents.filter(i => i.status === 'ACTIVE').length;
        const resolvedIncidents = incidents.filter(i => i.status === 'RESOLVED').length;

        setStats({
          totalIncidents: incidents.length,
          activeIncidents,
          resolvedIncidents,
          totalUsers: users.length
        });

        const sorted = [...incidents].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setRecentIncidents(sorted.slice(0, 5));
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
        setStats({ totalIncidents: 0, activeIncidents: 0, resolvedIncidents: 0, totalUsers: 0 });
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <h1>Emergency Response Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Incidents</h3>
          <div className="stat-number">{stats.totalIncidents}</div>
        </div>

        <div className="stat-card active">
          <h3>Active Incidents</h3>
          <div className="stat-number">{stats.activeIncidents}</div>
        </div>

        <div className="stat-card resolved">
          <h3>Resolved Incidents</h3>
          <div className="stat-number">{stats.resolvedIncidents}</div>
        </div>

        <div className="stat-card">
          <h3>Total Users</h3>
          <div className="stat-number">{stats.totalUsers}</div>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="recent-incidents">
          <h2>Recent Incidents</h2>
          {recentIncidents.length === 0 ? (
            <p>No recent incidents.</p>
          ) : (
            <ul className="recent-incident-list">
              {recentIncidents.map(incident => (
                <li
                  key={incident.id}
                  className="recent-incident-item"
                  onClick={() => navigate(`/incidents/${incident.id}`)}
                >
                  <span className="incident-title">{incident.title}</span>
                  <span className={`status-badge status-${incident.status.toLowerCase()}`}>
                    {incident.status}
                  </span>
                  <span className="incident-time">
                    {new Date(incident.createdAt).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <button className="action-btn primary" onClick={() => navigate('/incidents')}>
              Report New Incident
            </button>
            <button className="action-btn secondary" onClick={() => navigate('/incidents')}>
              View All Incidents
            </button>
            <button className="action-btn secondary" onClick={() => navigate('/users')}>
              Manage Users
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;