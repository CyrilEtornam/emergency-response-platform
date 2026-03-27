package com.erp.dispatch_service.controller;

import com.erp.dispatch_service.dto.VehicleResponse;
import com.erp.dispatch_service.service.VehicleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/vehicles")
@RequiredArgsConstructor
public class VehicleController {

    private final VehicleService service;

    @GetMapping
    public ResponseEntity<List<VehicleResponse>> list(
            @RequestParam(required = false) String agency) {
        return ResponseEntity.ok(service.getAll(agency));
    }

    @GetMapping("/{id}")
    public ResponseEntity<VehicleResponse> get(@PathVariable UUID id) {
        return ResponseEntity.ok(service.getById(id));
    }
}
