package com.erp.dispatch_service.messaging;

import com.erp.dispatch_service.event.DispatchAssignedEvent;
import com.erp.dispatch_service.model.Dispatch;
import com.erp.dispatch_service.model.Vehicle;
import com.erp.dispatch_service.repository.DispatchRepository;
import com.erp.dispatch_service.repository.VehicleRepository;
import com.erp.dispatch_service.service.SimulationService;
import com.erp.dispatch_service.websocket.VehicleTrackingHandler;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class DispatchAssignmentListener {

    private final ObjectMapper objectMapper;
    private final VehicleRepository vehicleRepository;
    private final DispatchRepository dispatchRepository;
    private final VehicleTrackingHandler trackingHandler;
    private final SimulationService simulationService;

    @RabbitListener(queues = "${rabbitmq.dispatch-queue:dispatch.incident.queue}")
    @Transactional
    public void handleDispatchAssigned(String message) {
        try {
            DispatchAssignedEvent event = objectMapper.readValue(message, DispatchAssignedEvent.class);
            if (!"dispatch.assigned".equals(event.getEventType())) {
                return;
            }
            DispatchAssignedEvent.Payload payload = event.getPayload();
            UUID vehicleId = UUID.fromString(payload.getVehicleId());
            UUID incidentId = UUID.fromString(payload.getIncidentId());
            UUID dispatchId = UUID.fromString(payload.getDispatchId());

            Vehicle vehicle = vehicleRepository.findById(vehicleId)
                    .orElseThrow(() -> new IllegalStateException("Vehicle not found " + vehicleId));
            vehicle.setStatus(Vehicle.VehicleStatus.EN_ROUTE);
            vehicleRepository.save(vehicle);

            // Register movement simulation toward the incident location
            Double destLat = payload.getIncidentLatitude();
            Double destLng = payload.getIncidentLongitude();
            if (destLat != null && destLng != null) {
                double startLat = vehicle.getLatitude() != null ? vehicle.getLatitude() : 5.55;
                double startLng = vehicle.getLongitude() != null ? vehicle.getLongitude() : -0.20;
                simulationService.register(vehicleId, startLat, startLng, destLat, destLng);
                log.info("Simulation registered: vehicle {} → ({}, {})", vehicleId, destLat, destLng);
            }

            upsertDispatch(dispatchId, incidentId, vehicleId);
            broadcastAssignment(vehicle, incidentId);

            log.info("Vehicle {} marked EN_ROUTE for incident {}", vehicleId, incidentId);
        } catch (Exception e) {
            log.error("Failed to process dispatch.assigned event", e);
        }
    }

    private void upsertDispatch(UUID dispatchId, UUID incidentId, UUID vehicleId) {
        Optional<Dispatch> existing = dispatchRepository.findById(dispatchId);
        Dispatch dispatch = existing.orElseGet(() -> {
            Dispatch d = new Dispatch();
            d.setId(dispatchId);
            d.setIncidentId(incidentId);
            d.setVehicleId(vehicleId);
            return d;
        });
        dispatch.setStatus(Dispatch.DispatchStatus.EN_ROUTE);
        dispatchRepository.save(dispatch);
    }

    private void broadcastAssignment(Vehicle vehicle, UUID incidentId) {
        Map<String, Object> event = new LinkedHashMap<>();
        event.put("eventType", "dispatch.assigned");
        event.put("vehicleId", vehicle.getId().toString());
        event.put("incidentId", incidentId.toString());
        event.put("status", "EN_ROUTE");
        event.put("callSign", vehicle.getCallSign());
        event.put("vehicleType", vehicle.getVehicleType().name());
        event.put("latitude", vehicle.getLatitude());
        event.put("longitude", vehicle.getLongitude());

        trackingHandler.broadcastEvent(event);
    }
}
