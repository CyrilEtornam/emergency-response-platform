package com.erp.dispatch_service.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "vehicles")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 50)
    @Enumerated(EnumType.STRING)
    private Agency agency;

    @Column(name = "vehicle_type", nullable = false, length = 50)
    @Enumerated(EnumType.STRING)
    private VehicleType vehicleType;

    @Column(name = "call_sign", nullable = false, unique = true, length = 50)
    private String callSign;

    @Column(nullable = false, length = 50)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private VehicleStatus status = VehicleStatus.AVAILABLE;

    private Double latitude;
    private Double longitude;

    @Column(name = "station_id")
    private UUID stationId;

    @Column(name = "last_updated")
    private Instant lastUpdated;

    @PrePersist @PreUpdate
    void touch() { lastUpdated = Instant.now(); }

    public enum Agency       { MEDICAL, POLICE, FIRE }
    public enum VehicleType  { AMBULANCE, POLICE_CAR, FIRE_TRUCK }
    public enum VehicleStatus { AVAILABLE, EN_ROUTE, ON_SCENE, OFFLINE, MAINTENANCE }
}
