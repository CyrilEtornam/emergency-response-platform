package com.erp.incident_service.repository;

import com.erp.incident_service.model.Incident;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface IncidentRepository extends JpaRepository<Incident, UUID> {
    List<Incident> findByTypeOrderByCreatedAtDesc(Incident.IncidentType type);
    List<Incident> findAllByOrderByCreatedAtDesc();
}
