package com.erp.incident_service.service;

import com.erp.incident_service.dto.IncidentRequest;
import com.erp.incident_service.dto.IncidentResponse;
import com.erp.incident_service.model.Incident;
import com.erp.incident_service.repository.IncidentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class IncidentService {

    private final IncidentRepository repo;

    public List<IncidentResponse> getAll(String type) {
        List<Incident> incidents;
        if (type != null && !type.isBlank()) {
            incidents = repo.findByTypeOrderByCreatedAtDesc(Incident.IncidentType.valueOf(type.toUpperCase()));
        } else {
            incidents = repo.findAllByOrderByCreatedAtDesc();
        }
        return incidents.stream().map(IncidentResponse::from).toList();
    }

    public IncidentResponse getById(UUID id) {
        return repo.findById(id)
                .map(IncidentResponse::from)
                .orElseThrow(() -> new RuntimeException("Incident not found: " + id));
    }

    public IncidentResponse create(IncidentRequest req, String reportedBy) {
        Incident incident = Incident.builder()
                .type(req.getType())
                .severity(req.getSeverity())
                .description(req.getDescription())
                .latitude(req.getLatitude())
                .longitude(req.getLongitude())
                .address(req.getAddress())
                .reportedBy(reportedBy)
                .status(Incident.IncidentStatus.REPORTED)
                .build();
        return IncidentResponse.from(repo.save(incident));
    }

    public IncidentResponse update(UUID id, IncidentRequest req) {
        Incident incident = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Incident not found: " + id));
        incident.setType(req.getType());
        incident.setSeverity(req.getSeverity());
        incident.setDescription(req.getDescription());
        incident.setLatitude(req.getLatitude());
        incident.setLongitude(req.getLongitude());
        incident.setAddress(req.getAddress());
        return IncidentResponse.from(repo.save(incident));
    }

    public IncidentResponse resolve(UUID id) {
        Incident incident = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Incident not found: " + id));
        incident.setStatus(Incident.IncidentStatus.RESOLVED);
        return IncidentResponse.from(repo.save(incident));
    }
}
