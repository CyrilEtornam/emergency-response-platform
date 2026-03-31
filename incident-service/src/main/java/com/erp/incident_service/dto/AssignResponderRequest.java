package com.erp.incident_service.dto;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssignResponderRequest {
    private UUID incidentId;
    private Boolean wasSuggested = false;
}
