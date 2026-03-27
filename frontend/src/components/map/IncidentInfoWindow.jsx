import React from 'react';
import { InfoWindow } from '@react-google-maps/api';
import { SEVERITY_COLORS, AGENCY_COLORS } from '../../utils/constants';
import { formatTimeAgo } from '../../utils/formatters';

export function IncidentInfoWindow({ incident, onClose }) {
  if (!incident) return null;

  const severityStyle = SEVERITY_COLORS[incident.severity] || SEVERITY_COLORS.LOW;
  const agencyStyle = AGENCY_COLORS[incident.type] || { color: '#6B7280', bg: '#F3F4F6' };

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
          <p style={{ fontSize: 12, color: '#111827', marginBottom: 6, lineHeight: 1.4 }}>
            {incident.description?.slice(0, 80)}
            {incident.description?.length > 80 ? '…' : ''}
          </p>
        )}
        {incident.address && (
          <p style={{ fontSize: 11, color: '#6B7280', marginBottom: 4 }}>{incident.address}</p>
        )}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
          <span style={{ fontSize: 11, color: '#6B7280' }}>{formatTimeAgo(incident.createdAt || incident.reportedAt)}</span>
          <span
            style={{
              fontSize: 11,
              fontWeight: 500,
              color: '#1D4ED8',
              backgroundColor: '#EFF6FF',
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
