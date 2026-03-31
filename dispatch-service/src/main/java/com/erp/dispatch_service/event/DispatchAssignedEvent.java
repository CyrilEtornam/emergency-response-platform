package com.erp.dispatch_service.event;

import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
public class DispatchAssignedEvent {
    private String eventType;
    private Instant timestamp;
    private Payload payload;

    @Getter
    @Setter
    public static class Payload {
        private String dispatchId;
        private String incidentId;
        private String vehicleId;
        private String vehicleType;
        private String responderId;
        private Double incidentLatitude;
        private Double incidentLongitude;
    }
}
