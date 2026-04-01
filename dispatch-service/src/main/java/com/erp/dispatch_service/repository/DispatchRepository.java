package com.erp.dispatch_service.repository;

import com.erp.dispatch_service.model.Dispatch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface DispatchRepository extends JpaRepository<Dispatch, UUID> {
    List<Dispatch> findByIncidentIdOrderByDispatchedAtDesc(UUID incidentId);

    List<Dispatch> findAllByOrderByDispatchedAtDesc();

    Optional<Dispatch> findByVehicleIdAndStatusIn(UUID vehicleId, List<Dispatch.DispatchStatus> statuses);
}
