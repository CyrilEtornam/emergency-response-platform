import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  GoogleMap,
  StandaloneSearchBox,
  DirectionsRenderer
} from '@react-google-maps/api';
import { MarkerClusterer } from '@googlemaps/markerclusterer';

import { IncidentMarker } from './IncidentMarker';
import { VehicleMarker } from './VehicleMarker';
import { IncidentInfoWindow } from './IncidentInfoWindow';
import { GHANA_CENTER, DEFAULT_ZOOM } from '../../utils/constants';
import { Spinner } from '../common/Spinner';
import { PulseOverlay } from './PulseOverlay';
import { getIncidentIcon } from './IncidentMarker';

const darkMapStyles = [
  { elementType: "geometry", stylers: [{ color: "#1c1c19" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#6b6860" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#1c1c19" }] },
  { featureType: "landscape", elementType: "geometry", stylers: [{ color: "#1a1a17" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#14140f" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#3a3a36" }] },
  { featureType: "park", elementType: "geometry", stylers: [{ color: "#1e2018" }] },
  { featureType: "road", elementType: "geometry.fill", stylers: [{ color: "#3e3e38" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#28281f" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9a9a90" }] },
  { featureType: "road.local", elementType: "geometry.fill", stylers: [{ color: "#3e3e38" }] },
  { featureType: "road.arterial", elementType: "geometry.fill", stylers: [{ color: "#52524a" }] },
  { featureType: "road.arterial", elementType: "labels.text.fill", stylers: [{ color: "#a0a098" }] },
  { featureType: "road.highway", elementType: "geometry.fill", stylers: [{ color: "#686860" }] },
  { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#3a3a32" }] },
  { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#c0c0b8" }] },
  { featureType: "administrative", elementType: "geometry.stroke", stylers: [{ color: "#3a3a36" }] },
  { featureType: "administrative.country", elementType: "geometry.stroke", stylers: [{ color: "#5a5a50" }] },
  { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#7a7a70" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
];

const MAP_OPTIONS = {
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: true,
  zoomControl: true,
  styles: darkMapStyles,
};

const containerStyle = { width: '100%', height: '100%' };


const severityColors = {
  CRITICAL: '#e84242',
  HIGH: '#e8622a',
  MEDIUM: '#e8a82a',
  LOW: '#4caf6e',
};

const getSeverityColor = (severity) => severityColors[severity] || '#e8622a';

export function MapPanel({
  activeTab,
  incidents = [],
  vehicles = [],
  selectedIncidentId,
  selectedVehicleId,
  onIncidentClick,
  onVehicleClick,
  onMapClick,
  onRegionClick,
  reportPin,
  agencyFilters,
  showVehicles = true,
  showIncidents = true,
  showRegions = true,
}) {
  const mapRef = useRef(null);
  const searchBoxRef = useRef(null);
  const clustererRef = useRef(null);
  const clusterMarkersRef = useRef([]);

  const [isLoaded, setIsLoaded] = useState(false);
  const [directions, setDirections] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(DEFAULT_ZOOM);

  const onLoad = useCallback((map) => {
    mapRef.current = map;
    setIsLoaded(true);
  }, []);

  /**
   * SEARCH
   */
  const handlePlacesChanged = useCallback(() => {
    const places = searchBoxRef.current?.getPlaces();
    if (!places?.length) return;

    const loc = places[0]?.geometry?.location;
    if (!loc) return;

    mapRef.current?.panTo(loc);
    mapRef.current?.setZoom(13);
  }, []);

  /**
   * ROUTE CALCULATION
   */
  const calculateRoute = useCallback((vehicle, incident) => {
    if (!window.google) return;

    const directionsService = new window.google.maps.DirectionsService();

    directionsService.route(
      {
        origin: { lat: Number(vehicle.lat), lng: Number(vehicle.lng) },
        destination: {
          lat: Number(incident.latitude || incident.lat),
          lng: Number(incident.longitude || incident.lng),
        },
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK") {
          setDirections(result);
        }
      }
    );
  }, []);

  /**
   * TRIGGER ROUTE
   */
  useEffect(() => {
    if (!selectedVehicleId || !selectedIncidentId) return;

    const vehicle = vehicles.find(v => v.id === selectedVehicleId);
    const incident = incidents.find(i => i.id === selectedIncidentId);

    if (vehicle && incident) {
      calculateRoute(vehicle, incident);
    }
  }, [selectedVehicleId, selectedIncidentId, vehicles, incidents, calculateRoute]);

  const isReportTab = activeTab === 'report';

  const selectedIncident = useMemo(
    () => incidents.find((i) => i.id === selectedIncidentId),
    [incidents, selectedIncidentId]
  );

  const handleMapClick = useCallback((e) => {
    if (isReportTab && onMapClick) {
      onMapClick({ lat: e.latLng.lat(), lng: e.latLng.lng() });
    }
  }, [isReportTab, onMapClick]);

  const handleIncidentClick = useCallback((incident) => {
    onIncidentClick?.(incident);
  }, [onIncidentClick]);

  const visibleIncidents = useMemo(() => incidents.filter((inc) => {
    if (!showIncidents) return false;
    if (!agencyFilters) return true;
    return agencyFilters[inc.type] !== false;
  }), [incidents, showIncidents, agencyFilters]);

  const visibleVehicles = useMemo(() => vehicles.filter((v) => {
    if (!showVehicles) return false;
    if (!agencyFilters) return true;
    return agencyFilters[v.agencyType || v.type] !== false;
  }), [vehicles, showVehicles, agencyFilters]);


  const clearClusterer = useCallback(() => {
    clustererRef.current?.clearMarkers();
    clusterMarkersRef.current.forEach((m) => m.setMap(null));
    clustererRef.current = null;
    clusterMarkersRef.current = [];
  }, []);

  const shouldCluster = activeTab === 'incidents' && showIncidents && (zoomLevel <= 9);

  useEffect(() => {
    if (!mapRef.current || !window.google) return undefined;

    if (!shouldCluster) {
      clearClusterer();
      return undefined;
    }

    clearClusterer();

    const markers = visibleIncidents.map((inc) => {
      const position = {
        lat: Number(inc.latitude || inc.lat),
        lng: Number(inc.longitude || inc.lng),
      };

      if (Number.isNaN(position.lat) || Number.isNaN(position.lng)) return null;

      const marker = new window.google.maps.Marker({
        position,
        icon: getIncidentIcon(inc.severity || 'LOW', inc.id === selectedIncidentId),
      });

      marker.addListener('click', () => handleIncidentClick(inc));

      return marker;
    }).filter(Boolean);

    const renderer = {
      render({ count, position }) {
        const scale = Math.min(36, 18 + count * 1.5);

        return new window.google.maps.Marker({
          position,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            fillColor: '#e8622a',
            fillOpacity: 0.9,
            strokeColor: '#ffffff',
            strokeOpacity: 0.4,
            strokeWeight: 6,
            scale,
          },
          label: {
            text: String(count),
            color: '#ffffff',
            fontWeight: '700',
            fontSize: '12px',
          },
          zIndex: 2,
        });
      },
    };

    clustererRef.current = new MarkerClusterer({
      map: mapRef.current,
      markers,
      renderer,
      gridSize: 60,
    });

    clusterMarkersRef.current = markers;

    clustererRef.current.addListener('clusterclick', (event) => {
      const bounds = new window.google.maps.LatLngBounds();
      event?.markers?.forEach((m) => {
        const pos = m.getPosition();
        if (pos) bounds.extend(pos);
      });

      if (!bounds.isEmpty()) {
        mapRef.current?.fitBounds(bounds);
      }
    });

    return () => {
      clearClusterer();
    };
  }, [shouldCluster, visibleIncidents, selectedIncidentId, handleIncidentClick, clearClusterer]);

  return (
    <div className="relative w-full h-full">
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-surface z-10">
          <Spinner size="xl" />
        </div>
      )}

      {!isReportTab && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 w-72">
          <StandaloneSearchBox
            onLoad={(ref) => (searchBoxRef.current = ref)}
            onPlacesChanged={handlePlacesChanged}
          >
            <input
              type="text"
              placeholder="Search location..."
              className="w-full px-3 py-2 bg-surface border rounded"
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
        onZoomChanged={() => setZoomLevel(mapRef.current?.getZoom() ?? DEFAULT_ZOOM)}
      >
        {/* REGIONS
        {showRegions && ghanaRegions.map((region) => (
          <Polygon
            key={region.name}
            paths={region.coordinates}
            options={regionPolygonOptions(region.color)}
            onClick={(e) => handleRegionClick(region, e)}
          />
        ))}

        {regionLabel && (
          <OverlayView
            position={regionLabel.position}
            mapPaneName={OverlayView.FLOAT_PANE}
          >
            <div className="bg-[#1f1f1b] border border-[#3c3c35] text-[13px] font-semibold text-white px-3 py-2 rounded shadow-md transform -translate-x-1/2 -translate-y-full whitespace-nowrap">
              {regionLabel.name}
            </div>
          </OverlayView>
        )} */}

        {/* INCIDENTS */}
        {!shouldCluster && visibleIncidents.map((inc) => (
          <IncidentMarker
            key={inc.id}
            incident={inc}
            isSelected={inc.id === selectedIncidentId}
            onClick={handleIncidentClick}
          />
        ))}

        {/* VEHICLES */}
        {visibleVehicles.map((v) => (
          <VehicleMarker
            key={v.id}
            vehicle={v}
            isSelected={v.id === selectedVehicleId}
            onClick={onVehicleClick}
          />
        ))}

        {/* ROUTE GLOW */}
        {directions && (
          <>
            <DirectionsRenderer
              directions={directions}
              options={{
                polylineOptions: {
                  strokeColor: "#00e5ff",
                  strokeOpacity: 0.3,
                  strokeWeight: 12,
                },
                suppressMarkers: true,
              }}
            />
            <DirectionsRenderer
              directions={directions}
              options={{
                polylineOptions: {
                  strokeColor: "#00e5ff",
                  strokeOpacity: 1,
                  strokeWeight: 5,
                },
                suppressMarkers: true,
              }}
            />
          </>
        )}

        {/* INFO WINDOW */}
        {selectedIncident && (
          <IncidentInfoWindow
            incident={selectedIncident}
            onClose={() => onIncidentClick?.(null)}
          />
        )}

        {selectedIncident && (
          <PulseOverlay
            position={{
              lat: Number(selectedIncident.latitude || selectedIncident.lat),
              lng: Number(selectedIncident.longitude || selectedIncident.lng),
            }}
            color={getSeverityColor(selectedIncident.severity)}
          />
        )}
      </GoogleMap>
    </div>
  );
}