package com.erp.dispatch_service.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class DispatchRequest {
    @NotNull
    private UUID incidentId;
    @NotNull
    private UUID vehicleId;
    private String notes;
}
