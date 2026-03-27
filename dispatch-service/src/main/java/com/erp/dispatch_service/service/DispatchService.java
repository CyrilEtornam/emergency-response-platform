package com.erp.dispatch_service.service;

import com.erp.dispatch_service.dto.DispatchRequest;
import com.erp.dispatch_service.dto.DispatchResponse;
import com.erp.dispatch_service.model.Dispatch;
import com.erp.dispatch_service.model.Vehicle;
import com.erp.dispatch_service.repository.DispatchRepository;
import com.erp.dispatch_service.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DispatchService {

    private final DispatchRepository dispatchRepo;
    private final VehicleRepository vehicleRepo;

    public List<DispatchResponse> getAll(UUID incidentId) {
        if (incidentId != null) {
            return dispatchRepo.findByIncidentIdOrderByDispatchedAtDesc(incidentId)
                    .stream().map(DispatchResponse::from).toList();
        }
        return dispatchRepo.findAllByOrderByDispatchedAtDesc()
                .stream().map(DispatchResponse::from).toList();
    }

    public DispatchResponse getById(UUID id) {
        return dispatchRepo.findById(id)
                .map(DispatchResponse::from)
                .orElseThrow(() -> new RuntimeException("Dispatch not found: " + id));
    }

    @Transactional
    public DispatchResponse create(DispatchRequest req) {
        Vehicle vehicle = vehicleRepo.findById(req.getVehicleId())
                .orElseThrow(() -> new RuntimeException("Vehicle not found: " + req.getVehicleId()));

        vehicle.setStatus(Vehicle.VehicleStatus.EN_ROUTE);
        vehicleRepo.save(vehicle);

        Dispatch dispatch = Dispatch.builder()
                .incidentId(req.getIncidentId())
                .vehicleId(req.getVehicleId())
                .status(Dispatch.DispatchStatus.ASSIGNED)
                .notes(req.getNotes())
                .build();

        return DispatchResponse.from(dispatchRepo.save(dispatch));
    }

    @Transactional
    public DispatchResponse updateStatus(UUID id, String status) {
        Dispatch dispatch = dispatchRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Dispatch not found: " + id));

        Dispatch.DispatchStatus newStatus = Dispatch.DispatchStatus.valueOf(status.toUpperCase());
        dispatch.setStatus(newStatus);

        if (newStatus == Dispatch.DispatchStatus.COMPLETED) {
            dispatch.setCompletedAt(Instant.now());
            vehicleRepo.findById(dispatch.getVehicleId()).ifPresent(v -> {
                v.setStatus(Vehicle.VehicleStatus.AVAILABLE);
                vehicleRepo.save(v);
            });
        } else if (newStatus == Dispatch.DispatchStatus.EN_ROUTE) {
            vehicleRepo.findById(dispatch.getVehicleId()).ifPresent(v -> {
                v.setStatus(Vehicle.VehicleStatus.EN_ROUTE);
                vehicleRepo.save(v);
            });
        } else if (newStatus == Dispatch.DispatchStatus.ON_SCENE) {
            vehicleRepo.findById(dispatch.getVehicleId()).ifPresent(v -> {
                v.setStatus(Vehicle.VehicleStatus.ON_SCENE);
                vehicleRepo.save(v);
            });
        }

        return DispatchResponse.from(dispatchRepo.save(dispatch));
    }
}
