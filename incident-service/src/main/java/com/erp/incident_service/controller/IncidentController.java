package com.erp.incident_service.controller;

import com.erp.incident_service.dto.IncidentRequest;
import com.erp.incident_service.dto.IncidentResponse;
import com.erp.incident_service.service.IncidentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/incidents")
@RequiredArgsConstructor
public class IncidentController {

    private final IncidentService service;

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

    @PatchMapping("/{id}/resolve")
    public ResponseEntity<IncidentResponse> resolve(@PathVariable UUID id) {
        return ResponseEntity.ok(service.resolve(id));
    }
}
