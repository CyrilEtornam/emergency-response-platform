package com.erp.incident_service.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "incidents")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Incident {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 50)
    @Enumerated(EnumType.STRING)
    private IncidentType type;

    @Column(nullable = false, length = 50)
    @Enumerated(EnumType.STRING)
    private IncidentSeverity severity;

    @Column(nullable = false, length = 50)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private IncidentStatus status = IncidentStatus.REPORTED;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column(length = 512)
    private String address;

    @Column(name = "reported_by")
    private String reportedBy;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private Instant updatedAt;

    public enum IncidentType   { MEDICAL, POLICE, FIRE }
    public enum IncidentSeverity { LOW, MEDIUM, HIGH, CRITICAL }
    public enum IncidentStatus { REPORTED, ASSIGNED, EN_ROUTE, RESOLVED }
}
