-- Add optional vehicle_id column to track which vehicle is assigned to an incident
ALTER TABLE incidents ADD COLUMN IF NOT EXISTS vehicle_id VARCHAR(255);
