import React, { useCallback, useEffect, useRef, useState } from 'react';
import { GoogleMap, StandaloneSearchBox, Polygon } from '@react-google-maps/api';
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
  restriction: {
    latLngBounds: {
      north: 11.2,
      south: 4.5,
      west: -3.5,
      east: 1.2,
    },
    strictBounds: true,
  },
  minZoom: 6.5,
  maxZoom: 18,
};

const containerStyle = { width: '100%', height: '100%' };

// Ghana's more accurate border coordinates
const GHANA_BORDER = [
  // Eastern border (Togo/Benin)
  { lat: 11.1667, lng: 0.0000 },
  { lat: 11.0000, lng: 0.8000 },
  { lat: 10.7500, lng: 1.0000 },
  { lat: 10.3000, lng: 0.9500 },
  { lat: 9.9000, lng: 0.8500 },
  { lat: 9.5000, lng: 0.7000 },
  { lat: 9.2000, lng: 0.5500 },
  { lat: 8.8000, lng: 0.6500 },
  { lat: 8.5000, lng: 0.5000 },
  { lat: 8.2000, lng: 0.3500 },
  { lat: 8.0000, lng: 0.2000 },
  { lat: 7.5000, lng: 0.5500 },
  { lat: 7.0000, lng: 1.0000 },
  { lat: 6.5000, lng: 1.2000 },
  { lat: 6.0000, lng: 1.1000 },
  { lat: 5.5000, lng: 0.8000 },
  // Southern border (Gulf of Guinea)
  { lat: 5.0000, lng: 0.2000 },
  { lat: 4.7500, lng: -0.5000 },
  { lat: 4.7000, lng: -1.2000 },
  { lat: 4.7500, lng: -1.8000 },
  // Western border (Côte d'Ivoire)
  { lat: 5.0000, lng: -2.5000 },
  { lat: 5.5000, lng: -3.0000 },
  { lat: 6.0000, lng: -3.2500 },
  { lat: 6.5000, lng: -3.2000 },
  { lat: 7.0000, lng: -3.2500 },
  { lat: 7.5000, lng: -3.0000 },
  { lat: 8.0000, lng: -2.9000 },
  { lat: 8.5000, lng: -2.8000 },
  { lat: 9.0000, lng: -2.8000 },
  { lat: 9.5000, lng: -2.7500 },
  // Northern border (Burkina Faso)
  { lat: 10.0000, lng: -2.6000 },
  { lat: 10.5000, lng: -2.7000 },
  { lat: 11.0000, lng: -2.5000 },
  { lat: 11.1667, lng: -1.5000 },
  { lat: 11.1667, lng: -0.5000 },
  { lat: 11.1667, lng: 0.0000 },
];

const GHANA_POLYGON_OPTIONS = {
  strokeColor: '#3B82F6',
  strokeOpacity: 1.0,
  strokeWeight: 3,
  fillColor: '#1E40AF',
  fillOpacity: 0.06,
  clickable: false,
  zIndex: 1,
};

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
  agencyFilters,     // for admin map: { MEDICAL: bool, POLICE: bool, FIRE: bool }
  showVehicles = true,
  showIncidents = true,
}) {
  const mapRef = useRef(null);
  const searchBoxRef = useRef(null);
  const [infoWindowIncident, setInfoWindowIncident] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const onLoad = useCallback((map) => {
    mapRef.current = map;
    setIsLoaded(true);
  }, []);

  const handlePlacesChanged = useCallback(() => {
    const places = searchBoxRef.current?.getPlaces();
    if (!places || places.length === 0) return;
    const place = places[0];
    if (!place.geometry?.location) return;
    mapRef.current?.panTo(place.geometry.location);
    mapRef.current?.setZoom(13);
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

      {!isReportTab && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 w-72">
          <StandaloneSearchBox
            onLoad={(ref) => (searchBoxRef.current = ref)}
            onPlacesChanged={handlePlacesChanged}
            bounds={{ north: 11.2, south: 4.5, west: -3.5, east: 1.2 }}
          >
            <input
              type="text"
              placeholder="Search location in Ghana..."
              className="w-full px-3 py-2 text-sm bg-[#1E293B] border border-[#334155] text-[#F1F5F9] placeholder:text-[#94A3B8] rounded shadow-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
            />
          </StandaloneSearchBox>
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
        {/* Ghana border outline — always visible */}
        <Polygon paths={GHANA_BORDER} options={GHANA_POLYGON_OPTIONS} />

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
