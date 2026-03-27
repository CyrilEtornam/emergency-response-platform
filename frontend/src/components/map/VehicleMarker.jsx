import React from 'react';
import { Marker } from '@react-google-maps/api';
import { VEHICLE_TYPE_TO_ICON } from '../../utils/constants';

export function VehicleMarker({ vehicle, onClick, isSelected }) {
  const position = {
    lat: Number(vehicle.latitude || vehicle.lat || vehicle.currentLat),
    lng: Number(vehicle.longitude || vehicle.lng || vehicle.currentLng),
  };

  if (isNaN(position.lat) || isNaN(position.lng)) return null;

  const iconUrl = VEHICLE_TYPE_TO_ICON[vehicle.type] || VEHICLE_TYPE_TO_ICON.AMBULANCE;

  const icon = {
    url: iconUrl,
    scaledSize: window.google ? new window.google.maps.Size(32, 32) : undefined,
    anchor: window.google ? new window.google.maps.Point(16, 16) : undefined,
  };

  return (
    <Marker
      position={position}
      icon={icon}
      onClick={() => onClick?.(vehicle)}
      zIndex={isSelected ? 10 : 2}
      options={{
        opacity: isSelected ? 1 : 0.85,
      }}
    />
  );
}
