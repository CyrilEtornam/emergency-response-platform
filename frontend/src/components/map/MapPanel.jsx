import React, { useCallback, useEffect, useRef, useState } from 'react';
import { GoogleMap } from '@react-google-maps/api';
import { IncidentMarker } from './IncidentMarker';
import { VehicleMarker } from './VehicleMarker';
import { IncidentInfoWindow } from './IncidentInfoWindow';
import { GHANA_CENTER, DEFAULT_ZOOM } from '../../utils/constants';
import { Spinner } from '../common/Spinner';

const MAP_OPTIONS = {
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: true,
  zoomControl: true,
  styles: [
    { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
    { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#d59563' }] },
    { featureType: 'poi', stylers: [{ visibility: 'off' }] },
    { featureType: 'transit', stylers: [{ visibility: 'off' }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#38414e' }] },
    { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#212a37' }] },
    { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#9ca5b3' }] },
    { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#746855' }] },
    { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#1f2835' }] },
    { featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{ color: '#f3d19c' }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#17263c' }] },
    { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#515c6d' }] },
    { featureType: 'water', elementType: 'labels.text.stroke', stylers: [{ color: '#17263c' }] },
  ],
};

const containerStyle = { width: '100%', height: '100%' };

/**
 * MapPanel — mounted ONCE in AgencyShell, never unmounts.
 * Controlled entirely through props.
 */
export function MapPanel({
  activeTab,
  incidents = [],
  vehicles = [],
  selectedIncidentId,
  selectedVehicleId,
  onIncidentClick,
  onVehicleClick,
  onMapClick,
  reportPin,
  reportPinColor,
  agencyFilters,     // for admin map: { MEDICAL: bool, POLICE: bool, FIRE: bool }
  showVehicles = true,
  showIncidents = true,
}) {
  const mapRef = useRef(null);
  const [infoWindowIncident, setInfoWindowIncident] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const onLoad = useCallback((map) => {
    mapRef.current = map;
    setIsLoaded(true);
  }, []);

  const isReportTab = activeTab === 'report';
  const cursorStyle = isReportTab ? 'crosshair' : 'default';

  const handleMapClick = useCallback((e) => {
    if (isReportTab && onMapClick) {
      onMapClick({ lat: e.latLng.lat(), lng: e.latLng.lng() });
    }
  }, [isReportTab, onMapClick]);

  const handleIncidentMarkerClick = useCallback((incident) => {
    setInfoWindowIncident(incident);
    onIncidentClick?.(incident);
    if (mapRef.current) {
      mapRef.current.panTo({
        lat: Number(incident.latitude || incident.lat),
        lng: Number(incident.longitude || incident.lng),
      });
    }
  }, [onIncidentClick]);

  useEffect(() => {
    if (!mapRef.current || !selectedIncidentId) return;
    const incident = incidents.find(i => i.id === selectedIncidentId);
    if (incident) {
      mapRef.current.panTo({
        lat: Number(incident.latitude || incident.lat),
        lng: Number(incident.longitude || incident.lng),
      });
      mapRef.current.setZoom(13);
    }
  }, [selectedIncidentId, incidents]);

  // Filter incidents for admin map
  const visibleIncidents = incidents.filter((inc) => {
    if (!showIncidents) return false;
    if (!agencyFilters) return true;
    return agencyFilters[inc.type] !== false;
  });

  const visibleVehicles = vehicles.filter((v) => {
    if (!showVehicles) return false;
    if (!agencyFilters) return true;
    return agencyFilters[v.agencyType || v.type] !== false;
  });

  return (
    <div className="relative w-full h-full" style={{ cursor: cursorStyle }}>
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#1E293B] z-10">
          <Spinner size="xl" />
        </div>
      )}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={GHANA_CENTER}
        zoom={DEFAULT_ZOOM}
        options={MAP_OPTIONS}
        onLoad={onLoad}
        onClick={handleMapClick}
      >
        {/* Incident markers — shown on incidents tab and admin map */}
        {(activeTab === 'incidents' || activeTab === 'admin-map') &&
          visibleIncidents.map((inc) => (
            <IncidentMarker
              key={inc.id}
              incident={inc}
              isSelected={inc.id === selectedIncidentId}
              onClick={handleIncidentMarkerClick}
            />
          ))}

        {/* Vehicle markers — shown on dispatch tab and admin map */}
        {(activeTab === 'dispatch' || activeTab === 'admin-map') &&
          visibleVehicles.map((v) => (
            <VehicleMarker
              key={v.id}
              vehicle={v}
              isSelected={v.id === selectedVehicleId}
              onClick={(vehicle) => onVehicleClick?.(vehicle)}
            />
          ))}

        {/* Report tab: show only the dropped pin */}
        {activeTab === 'report' && reportPin && (
          <IncidentMarker
            incident={{ ...reportPin, severity: 'HIGH', id: 'report-pin' }}
            isSelected
            onClick={() => {}}
          />
        )}

        {/* Info window for clicked incident */}
        {infoWindowIncident && (
          <IncidentInfoWindow
            incident={infoWindowIncident}
            onClose={() => setInfoWindowIncident(null)}
          />
        )}
      </GoogleMap>
    </div>
  );
}
