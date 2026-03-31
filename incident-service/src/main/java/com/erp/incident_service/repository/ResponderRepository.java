package com.erp.incident_service.repository;

import com.erp.incident_service.model.Responder;
import com.erp.incident_service.model.Responder.ResponderAvailability;
import com.erp.incident_service.model.Responder.ResponderType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ResponderRepository extends JpaRepository<Responder, UUID> {

    List<Responder> findByTypeAndAvailability(ResponderType type, ResponderAvailability availability);

    List<Responder> findByAvailability(ResponderAvailability availability);
}
