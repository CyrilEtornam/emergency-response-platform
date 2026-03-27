package com.erp.dispatch_service.dto;

import com.erp.dispatch_service.model.Station;
import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data @Builder
public class StationResponse {
    private UUID id;
    private String agency;
    private String name;
    private Double latitude;
    private Double longitude;

    public static StationResponse from(Station s) {
        return StationResponse.builder()
                .id(s.getId())
                .agency(s.getAgency().name())
                .name(s.getName())
                .latitude(s.getLatitude())
                .longitude(s.getLongitude())
                .build();
    }
}
