package com.erp.incident_service.controller;

import com.erp.incident_service.dto.IncidentRequest;
import com.erp.incident_service.dto.IncidentResponse;
import com.erp.incident_service.dto.ResponderWithDistanceDTO;
import com.erp.incident_service.service.IncidentService;
import com.erp.incident_service.service.ResponderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/incidents")
@RequiredArgsConstructor
public class IncidentController {

    private final IncidentService service;
    private final ResponderService responderService;

    @GetMapping
    public ResponseEntity<List<IncidentResponse>> list(
            @RequestParam(required = false) String type) {
        return ResponseEntity.ok(service.getAll(type));
    }

    @GetMapping("/{id}")
    public ResponseEntity<IncidentResponse> get(@PathVariable UUID id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    public ResponseEntity<IncidentResponse> create(
            @Valid @RequestBody IncidentRequest req,
            @AuthenticationPrincipal UserDetails user) {
        String email = user != null ? user.getUsername() : "anonymous";
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(req, email));
    }

    @PutMapping("/{id}")
    public ResponseEntity<IncidentResponse> update(
            @PathVariable UUID id,
            @Valid @RequestBody IncidentRequest req) {
        return ResponseEntity.ok(service.update(id, req));
    }

    @PatchMapping("/{id}/assign")
    public ResponseEntity<IncidentResponse> assign(
            @PathVariable UUID id,
            @RequestBody(required = false) Map<String, String> body) {
        String vehicleId = body != null ? body.get("vehicleId") : null;
        return ResponseEntity.ok(service.assign(id, vehicleId));
    }

    @PatchMapping("/{id}/resolve")
    public ResponseEntity<IncidentResponse> resolve(@PathVariable UUID id) {
        return ResponseEntity.ok(service.resolve(id));
    }

    /**
     * GET /incidents/:id/suggested-responders
     * Returns top 3 nearest available responders for the incident
     */
    @GetMapping("/{id}/suggested-responders")
    public ResponseEntity<List<ResponderWithDistanceDTO>> getSuggestedResponders(@PathVariable UUID id) {
        return ResponseEntity.ok(responderService.getSuggestedResponders(id, 3));
    }

    /**
     * POST /incidents/:id/auto-dispatch
     * Finds the nearest available responder and assigns them automatically.
     * Returns the assigned responder with distance info.
     */
    @PostMapping("/{id}/auto-dispatch")
    public ResponseEntity<ResponderWithDistanceDTO> autoDispatch(@PathVariable UUID id) {
        return ResponseEntity.ok(responderService.autoDispatch(id));
    }
}
