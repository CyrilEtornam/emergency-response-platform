package com.erp.incident_service.service;

import com.erp.incident_service.dto.ResponderWithDistanceDTO;
import com.erp.incident_service.model.Incident;
import com.erp.incident_service.model.Responder;
import com.erp.incident_service.model.Responder.ResponderAvailability;
import com.erp.incident_service.model.Responder.ResponderType;
import com.erp.incident_service.repository.IncidentRepository;
import com.erp.incident_service.repository.ResponderRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ResponderService {

    private final ResponderRepository responderRepository;
    private final IncidentRepository incidentRepository;
    private final RabbitTemplate rabbitTemplate;
    private final ObjectMapper objectMapper;

    @Value("${rabbitmq.exchange}")
    private String exchange;

    /**
     * GET /responders/nearest
     * Find nearest available responders of given type to a location
     */
    public List<ResponderWithDistanceDTO> findNearestResponders(double lat, double lng, String type, int limit) {
        ResponderType responderType = type != null ? ResponderType.valueOf(type.toUpperCase()) : null;

        // Fetch all available responders of the matching type
        List<Responder> responders = responderType != null
                ? responderRepository.findByTypeAndAvailability(responderType, ResponderAvailability.AVAILABLE)
                : responderRepository.findByAvailability(ResponderAvailability.AVAILABLE);

        // Calculate distances and sort
        return responders.stream()
                .map(r -> {
                    double distance = GeoUtils.haversineKm(lat, lng, r.getLatitude(), r.getLongitude());
                    return ResponderWithDistanceDTO.builder()
                            .id(r.getId())
                            .name(r.getName())
                            .type(r.getType().name())
                            .latitude(r.getLatitude())
                            .longitude(r.getLongitude())
                            .availability(r.getAvailability().name())
                            .distanceKm(GeoUtils.roundDistance(distance))
                            .build();
                })
                .sorted(Comparator.comparingDouble(ResponderWithDistanceDTO::getDistanceKm))
                .limit(limit)
                .toList();
    }

    /**
     * GET /incidents/:id/suggested-responders
     * Find nearest available responders for a specific incident
     */
    public List<ResponderWithDistanceDTO> getSuggestedResponders(UUID incidentId, int limit) {
        Incident incident = incidentRepository.findById(incidentId)
                .orElseThrow(() -> new RuntimeException("Incident not found"));

        return findNearestResponders(
                incident.getLatitude(),
                incident.getLongitude(),
                incident.getType().name(),
                limit);
    }

    /**
     * POST /responders/:id/assign
     * Assign a responder to an incident
     */
    @Transactional
    public void assignResponder(UUID responderId, UUID incidentId, boolean wasSuggested) {
        Responder responder = responderRepository.findById(responderId)
                .orElseThrow(() -> new RuntimeException("Responder not found"));

        Incident incident = incidentRepository.findById(incidentId)
                .orElseThrow(() -> new RuntimeException("Incident not found"));

        // Update responder status
        responder.setAvailability(ResponderAvailability.BUSY);
        responderRepository.save(responder);

        // Update incident status and link vehicle
        incident.setStatus(Incident.IncidentStatus.ASSIGNED);
        if (responder.getVehicleId() != null) {
            incident.setVehicleId(responder.getVehicleId().toString());
        }
        incidentRepository.save(incident);

        publishDispatchAssignedEvent(responder, incident);

        // Log assignment for analytics
        if (wasSuggested) {
            log.info("Suggested responder {} accepted for incident {}", responderId, incidentId);
        } else {
            log.info("Suggested responder overridden. Assigned {} to incident {}", responderId, incidentId);
        }
    }

    private void publishDispatchAssignedEvent(Responder responder, Incident incident) {
        if (responder.getVehicleId() == null) {
            log.warn("Responder {} has no vehicleId linked; skipping dispatch event", responder.getId());
            return;
        }

        UUID dispatchId = UUID.randomUUID();
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("dispatchId", dispatchId.toString());
        payload.put("incidentId", incident.getId().toString());
        payload.put("vehicleId", responder.getVehicleId().toString());
        payload.put("vehicleType", mapVehicleType(responder.getType()));
        payload.put("responderId", responder.getId().toString());
        payload.put("incidentLatitude", incident.getLatitude());
        payload.put("incidentLongitude", incident.getLongitude());

        Map<String, Object> event = new LinkedHashMap<>();
        event.put("eventType", "dispatch.assigned");
        event.put("timestamp", Instant.now().toString());
        event.put("payload", payload);

        try {
            String message = objectMapper.writeValueAsString(event);
            rabbitTemplate.convertAndSend(exchange, "dispatch.assigned", message);
            log.info("Published dispatch.assigned event for incident {}", incident.getId());
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("Failed to serialize dispatch event", e);
        }
    }

    /**
     * POST /incidents/:id/auto-dispatch
     * Finds the nearest available responder and assigns them automatically.
     */
    @Transactional
    public ResponderWithDistanceDTO autoDispatch(UUID incidentId) {
        List<ResponderWithDistanceDTO> suggestions = getSuggestedResponders(incidentId, 1);
        if (suggestions.isEmpty()) {
            throw new RuntimeException("No available responders found near incident " + incidentId);
        }
        ResponderWithDistanceDTO nearest = suggestions.get(0);
        assignResponder(nearest.getId(), incidentId, true);
        log.info("Auto-dispatched responder {} to incident {}", nearest.getId(), incidentId);
        return nearest;
    }

    private String mapVehicleType(ResponderType type) {
        return switch (type) {
            case MEDICAL -> "AMBULANCE";
            case POLICE -> "POLICE_CAR";
            case FIRE -> "FIRE_TRUCK";
        };
    }
}
