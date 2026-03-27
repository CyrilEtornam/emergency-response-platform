package com.erp.dispatch_service.service;

import com.erp.dispatch_service.dto.VehicleResponse;
import com.erp.dispatch_service.model.Vehicle;
import com.erp.dispatch_service.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class VehicleService {

    private final VehicleRepository repo;

    public List<VehicleResponse> getAll(String agency) {
        if (agency != null && !agency.isBlank()) {
            return repo.findByAgencyOrderByCallSignAsc(Vehicle.Agency.valueOf(agency.toUpperCase()))
                    .stream().map(VehicleResponse::from).toList();
        }
        return repo.findAllByOrderByAgencyAscCallSignAsc()
                .stream().map(VehicleResponse::from).toList();
    }

    public VehicleResponse getById(UUID id) {
        return repo.findById(id)
                .map(VehicleResponse::from)
                .orElseThrow(() -> new RuntimeException("Vehicle not found: " + id));
    }

    public List<Vehicle> getAllEntities() {
        return repo.findAllByOrderByAgencyAscCallSignAsc();
    }
}
