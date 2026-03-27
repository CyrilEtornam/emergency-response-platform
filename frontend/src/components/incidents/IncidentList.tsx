import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { incidentService, Incident, CreateIncidentRequest } from '../../services/incidentService';
import './IncidentList.css';

const IncidentList: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<string>('ALL');
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const [createForm, setCreateForm] = useState<CreateIncidentRequest>({
    title: '',
    description: '',
    priority: 'MEDIUM',
    location: ''
  });
  const [createError, setCreateError] = useState<string>('');
  const [creating, setCreating] = useState<boolean>(false);

  useEffect(() => {
    loadIncidents();
  }, []);

  const loadIncidents = async () => {
    try {
      const data = await incidentService.getAllIncidents();
      setIncidents(data);
    } catch (error) {
      console.error('Failed to load incidents:', error);
      setIncidents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setCreateError('');
    try {
      await incidentService.createIncident(createForm);
      setShowCreateForm(false);
      setCreateForm({ title: '', description: '', priority: 'MEDIUM', location: '' });
      await loadIncidents();
    } catch (err: any) {
      setCreateError(err.response?.data?.message || 'Failed to create incident');
    } finally {
      setCreating(false);
    }
  };

  const filteredIncidents = incidents.filter(incident => {
    if (filter === 'ALL') return true;
    return incident.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return '#ff9800';
      case 'RESOLVED': return '#4caf50';
      case 'CLOSED': return '#9e9e9e';
      default: return '#666';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return '#f44336';
      case 'HIGH': return '#ff9800';
      case 'MEDIUM': return '#ffeb3b';
      case 'LOW': return '#4caf50';
      default: return '#666';
    }
  };

  if (loading) {
    return <div className="loading">Loading incidents...</div>;
  }

  return (
    <div className="incident-list-container">
      <div className="header">
        <h1>Incident Management</h1>
        <button className="create-btn" onClick={() => { setShowCreateForm(!showCreateForm); setCreateError(''); }}>
          {showCreateForm ? 'Cancel' : 'Report New Incident'}
        </button>
      </div>

      {showCreateForm && (
        <div className="create-form">
          <h3>Report New Incident</h3>
          {createError && <div className="error-message">{createError}</div>}
          <form onSubmit={handleCreateSubmit}>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                value={createForm.title}
                onChange={e => setCreateForm({ ...createForm, title: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={createForm.description}
                onChange={e => setCreateForm({ ...createForm, description: e.target.value })}
                rows={3}
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Priority</label>
                <select
                  value={createForm.priority}
                  onChange={e => setCreateForm({ ...createForm, priority: e.target.value })}
                >
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  value={createForm.location}
                  onChange={e => setCreateForm({ ...createForm, location: e.target.value })}
                  required
                />
              </div>
            </div>
            <button type="submit" disabled={creating}>
              {creating ? 'Submitting...' : 'Submit Incident'}
            </button>
          </form>
        </div>
      )}

      <div className="filters">
        <button
          className={filter === 'ALL' ? 'active' : ''}
          onClick={() => setFilter('ALL')}
        >
          All
        </button>
        <button
          className={filter === 'ACTIVE' ? 'active' : ''}
          onClick={() => setFilter('ACTIVE')}
        >
          Active
        </button>
        <button
          className={filter === 'RESOLVED' ? 'active' : ''}
          onClick={() => setFilter('RESOLVED')}
        >
          Resolved
        </button>
      </div>

      <div className="incident-grid">
        {filteredIncidents.map(incident => (
          <div key={incident.id} className="incident-card">
            <div className="incident-header">
              <h3>{incident.title}</h3>
              <div className="status-badge" style={{ backgroundColor: getStatusColor(incident.status) }}>
                {incident.status}
              </div>
            </div>

            <p className="description">{incident.description}</p>

            <div className="incident-details">
              <div className="detail-item">
                <span className="label">Priority:</span>
                <span
                  className="priority-badge"
                  style={{ backgroundColor: getPriorityColor(incident.priority) }}
                >
                  {incident.priority}
                </span>
              </div>
              <div className="detail-item">
                <span className="label">Location:</span>
                <span>{incident.location}</span>
              </div>
              <div className="detail-item">
                <span className="label">Created:</span>
                <span>{new Date(incident.createdAt).toLocaleString()}</span>
              </div>
            </div>

            <div className="incident-actions">
              <Link to={`/incidents/${incident.id}`} className="view-btn">
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filteredIncidents.length === 0 && (
        <div className="no-incidents">
          No incidents found matching the current filter.
        </div>
      )}
    </div>
  );
};

export default IncidentList;