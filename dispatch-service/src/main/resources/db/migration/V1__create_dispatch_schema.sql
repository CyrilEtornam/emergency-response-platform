CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS stations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agency VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL
);

CREATE TABLE IF NOT EXISTS vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agency VARCHAR(50) NOT NULL,
    vehicle_type VARCHAR(50) NOT NULL,
    call_sign VARCHAR(50) NOT NULL UNIQUE,
    status VARCHAR(50) NOT NULL DEFAULT 'AVAILABLE',
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    station_id UUID REFERENCES stations(id),
    last_updated TIMESTAMP
);

CREATE TABLE IF NOT EXISTS dispatches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    incident_id UUID NOT NULL,
    vehicle_id UUID NOT NULL REFERENCES vehicles(id),
    status VARCHAR(50) NOT NULL DEFAULT 'ASSIGNED',
    dispatched_at TIMESTAMP NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMP,
    notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_stations_agency ON stations(agency);
CREATE INDEX IF NOT EXISTS idx_vehicles_status ON vehicles(status);
CREATE INDEX IF NOT EXISTS idx_vehicles_station_id ON vehicles(station_id);
CREATE INDEX IF NOT EXISTS idx_dispatches_vehicle_id ON dispatches(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_dispatches_incident_id ON dispatches(incident_id);