package com.erp.dispatch_service.dto;

import com.erp.dispatch_service.model.Vehicle;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Data @Builder
public class VehicleResponse {
    private UUID id;
    private String agency;
    private String vehicleType;
    private String callSign;
    private String status;
    private Double latitude;
    private Double longitude;
    private UUID stationId;
    private Instant lastUpdated;

    public static VehicleResponse from(Vehicle v) {
        return VehicleResponse.builder()
                .id(v.getId())
                .agency(v.getAgency().name())
                .vehicleType(v.getVehicleType().name())
                .callSign(v.getCallSign())
                .status(v.getStatus().name())
                .latitude(v.getLatitude())
                .longitude(v.getLongitude())
                .stationId(v.getStationId())
                .lastUpdated(v.getLastUpdated())
                .build();
    }
}
