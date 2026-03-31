package com.erp.incident_service.controller;

import com.erp.incident_service.dto.AssignResponderRequest;
import com.erp.incident_service.dto.ResponderWithDistanceDTO;
import com.erp.incident_service.service.ResponderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

/**
 * REST endpoints for responder management and assignment
 */
@RestController
@RequestMapping("/responders")
@RequiredArgsConstructor
public class ResponderController {

    private final ResponderService responderService;

    /**
     * GET /responders/nearest?lat={lat}&lng={lng}&type={type}
     * Returns top 3 nearest available responders of the specified type
     * Response: [{ id, name, type, latitude, longitude, availability, distanceKm }]
     */
    @GetMapping("/nearest")
    public ResponseEntity<List<ResponderWithDistanceDTO>> getNearestResponders(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam(required = false) String type) {
        return ResponseEntity.ok(responderService.findNearestResponders(lat, lng, type, 3));
    }

    /**
     * POST /responders/:id/assign
     * Assign a responder to an incident
     * Request: { incidentId: UUID, wasSuggested: boolean }
     */
    @PostMapping("/{id}/assign")
    public ResponseEntity<Void> assignResponder(
            @PathVariable UUID id,
            @RequestBody AssignResponderRequest request) {
        responderService.assignResponder(
                id,
                request.getIncidentId(),
                request.getWasSuggested() != null && request.getWasSuggested());
        return ResponseEntity.ok().build();
    }
}
