package com.erp.incident_service.dto;

import com.erp.incident_service.model.Incident;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Data @Builder
public class IncidentResponse {
    private UUID id;
    private Incident.IncidentType type;
    private Incident.IncidentSeverity severity;
    private Incident.IncidentStatus status;
    private String description;
    private Double latitude;
    private Double longitude;
    private String address;
    private String vehicleId;
    private String reportedBy;
    private Instant createdAt;
    private Instant updatedAt;

    public static IncidentResponse from(Incident i) {
        return IncidentResponse.builder()
                .id(i.getId())
                .type(i.getType())
                .severity(i.getSeverity())
                .status(i.getStatus())
                .description(i.getDescription())
                .latitude(i.getLatitude())
                .longitude(i.getLongitude())
                .address(i.getAddress())
                .vehicleId(i.getVehicleId())
                .reportedBy(i.getReportedBy())
                .createdAt(i.getCreatedAt())
                .updatedAt(i.getUpdatedAt())
                .build();
    }
}
