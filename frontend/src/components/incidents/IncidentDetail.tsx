import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { incidentService, Incident } from '../../services/incidentService';
import './IncidentDetail.css';

const IncidentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [incident, setIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [updating, setUpdating] = useState<boolean>(false);

  useEffect(() => {
    const loadIncident = async () => {
      if (!id) return;

      try {
        const data = await incidentService.getIncidentById(id);
        setIncident(data);
      } catch (error) {
        console.error('Failed to load incident:', error);
        setIncident(null);
      } finally {
        setLoading(false);
      }
    };

    loadIncident();
  }, [id]);

  const handleStatusChange = async (newStatus: string) => {
    if (!incident || !id) return;

    setUpdating(true);
    try {
      const updated = await incidentService.updateIncident(id, { status: newStatus });
      setIncident(updated);
    } catch (error) {
      console.error('Failed to update incident status:', error);
    } finally {
      setUpdating(false);
    }
  };

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
    return <div className="loading">Loading incident details...</div>;
  }

  if (!incident) {
    return <div className="error">Incident not found</div>;
  }

  return (
    <div className="incident-detail-container">
      <div className="header">
        <button onClick={() => navigate('/incidents')} className="back-btn">
          ← Back to Incidents
        </button>
        <h1>{incident.title}</h1>
        <div className="status-controls">
          <select
            value={incident.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={updating}
          >
            <option value="ACTIVE">Active</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>
      </div>

      <div className="incident-content">
        <div className="main-info">
          <div className="info-section">
            <h3>Description</h3>
            <p>{incident.description}</p>
          </div>

          <div className="info-grid">
            <div className="info-item">
              <span className="label">Status:</span>
              <span
                className="status-badge"
                style={{ backgroundColor: getStatusColor(incident.status) }}
              >
                {incident.status}
              </span>
            </div>

            <div className="info-item">
              <span className="label">Priority:</span>
              <span
                className="priority-badge"
                style={{ backgroundColor: getPriorityColor(incident.priority) }}
              >
                {incident.priority}
              </span>
            </div>

            <div className="info-item">
              <span className="label">Location:</span>
              <span>{incident.location}</span>
            </div>

            <div className="info-item">
              <span className="label">Reported By:</span>
              <span>{incident.reportedBy}</span>
            </div>

            <div className="info-item">
              <span className="label">Assigned To:</span>
              <span>{incident.assignedTo || 'Not assigned'}</span>
            </div>

            <div className="info-item">
              <span className="label">Created:</span>
              <span>{new Date(incident.createdAt).toLocaleString()}</span>
            </div>

            <div className="info-item">
              <span className="label">Last Updated:</span>
              <span>{new Date(incident.updatedAt).toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="sidebar">
          <div className="action-panel">
            <h3>Actions</h3>
            <div className="action-buttons">
              <button className="action-btn">Assign Responder</button>
              <button className="action-btn">Update Location</button>
              <button className="action-btn">Add Note</button>
              <button className="action-btn">Generate Report</button>
            </div>
          </div>

          {incident.resolution && (
            <div className="resolution-section">
              <h3>Resolution</h3>
              <p>{incident.resolution}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IncidentDetail;