package com.erp.dispatch_service.controller;

import com.erp.dispatch_service.dto.DispatchRequest;
import com.erp.dispatch_service.dto.DispatchResponse;
import com.erp.dispatch_service.model.Vehicle;
import com.erp.dispatch_service.repository.VehicleRepository;
import com.erp.dispatch_service.service.DispatchService;
import com.erp.dispatch_service.service.SimulationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/dispatches")
public class DispatchController {

    private final DispatchService service;
    private final VehicleRepository vehicleRepository;
    private final SimulationService simulationService;

    public DispatchController(DispatchService service,
                              VehicleRepository vehicleRepository,
                              SimulationService simulationService) {
        this.service = service;
        this.vehicleRepository = vehicleRepository;
        this.simulationService = simulationService;
    }

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

    /** Demo: pick the first available vehicle and simulate it driving to (lat, lng). */
    @PostMapping("/simulate")
    public ResponseEntity<?> simulate(
            @RequestParam double lat,
            @RequestParam double lng) {
        Optional<Vehicle> opt = vehicleRepository.findFirstByStatusOrderByCallSignAsc(Vehicle.VehicleStatus.AVAILABLE);
        if (opt.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        Vehicle vehicle = opt.get();
        double startLat = vehicle.getLatitude()  != null ? vehicle.getLatitude()  : 5.55;
        double startLng = vehicle.getLongitude() != null ? vehicle.getLongitude() : -0.20;
        vehicle.setStatus(Vehicle.VehicleStatus.EN_ROUTE);
        vehicleRepository.save(vehicle);
        simulationService.register(vehicle.getId(), startLat, startLng, lat, lng);
        return ResponseEntity.ok(Map.of(
                "vehicleId", vehicle.getId().toString(),
                "callSign",  vehicle.getCallSign(),
                "status",    "EN_ROUTE"
        ));
    }
}
