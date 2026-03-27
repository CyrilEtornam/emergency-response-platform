import React from 'react';
import { Marker } from '@react-google-maps/api';
import { SEVERITY_COLORS } from '../../utils/constants';

export function IncidentMarker({ incident, onClick, isSelected }) {
  const severity = incident.severity || 'LOW';
  const style = SEVERITY_COLORS[severity] || SEVERITY_COLORS.LOW;

  const position = {
    lat: Number(incident.latitude || incident.lat),
    lng: Number(incident.longitude || incident.lng),
  };

  if (isNaN(position.lat) || isNaN(position.lng)) return null;

  const icon = {
    path: window.google?.maps?.SymbolPath?.CIRCLE || 0,
    fillColor: style.mapColor,
    fillOpacity: 1,
    strokeColor: '#FFFFFF',
    strokeWeight: isSelected ? 3 : 1.5,
    scale: isSelected ? style.scale + 3 : style.scale,
  };

  return (
    <Marker
      position={position}
      icon={icon}
      onClick={() => onClick?.(incident)}
      zIndex={isSelected ? 10 : 1}
    />
  );
}
