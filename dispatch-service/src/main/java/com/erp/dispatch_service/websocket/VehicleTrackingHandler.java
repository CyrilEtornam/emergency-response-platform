package com.erp.dispatch_service.websocket;

import com.erp.dispatch_service.model.Vehicle;
import com.erp.dispatch_service.security.JwtUtil;
import com.erp.dispatch_service.service.VehicleService;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.net.URI;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Component
@RequiredArgsConstructor
public class VehicleTrackingHandler extends TextWebSocketHandler {

    private static final Logger log = LoggerFactory.getLogger(VehicleTrackingHandler.class);
    private static final Random RANDOM = new Random();

    private final Set<WebSocketSession> sessions = ConcurrentHashMap.newKeySet();
    private final JwtUtil jwtUtil;
    private final VehicleService vehicleService;
    private final ObjectMapper objectMapper;

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
        if (sessions.isEmpty()) return;

        try {
            List<Vehicle> vehicles = vehicleService.getAllEntities();
            // Simulate slight drift for EN_ROUTE / ON_SCENE vehicles
            List<Map<String, Object>> payload = vehicles.stream().map(v -> {
                double lat = v.getLatitude() != null ? v.getLatitude() : 5.55;
                double lon = v.getLongitude() != null ? v.getLongitude() : -0.20;
                if (v.getStatus() == Vehicle.VehicleStatus.EN_ROUTE
                        || v.getStatus() == Vehicle.VehicleStatus.ON_SCENE) {
                    lat += (RANDOM.nextDouble() - 0.5) * 0.002;
                    lon += (RANDOM.nextDouble() - 0.5) * 0.002;
                }
                Map<String, Object> m = new LinkedHashMap<>();
                m.put("id", v.getId().toString());
                m.put("callSign", v.getCallSign());
                m.put("agency", v.getAgency().name());
                m.put("vehicleType", v.getVehicleType().name());
                m.put("status", v.getStatus().name());
                m.put("latitude", lat);
                m.put("longitude", lon);
                return m;
            }).toList();

            String json = objectMapper.writeValueAsString(payload);
            TextMessage msg = new TextMessage(json);

            for (Iterator<WebSocketSession> it = sessions.iterator(); it.hasNext(); ) {
                WebSocketSession s = it.next();
                if (!s.isOpen()) { it.remove(); continue; }
                try { s.sendMessage(msg); }
                catch (Exception e) { it.remove(); }
            }
        } catch (Exception e) {
            log.error("WS broadcast error: {}", e.getMessage());
        }
    }

    private String extractToken(WebSocketSession session) {
        URI uri = session.getUri();
        if (uri == null) return null;
        String query = uri.getQuery();
        if (query == null) return null;
        for (String param : query.split("&")) {
            if (param.startsWith("token=")) return param.substring(6);
        }
        return null;
    }
}
