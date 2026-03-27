package com.erp.dispatch_service.dto;

import com.erp.dispatch_service.model.Dispatch;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Data @Builder
public class DispatchResponse {
    private UUID id;
    private UUID incidentId;
    private UUID vehicleId;
    private String status;
    private Instant dispatchedAt;
    private Instant completedAt;
    private String notes;

    public static DispatchResponse from(Dispatch d) {
        return DispatchResponse.builder()
                .id(d.getId())
                .incidentId(d.getIncidentId())
                .vehicleId(d.getVehicleId())
                .status(d.getStatus().name())
                .dispatchedAt(d.getDispatchedAt())
                .completedAt(d.getCompletedAt())
                .notes(d.getNotes())
                .build();
    }
}
