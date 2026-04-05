-- Add optional vehicle_id column to track which vehicle is assigned to an incident
DO $$
BEGIN
	IF EXISTS (
		SELECT 1
		FROM information_schema.tables
		WHERE table_schema = 'public' AND table_name = 'incidents'
	) THEN
		ALTER TABLE incidents ADD COLUMN IF NOT EXISTS vehicle_id VARCHAR(255);
	END IF;
END $$;
