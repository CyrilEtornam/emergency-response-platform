import React from 'react';
import { Marker } from '@react-google-maps/api';

export function getIncidentIcon(severity, isSelected) {
  const colors = {
    CRITICAL: '#e84242',
    HIGH: '#e8622a',
    MEDIUM: '#e8a82a',
    LOW: '#4caf6e',
  };

  const scales = {
    CRITICAL: isSelected ? 18 : 13,
    HIGH: isSelected ? 16 : 11,
    MEDIUM: isSelected ? 14 : 10,
    LOW: isSelected ? 13 : 9,
  };

  const path = window.google?.maps?.SymbolPath?.CIRCLE || 0;

  return {
    path,
    fillColor: colors[severity] || '#a09d96',
    fillOpacity: 1,
    strokeColor: isSelected ? '#ffffff' : 'rgba(255,255,255,0.4)',
    strokeWeight: isSelected ? 3 : 1.5,
    scale: scales[severity] || 10,
  };
}

export function IncidentMarker({ incident, onClick, isSelected }) {
  const severity = incident.severity || 'LOW';

  const position = {
    lat: Number(incident.latitude || incident.lat),
    lng: Number(incident.longitude || incident.lng),
  };

  if (Number.isNaN(position.lat) || Number.isNaN(position.lng)) return null;

  const icon = getIncidentIcon(severity, isSelected);

  return (
    <Marker
      position={position}
      icon={icon}
      onClick={() => onClick?.(incident)}
      zIndex={isSelected ? 10 : 1}
    />
  );
}
