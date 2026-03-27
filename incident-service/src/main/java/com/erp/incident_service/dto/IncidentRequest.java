package com.erp.incident_service.dto;

import com.erp.incident_service.model.Incident;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class IncidentRequest {
    @NotNull
    private Incident.IncidentType type;

    @NotNull
    private Incident.IncidentSeverity severity;

    @NotBlank
    private String description;

    @NotNull
    private Double latitude;

    @NotNull
    private Double longitude;

    private String address;
}
