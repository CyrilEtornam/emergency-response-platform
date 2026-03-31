package com.erp.incident_service.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "responders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Responder {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, length = 50)
    @Enumerated(EnumType.STRING)
    private ResponderType type;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column(nullable = false, length = 50)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ResponderAvailability availability = ResponderAvailability.AVAILABLE;

    @Column(name = "vehicle_id")
    private UUID vehicleId;

    @Column(name = "station_id")
    private UUID stationId;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;

    public enum ResponderType {
        MEDICAL, POLICE, FIRE
    }

    public enum ResponderAvailability {
        AVAILABLE, BUSY, OFF_DUTY
    }
}
