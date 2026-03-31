package com.erp.incident_service.dto;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResponderWithDistanceDTO {
    private UUID id;
    private String name;
    private String type;
    private Double latitude;
    private Double longitude;
    private String availability;
    private Double distanceKm;
}
