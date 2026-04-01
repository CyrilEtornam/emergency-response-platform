package com.erp.dispatch_service.websocket;

import com.erp.dispatch_service.model.Dispatch;
import com.erp.dispatch_service.model.Station;
import com.erp.dispatch_service.model.Vehicle;
import com.erp.dispatch_service.repository.DispatchRepository;
import com.erp.dispatch_service.repository.StationRepository;
import com.erp.dispatch_service.repository.VehicleRepository;
import com.erp.dispatch_service.security.JwtUtil;
import com.erp.dispatch_service.service.SimulationService;
import com.erp.dispatch_service.service.VehicleService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.net.URI;
import java.util.Arrays;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Component
@RequiredArgsConstructor
public class VehicleTrackingHandler extends TextWebSocketHandler {

    private static final Logger log = LoggerFactory.getLogger(VehicleTrackingHandler.class);

    private final Set<WebSocketSession> sessions = ConcurrentHashMap.newKeySet();
    private final JwtUtil jwtUtil;
    private final VehicleService vehicleService;
    private final VehicleRepository vehicleRepository;
    private final SimulationService simulationService;
    private final ObjectMapper objectMapper;
    private final DispatchRepository dispatchRepository;
    private final StationRepository stationRepository;
    private final RestTemplate restTemplate;

    // Track journey phase: vehicle_id → {phase, incidentId}
    private final ConcurrentHashMap<UUID, JourneyState> journeyStates = new ConcurrentHashMap<>();

    private static class JourneyState {
        enum Phase {
            TO_INCIDENT, RETURNING_TO_STATION
        }

        Phase phase;
        UUID incidentId;
        double incidentLat;
        double incidentLng;
        double stationLat;
        double stationLng;

        JourneyState(Phase phase, UUID incidentId, double incidentLat, double incidentLng, double stationLat,
                double stationLng) {
            this.phase = phase;
            this.incidentId = incidentId;
            this.incidentLat = incidentLat;
            this.incidentLng = incidentLng;
            this.stationLat = stationLat;
            this.stationLng = stationLng;
        }
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        String token = extractToken(session);
        if (token == null || !jwtUtil.isValid(token)) {
            log.warn("WS rejected — invalid token");
            session.close(CloseStatus.POLICY_VIOLATION);
            return;
        }
        sessions.add(session);
        log.info("WS connected: {} (total={})", session.getId(), sessions.size());
        // send initial snapshot immediately
        broadcast();
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        sessions.remove(session);
        log.info("WS disconnected: {} (total={})", session.getId(), sessions.size());
    }

    @Override
    public void handleTransportError(WebSocketSession session, Throwable ex) {
        sessions.remove(session);
    }

    /** Broadcast vehicle locations every 5 seconds. */
    @Scheduled(fixedRate = 5000)
    public void broadcast() {
        if (sessions.isEmpty())
            return;

        List<Vehicle> vehicles = vehicleService.getAllEntities();
        vehicles.forEach(v -> {
            try {
                broadcastLocationUpdate(v);
            } catch (Exception e) {
                log.warn("broadcast error for vehicle {}: {}", v.getId(), e.getMessage());
            }
        });
    }

    private String extractToken(WebSocketSession session) {
        URI uri = session.getUri();
        if (uri == null)
            return null;
        String query = uri.getQuery();
        if (query == null)
            return null;
        for (String param : query.split("&")) {
            if (param.startsWith("token="))
                return param.substring(6);
        }
        return null;
    }

    public void broadcastEvent(Object event) {
        if (sessions.isEmpty())
            return;
        try {
            String json = objectMapper.writeValueAsString(event);
            TextMessage msg = new TextMessage(json);
            sendToSessions(msg);
        } catch (Exception e) {
            log.error("Failed to broadcast event", e);
        }
    }

    private void broadcastLocationUpdate(Vehicle vehicle) {
        double lat = vehicle.getLatitude() != null ? vehicle.getLatitude() : 5.55;
        double lon = vehicle.getLongitude() != null ? vehicle.getLongitude() : -0.20;

        if (vehicle.getStatus() == Vehicle.VehicleStatus.EN_ROUTE) {
            UUID id = vehicle.getId();
            if (simulationService.isActive(id)) {
                if (simulationService.hasArrived(id)) {
                    JourneyState state = journeyStates.get(id);
                    if (state == null) {
                        // First arrival: at incident, now return to station
                        simulationService.clear(id);
                        vehicle.setStatus(Vehicle.VehicleStatus.ON_SCENE);
                        vehicleRepository.save(vehicle);
                        log.info("Vehicle {} arrived ON_SCENE, initiating return to station", id);

                        // Load dispatch to get incident and station info
                        var dispatch = dispatchRepository.findByVehicleIdAndStatusIn(id,
                                Arrays.asList(Dispatch.DispatchStatus.EN_ROUTE, Dispatch.DispatchStatus.ON_SCENE));
                        if (dispatch.isPresent()) {
                            Station station = vehicle.getStationId() != null
                                    ? stationRepository.findById(vehicle.getStationId()).orElse(null)
                                    : null;
                            if (station != null) {
                                // Update dispatch status
                                dispatch.get().setStatus(Dispatch.DispatchStatus.ON_SCENE);
                                dispatchRepository.save(dispatch.get());

                                // Register return journey from incident to station
                                JourneyState newState = new JourneyState(
                                        JourneyState.Phase.RETURNING_TO_STATION,
                                        dispatch.get().getIncidentId(),
                                        lat, lon, station.getLatitude(), station.getLongitude());
                                journeyStates.put(id, newState);
                                simulationService.register(id, lat, lon, station.getLatitude(), station.getLongitude());
                                log.info("Vehicle {} registered return journey to station {}", id, station.getId());
                            }
                        }
                    } else if (state.phase == JourneyState.Phase.RETURNING_TO_STATION) {
                        // Second arrival: back at station, incident resolved
                        simulationService.clear(id);
                        vehicle.setStatus(Vehicle.VehicleStatus.AVAILABLE);
                        vehicle.setLatitude(state.stationLat);
                        vehicle.setLongitude(state.stationLng);
                        vehicleRepository.save(vehicle);
                        journeyStates.remove(id);
                        log.info("Vehicle {} returned to station, marking incident {} as RESOLVED", id,
                                state.incidentId);

                        // Call incident-service to mark incident as resolved
                        try {
                            restTemplate.exchange(
                                    "http://localhost:8082/incidents/" + state.incidentId + "/resolve",
                                    HttpMethod.PATCH,
                                    new HttpEntity<>(null),
                                    Object.class);
                        } catch (Exception e) {
                            log.warn("Failed to mark incident as resolved: {}", e.getMessage());
                        }
                    }
                } else {
                    double[] pos = simulationService.tick(id);
                    lat = pos[0];
                    lon = pos[1];
                }
            }
        }

        Map<String, Object> event = new LinkedHashMap<>();
        event.put("eventType", "location.updated");
        event.put("vehicleId", vehicle.getId().toString());
        event.put("callSign", vehicle.getCallSign());
        event.put("vehicleType", vehicle.getVehicleType().name());
        event.put("status", vehicle.getStatus().name());
        event.put("location", Map.of(
                "latitude", lat,
                "longitude", lon));

        broadcastEvent(event);
    }

    private void sendToSessions(TextMessage msg) {
        for (Iterator<WebSocketSession> it = sessions.iterator(); it.hasNext();) {
            WebSocketSession s = it.next();
            if (!s.isOpen()) {
                it.remove();
                continue;
            }
            try {
                s.sendMessage(msg);
            } catch (Exception e) {
                it.remove();
            }
        }
    }
}
