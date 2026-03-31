import React from 'react';
import { InfoWindow } from '@react-google-maps/api';
import { SEVERITY_COLORS, AGENCY_COLORS, STATUS_COLORS } from '../../utils/constants';
import { formatTimeAgo } from '../../utils/formatters';

export function IncidentInfoWindow({ incident, onClose }) {
  if (!incident) return null;

  const severityStyle = SEVERITY_COLORS[incident.severity] || SEVERITY_COLORS.LOW;
  const agencyStyle = AGENCY_COLORS[incident.type] || { color: '#6b6860', bg: 'rgba(107,104,96,0.15)' };
  const statusStyle = STATUS_COLORS[incident.status] || { bg: 'rgba(74,158,232,0.15)', text: '#4a9ee8' };

  const position = {
    lat: incident.latitude || incident.lat,
    lng: incident.longitude || incident.lng,
  };

  return (
    <InfoWindow position={position} onCloseClick={onClose}>
      <div style={{ fontFamily: 'Inter, sans-serif', minWidth: 180, maxWidth: 240 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <span
            style={{
              display: 'inline-block',
              padding: '2px 8px',
              borderRadius: 9999,
              fontSize: 11,
              fontWeight: 500,
              backgroundColor: agencyStyle.bg,
              color: agencyStyle.color,
            }}
          >
            {incident.type}
          </span>
          <span
            style={{
              display: 'inline-block',
              padding: '2px 8px',
              borderRadius: 9999,
              fontSize: 11,
              fontWeight: 500,
              backgroundColor: severityStyle.bg,
              color: severityStyle.text,
            }}
          >
            {incident.severity}
          </span>
        </div>
        {incident.description && (
          <p style={{ fontSize: 12, color: '#1e1e1b', marginBottom: 6, lineHeight: 1.4 }}>
            {incident.description?.slice(0, 80)}
            {incident.description?.length > 80 ? '…' : ''}
          </p>
        )}
        {incident.address && (
          <p style={{ fontSize: 11, color: '#6b6860', marginBottom: 4 }}>{incident.address}</p>
        )}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
          <span style={{ fontSize: 11, color: '#6b6860' }}>{formatTimeAgo(incident.createdAt || incident.reportedAt)}</span>
          <span
            style={{
              fontSize: 11,
              fontWeight: 500,
              color: statusStyle.text,
              backgroundColor: statusStyle.bg,
              padding: '2px 6px',
              borderRadius: 4,
            }}
          >
            {incident.status}
          </span>
        </div>
      </div>
    </InfoWindow>
  );
}
