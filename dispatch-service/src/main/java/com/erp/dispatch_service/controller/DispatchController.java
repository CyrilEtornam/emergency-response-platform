package com.erp.dispatch_service.controller;

import com.erp.dispatch_service.dto.DispatchRequest;
import com.erp.dispatch_service.dto.DispatchResponse;
import com.erp.dispatch_service.service.DispatchService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/dispatches")
@RequiredArgsConstructor
public class DispatchController {

    private final DispatchService service;

    @GetMapping
    public ResponseEntity<List<DispatchResponse>> list(
            @RequestParam(required = false) UUID incidentId) {
        return ResponseEntity.ok(service.getAll(incidentId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DispatchResponse> get(@PathVariable UUID id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    public ResponseEntity<DispatchResponse> create(@Valid @RequestBody DispatchRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(req));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<DispatchResponse> updateStatus(
            @PathVariable UUID id,
            @RequestParam String status) {
        return ResponseEntity.ok(service.updateStatus(id, status));
    }
}
