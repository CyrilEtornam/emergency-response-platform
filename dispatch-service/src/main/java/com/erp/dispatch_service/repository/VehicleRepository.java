package com.erp.dispatch_service.repository;

import com.erp.dispatch_service.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, UUID> {
    List<Vehicle> findByAgencyOrderByCallSignAsc(Vehicle.Agency agency);
    List<Vehicle> findAllByOrderByAgencyAscCallSignAsc();
}
