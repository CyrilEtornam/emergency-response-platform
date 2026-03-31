-- Create responders table for vehicle/team assignments
CREATE TYPE responder_type AS ENUM ('MEDICAL', 'POLICE', 'FIRE');
CREATE TYPE responder_availability AS ENUM ('AVAILABLE', 'BUSY', 'OFF_DUTY');

CREATE TABLE responders (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name          VARCHAR(255)           NOT NULL,
    type          responder_type         NOT NULL,
    latitude      DOUBLE PRECISION       NOT NULL,
    longitude     DOUBLE PRECISION       NOT NULL,
    availability  responder_availability NOT NULL DEFAULT 'AVAILABLE',
    vehicle_id    UUID,  -- Link to dispatch-service vehicle
    station_id    UUID,  -- Link to dispatch-service station
    created_at    TIMESTAMP              NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMP              NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_responders_type ON responders(type);
CREATE INDEX idx_responders_availability ON responders(availability);
CREATE INDEX idx_responders_type_availability ON responders(type, availability);

-- Link table for incident assignments
CREATE TABLE incident_assignments (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    incident_id     UUID NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
    responder_id    UUID NOT NULL REFERENCES responders(id) ON DELETE CASCADE,
    was_suggested   BOOLEAN NOT NULL DEFAULT FALSE,
    assigned_at     TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(incident_id, responder_id)
);

CREATE INDEX idx_incident_assignments_incident ON incident_assignments(incident_id);
CREATE INDEX idx_incident_assignments_responder ON incident_assignments(responder_id);
