-- ════════════════════════════════════════════════════════════════════════════════
-- V4__seed_dispatches.sql
-- Create historical dispatch records linking vehicles to resolved incidents
-- ════════════════════════════════════════════════════════════════════════════════

-- Note: This seed creates ~75 dispatch records for RESOLVED, EN_ROUTE, and ASSIGNED incidents
-- It links vehicles to incidents based on matching agency types and regions
-- Since incident_id references the incident-service DB, we use placeholder UUIDs
-- In production, these would be synced via API or event messaging

DO $$
DECLARE
    v_vehicle_id UUID;
    v_base_time TIMESTAMP;
    v_arrival_time TIMESTAMP;
    v_completion_time TIMESTAMP;
BEGIN

    -- ═══════════════════════════════════════════════════════════════════════════
    -- GREATER ACCRA DISPATCHES (25 records)
    -- ═══════════════════════════════════════════════════════════════════════════

    -- Medical dispatches (10)
    SELECT id INTO v_vehicle_id FROM vehicles WHERE call_sign = 'AMB-GA-01' LIMIT 1;
    v_base_time := NOW() - INTERVAL '55 days';
    INSERT INTO dispatches (incident_id, vehicle_id, status, dispatched_at, completed_at, notes)
    VALUES (
        gen_random_uuid(),  -- Placeholder for incident ID
        v_vehicle_id,
        'COMPLETED',
        v_base_time + INTERVAL '3 minutes',
        v_base_time + INTERVAL '31 minutes',
        'Patient transported to Korle Bu Emergency Ward'
    );

    SELECT id INTO v_vehicle_id FROM vehicles WHERE call_sign = 'AMB-GA-02' LIMIT 1;
    v_base_time := NOW() - INTERVAL '48 days';
    INSERT INTO dispatches (incident_id, vehicle_id, status, dispatched_at, completed_at, notes)
    VALUES (
        gen_random_uuid(),
        v_vehicle_id,
        'COMPLETED',
        v_base_time + INTERVAL '2 minutes',
        v_base_time + INTERVAL '37 minutes',
        'Multiple casualties transported to 37 Military Hospital'
    );

    SELECT id INTO v_vehicle_id FROM vehicles WHERE call_sign = 'AMB-GA-03' LIMIT 1;
    v_base_time := NOW() - INTERVAL '42 days';
    INSERT INTO dispatches (incident_id, vehicle_id, status, dispatched_at, completed_at, notes)
    VALUES (
        gen_random_uuid(),
        v_vehicle_id,
        'COMPLETED',
        v_base_time + INTERVAL '1 minute',
        v_base_time + INTERVAL '19 minutes',
        'Safe delivery en route, mother and baby stable'
    );

    SELECT id INTO v_vehicle_id FROM vehicles WHERE call_sign = 'AMB-GA-01' LIMIT 1;
    v_base_time := NOW() - INTERVAL '38 days';
    INSERT INTO dispatches (incident_id, vehicle_id, status, dispatched_at, completed_at, notes)
    VALUES (
        gen_random_uuid(),
        v_vehicle_id,
        'COMPLETED',
        v_base_time + INTERVAL '4 minutes',
        v_base_time + INTERVAL '26 minutes',
        'Child treated and transported to Ridge Hospital'
    );

    SELECT id INTO v_vehicle_id FROM vehicles WHERE call_sign = 'AMB-GA-04' LIMIT 1;
    v_base_time := NOW() - INTERVAL '2 hours';
    INSERT INTO dispatches (incident_id, vehicle_id, status, dispatched_at, completed_at, notes)
    VALUES (
        gen_random_uuid(),
        v_vehicle_id,
        'EN_ROUTE',
        v_base_time + INTERVAL '3 minutes',
        NULL,
        'Responding to chest pain emergency'
    );

    SELECT id INTO v_vehicle_id FROM vehicles WHERE call_sign = 'AMB-GA-05' LIMIT 1;
    v_base_time := NOW() - INTERVAL '45 minutes';
    INSERT INTO dispatches (incident_id, vehicle_id, status, dispatched_at, completed_at, notes)
    VALUES (
        gen_random_uuid(),
        v_vehicle_id,
        'ASSIGNED',
        v_base_time + INTERVAL '2 minutes',
        NULL,
        'Crew preparing to depart'
    );

    SELECT id INTO v_vehicle_id FROM vehicles WHERE call_sign = 'AMB-GA-02' LIMIT 1;
    v_base_time := NOW() - INTERVAL '30 days';
    INSERT INTO dispatches (incident_id, vehicle_id, status, dispatched_at, completed_at, notes)
    VALUES (
        gen_random_uuid(),
        v_vehicle_id,
        'COMPLETED',
        v_base_time + INTERVAL '2 minutes',
        v_base_time + INTERVAL '34 minutes',
        'Motorcycle accident victim transported to Tema Hospital'
    );

    SELECT id INTO v_vehicle_id FROM vehicles WHERE call_sign = 'AMB-GA-03' LIMIT 1;
    v_base_time := NOW() - INTERVAL '25 days';
    INSERT INTO dispatches (incident_id, vehicle_id, status, dispatched_at, completed_at, notes)
    VALUES (
        gen_random_uuid(),
        v_vehicle_id,
        'COMPLETED',
        v_base_time + INTERVAL '3 minutes',
        v_base_time + INTERVAL '23 minutes',
        'Diabetic emergency stabilized and transported'
    );

    SELECT id INTO v_vehicle_id FROM vehicles WHERE call_sign = 'AMB-GA-01' LIMIT 1;
    v_base_time := NOW() - INTERVAL '18 days';
    INSERT INTO dispatches (incident_id, vehicle_id, status, dispatched_at, completed_at, notes)
    VALUES (
        gen_random_uuid(),
        v_vehicle_id,
        'COMPLETED',
        v_base_time + INTERVAL '4 minutes',
        v_base_time + INTERVAL '30 minutes',
        'Head injury victim transported to Korle Bu Neurosurgery'
    );

    -- Police dispatches (9)
    SELECT id INTO v_vehicle_id FROM vehicles WHERE call_sign = 'POL-GA-01' LIMIT 1;
    v_base_time := NOW() - INTERVAL '57 days';
    INSERT INTO dispatches (incident_id, vehicle_id, status, dispatched_at, completed_at, notes)
    VALUES (
        gen_random_uuid(),
        v_vehicle_id,
        'COMPLETED',
        v_base_time + INTERVAL '5 minutes',
        v_base_time + INTERVAL '47 minutes',
        'Suspects apprehended, scene secured'
    );

    SELECT id INTO v_vehicle_id FROM vehicles WHERE call_sign = 'POL-GA-02' LIMIT 1;
    v_base_time := NOW() - INTERVAL '54 days';
    INSERT INTO dispatches (incident_id, vehicle_id, status, dispatched_at, completed_at, notes)
    VALUES (
        gen_random_uuid(),
        v_vehicle_id,
        'COMPLETED',
        v_base_time + INTERVAL '3 minutes',
        v_base_time + INTERVAL '28 minutes',
        'Armed suspect arrested, weapon recovered'
    );

    SELECT id INTO v_vehicle_id FROM vehicles WHERE call_sign = 'POL-GA-03' LIMIT 1;
    v_base_time := NOW() - INTERVAL '50 days';
    INSERT INTO dispatches (incident_id, vehicle_id, status, dispatched_at, completed_at, notes)
    VALUES (
        gen_random_uuid(),
        v_vehicle_id,
        'COMPLETED',
        v_base_time + INTERVAL '6 minutes',
        v_base_time + INTERVAL '41 minutes',
        'Theft report taken, investigation ongoing'
    );

    SELECT id INTO v_vehicle_id FROM vehicles WHERE call_sign = 'POL-GA-04' LIMIT 1;
    v_base_time := NOW() - INTERVAL '45 days';
    INSERT INTO dispatches (incident_id, vehicle_id, status, dispatched_at, completed_at, notes)
    VALUES (
        gen_random_uuid(),
        v_vehicle_id,
        'COMPLETED',
        v_base_time + INTERVAL '4 minutes',
        v_base_time + INTERVAL '24 minutes',
        'Traffic accident scene secured, ambulance called'
    );

    SELECT id INTO v_vehicle_id FROM vehicles WHERE call_sign = 'POL-GA-01' LIMIT 1;
    v_base_time := NOW() - INTERVAL '3 hours';
    INSERT INTO dispatches (incident_id, vehicle_id, status, dispatched_at, completed_at, notes)
    VALUES (
        gen_random_uuid(),
        v_vehicle_id,
        'EN_ROUTE',
        v_base_time + INTERVAL '5 minutes',
        NULL,
        'Responding to domestic disturbance'
    );

    SELECT id INTO v_vehicle_id FROM vehicles WHERE call_sign = 'POL-GA-02' LIMIT 1;
    v_base_time := NOW() - INTERVAL '90 minutes';
    INSERT INTO dispatches (incident_id, vehicle_id, status, dispatched_at, completed_at, notes)
    VALUES (
        gen_random_uuid(),
        v_vehicle_id,
        'ASSIGNED',
        v_base_time + INTERVAL '4 minutes',
        NULL,
        'Unit dispatched to break-in scene'
    );

    SELECT id INTO v_vehicle_id FROM vehicles WHERE call_sign = 'POL-GA-03' LIMIT 1;
    v_base_time := NOW() - INTERVAL '39 days';
    INSERT INTO dispatches (incident_id, vehicle_id, status, dispatched_at, completed_at, notes)
    VALUES (
        gen_random_uuid(),
        v_vehicle_id,
        'COMPLETED',
        v_base_time + INTERVAL '5 minutes',
        v_base_time + INTERVAL '33 minutes',
        'Shoplifter detained, handed to CID'
    );

    SELECT id INTO v_vehicle_id FROM vehicles WHERE call_sign = 'POL-GA-04' LIMIT 1;
    v_base_time := NOW() - INTERVAL '31 days';
    INSERT INTO dispatches (incident_id, vehicle_id, status, dispatched_at, completed_at, notes)
    VALUES (
        gen_random_uuid(),
        v_vehicle_id,
        'COMPLETED',
        v_base_time + INTERVAL '6 minutes',
        v_base_time + INTERVAL '38 minutes',
        'Assault victim transported to hospital, suspect arrested'
    );

    -- Fire dispatches (6)
    SELECT id INTO v_vehicle_id FROM vehicles WHERE call_sign = 'FIR-GA-01' LIMIT 1;
    v_base_time := NOW() - INTERVAL '55 days';
    INSERT INTO dispatches (incident_id, vehicle_id, status, dispatched_at, completed_at, notes)
    VALUES (
        gen_random_uuid(),
        v_vehicle_id,
        'COMPLETED',
        v_base_time + INTERVAL '4 minutes',
        v_base_time + INTERVAL '69 minutes',
        'Market fire contained, 8 kiosks affected'
    );

    SELECT id INTO v_vehicle_id FROM vehicles WHERE call_sign = 'FIR-GA-02' LIMIT 1;
    v_base_time := NOW() - INTERVAL '50 days';
    INSERT INTO dispatches (incident_id, vehicle_id, status, dispatched_at, completed_at, notes)
    VALUES (
        gen_random_uuid(),
        v_vehicle_id,
        'COMPLETED',
        v_base_time + INTERVAL '3 minutes',
        v_base_time + INTERVAL '51 minutes',
        'Electrical fire extinguished, shop damaged'
    );

    SELECT id INTO v_vehicle_id FROM vehicles WHERE call_sign = 'FIR-GA-03' LIMIT 1;
    v_base_time := NOW() - INTERVAL '46 days';
    INSERT INTO dispatches (incident_id, vehicle_id, status, dispatched_at, completed_at, notes)
    VALUES (
        gen_random_uuid(),
        v_vehicle_id,
        'COMPLETED',
        v_base_time + INTERVAL '5 minutes',
        v_base_time + INTERVAL '60 minutes',
        'House fire extinguished, 2 residents evacuated safely'
    );

    SELECT id INTO v_vehicle_id FROM vehicles WHERE call_sign = 'FIR-GA-04' LIMIT 1;
    v_base_time := NOW() - INTERVAL '42 days';
    INSERT INTO dispatches (incident_id, vehicle_id, status, dispatched_at, completed_at, notes)
    VALUES (
        gen_random_uuid(),
        v_vehicle_id,
        'COMPLETED',
        v_base_time + INTERVAL '4 minutes',
        v_base_time + INTERVAL '42 minutes',
        'Gas explosion contained, casualties transported by ambulance'
    );

    SELECT id INTO v_vehicle_id FROM vehicles WHERE call_sign = 'FIR-GA-01' LIMIT 1;
    v_base_time := NOW() - INTERVAL '6 hours';
    INSERT INTO dispatches (incident_id, vehicle_id, status, dispatched_at, completed_at, notes)
    VALUES (
        gen_random_uuid(),
        v_vehicle_id,
        'EN_ROUTE',
        v_base_time + INTERVAL '3 minutes',
        NULL,
        'Responding to kitchen fire'
    );

    -- ═══════════════════════════════════════════════════════════════════════════
    -- ASHANTI DISPATCHES (20 records)
    -- ═══════════════════════════════════════════════════════════════════════════

    -- Medical dispatches (8)
    SELECT id INTO v_vehicle_id FROM vehicles WHERE call_sign = 'AMB-AS-01' LIMIT 1;
    v_base_time := NOW() - INTERVAL '50 days';
    INSERT INTO dispatches (incident_id, vehicle_id, status, dispatched_at, completed_at, notes)
    VALUES (
        gen_random_uuid(),
        v_vehicle_id,
        'COMPLETED',
        v_base_time + INTERVAL '3 minutes',
        v_base_time + INTERVAL '25 minutes',
        'Burn victim transported to KATH burns unit'
    );

    SELECT id INTO v_vehicle_id FROM vehicles WHERE call_sign = 'AMB-AS-02' LIMIT 1;
    v_base_time := NOW() - INTERVAL '44 days';
    INSERT INTO dispatches (incident_id, vehicle_id, status, dispatched_at, completed_at, notes)
    VALUES (
        gen_random_uuid(),
        v_vehicle_id,
        'COMPLETED',
        v_base_time + INTERVAL '4 minutes',
        v_base_time + INTERVAL '32 minutes',
        'Motorcycle collision victim transported'
    );

    SELECT id INTO v_vehicle_id FROM vehicles WHERE call_sign = 'AMB-AS-03' LIMIT 1;
    v_base_time := NOW() - INTERVAL '36 days';
    INSERT INTO dispatches (incident_id, vehicle_id, status, dispatched_at, completed_at, notes)
    VALUES (
        gen_random_uuid(),
        v_vehicle_id,
        'COMPLETED',
        v_base_time + INTERVAL '2 minutes',
        v_base_time + INTERVAL '26 minutes',
        'Maternity emergency, delivered en route to KATH'
    );

    SELECT id INTO v_vehicle_id FROM vehicles WHERE call_sign = 'AMB-AS-04' LIMIT 1;
    v_base_time := NOW() - INTERVAL '3 hours';
    INSERT INTO dispatches (incident_id, vehicle_id, status, dispatched_at, completed_at, notes)
    VALUES (
        gen_random_uuid(),
        v_vehicle_id,
        'EN_ROUTE',
        v_base_time + INTERVAL '5 minutes',
        NULL,
        'Responding to stroke patient'
    );

    SELECT id INTO v_vehicle_id FROM vehicles WHERE call_sign = 'AMB-AS-01' LIMIT 1;
    v_base_time := NOW() - INTERVAL '28 days';
    INSERT INTO dispatches (incident_id, vehicle_id, status, dispatched_at, completed_at, notes)
    VALUES (
        gen_random_uuid(),
        v_vehicle_id,
        'COMPLETED',
        v_base_time + INTERVAL '3 minutes',
        v_base_time + INTERVAL '21 minutes',
        'Child respiratory distress treated and transported'
    );

    SELECT id INTO v_vehicle_id FROM vehicles WHERE call_sign = 'AMB-AS-02' LIMIT 1;
    v_base_time := NOW() - INTERVAL '20 days';
    INSERT INTO dispatches (incident_id, vehicle_id, status, dispatched_at, completed_at, notes)
    VALUES (
        gen_random_uuid(),
        v_vehicle_id,
        'COMPLETED',
        v_base_time + INTERVAL '8 minutes',
        v_base_time + INTERVAL '38 minutes',
        'Minor injury from KNUST campus'
    );

    SELECT id INTO v_vehicle_id FROM vehicles WHERE call_sign = 'AMB-AS-03' LIMIT 1;
    v_base_time := NOW() - INTERVAL '15 days';
    INSERT INTO dispatches (incident_id, vehicle_id, status, dispatched_at, completed_at, notes)
    VALUES (
        gen_random_uuid(),
        v_vehicle_id,
        'COMPLETED',
        v_base_time + INTERVAL '2 minutes',
        v_base_time + INTERVAL '22 minutes',
        'Stabbing victim transported to KATH emergency surgery'
    );

    SELECT id INTO v_vehicle_id FROM vehicles WHERE call_sign = 'AMB-AS-04' LIMIT 1;
    v_base_time := NOW() - INTERVAL '1 hour';
    INSERT INTO dispatches (incident_id, vehicle_id, status, dispatched_at, completed_at, notes)
    VALUES (
        gen_random_uuid(),
        v_vehicle_id,
        'ASSIGNED',
        v_base_time + INTERVAL '3 minutes',
        NULL,
        'Crew preparing for elderly fall response'
    );

    -- Police dispatches (7)
    SELECT id INTO v_vehicle_id FROM vehicles WHERE call_sign = 'POL-AS-01' LIMIT 1;
    v_base_time := NOW() - INTERVAL '56 days';
    INSERT INTO dispatches (incident_id, vehicle_id, status, dispatched_at, completed_at, notes)
    VALUES (
        gen_random_uuid(),
        v_vehicle_id,
        'COMPLETED',
        v_base_time + INTERVAL '4 minutes',
        v_base_time + INTERVAL '26 minutes',
        'Armed robbery suspects arrested at Adum'
    );

    SELECT id INTO v_vehicle_id FROM vehicles WHERE call_sign = 'POL-AS-02' LIMIT 1;
    v_base_time := NOW() - INTERVAL '53 days';
    INSERT INTO dispatches (incident_id, vehicle_id, status, dispatched_at, completed_at, notes)
    VALUES (
        gen_random_uuid(),
        v_vehicle_id,
        'COMPLETED',
        v_base_time + INTERVAL '3 minutes',
        v_base_time + INTERVAL '21 minutes',
        'Market brawl dispersed, 3 arrests made'
    );

    SELECT id INTO v_vehicle_id FROM vehicles WHERE call_sign = 'POL-AS-03' LIMIT 1;
    v_base_time := NOW() - INTERVAL '48 days';
    INSERT INTO dispatches (incident_id, vehicle_id, status, dispatched_at, completed_at, notes)
    VALUES (
        gen_random_uuid(),
        v_vehicle_id,
        'COMPLETED',
        v_base_time + INTERVAL '10 minutes',
        v_base_time + INTERVAL '55 minutes',
        'Vehicle theft investigation completed'
    );

    SELECT id INTO v_vehicle_id FROM vehicles WHERE call_sign = 'POL-AS-01' LIMIT 1;
    v_base_time := NOW() - INTERVAL '4 hours';
    INSERT INTO dispatches (incident_id, vehicle_id, status, dispatched_at, completed_at, notes)
    VALUES (
        gen_random_uuid(),
        v_vehicle_id,
        'EN_ROUTE',
        v_base_time + INTERVAL '4 minutes',
        NULL,
        'Responding to armed men report at Santasi'
    );

    SELECT id INTO v_vehicle_id FROM vehicles WHERE call_sign = 'POL-AS-02' LIMIT 1;
    v_base_time := NOW() - INTERVAL '37 days';
    INSERT INTO dispatches (incident_id, vehicle_id, status, dispatched_at, completed_at, notes)
    VALUES (
        gen_random_uuid(),
        v_vehicle_id,
        'COMPLETED',
        v_base_time + INTERVAL '7 minutes',
        v_base_time + INTERVAL '42 minutes',
        'Highway accident scene managed, traffic redirected'
    );

    SELECT id INTO v_vehicle_id FROM vehicles WHERE call_sign = 'POL-AS-03' LIMIT 1;
    v_base_time := NOW() - INTERVAL '2 hours';
    INSERT INTO dispatches (incident_id, vehicle_id, status, dispatched_at, completed_at, notes)
    VALUES (
        gen_random_uuid(),
        v_vehicle_id,
        'ASSIGNED',
        v_base_time + INTERVAL '5 minutes',
        NULL,
        'Unit responding to lost child report'
    );

    SELECT id INTO v_vehicle_id FROM vehicles WHERE call_sign = 'POL-AS-04' LIMIT 1;
    v_base_time := NOW() - INTERVAL '26 days';
    INSERT INTO dispatches (incident_id, vehicle_id, status, dispatched_at, completed_at, notes)
    VALUES (
        gen_random_uuid(),
        v_vehicle_id,
        'COMPLETED',
        v_base_time + INTERVAL '6 minutes',
        v_base_time + INTERVAL '36 minutes',
        'Domestic violence case handled, victim assisted'
    );

    -- Fire dispatches (5)
    SELECT id INTO v_vehicle_id FROM vehicles WHERE call_sign = 'FIR-AS-01' LIMIT 1;
    v_base_time := NOW() - INTERVAL '58 days';
    INSERT INTO dispatches (incident_id, vehicle_id, status, dispatched_at, completed_at, notes)
    VALUES (
        gen_random_uuid(),
        v_vehicle_id,
        'COMPLETED',
        v_base_time + INTERVAL '5 minutes',
        v_base_time + INTERVAL '95 minutes',
        'Major Kejetia Market fire contained, extensive damage'
    );

    SELECT id INTO v_vehicle_id FROM vehicles WHERE call_sign = 'FIR-AS-02' LIMIT 1;
    v_base_time := NOW() - INTERVAL '52 days';
    INSERT INTO dispatches (incident_id, vehicle_id, status, dispatched_at, completed_at, notes)
    VALUES (
        gen_random_uuid(),
        v_vehicle_id,
        'COMPLETED',
        v_base_time + INTERVAL '4 minutes',
        v_base_time + INTERVAL '59 minutes',
        'Commercial building fire extinguished at Adum'
    );

    SELECT id INTO v_vehicle_id FROM vehicles WHERE call_sign = 'FIR-AS-03' LIMIT 1;
    v_base_time := NOW() - INTERVAL '44 days';
    INSERT INTO dispatches (incident_id, vehicle_id, status, dispatched_at, completed_at, notes)
    VALUES (
        gen_random_uuid(),
        v_vehicle_id,
        'COMPLETED',
        v_base_time + INTERVAL '6 minutes',
        v_base_time + INTERVAL '46 minutes',
        'Kitchen fire extinguished at Manhyia'
    );

    SELECT id INTO v_vehicle_id FROM vehicles WHERE call_sign = 'FIR-AS-04' LIMIT 1;
    v_base_time := NOW() - INTERVAL '5 hours';
    INSERT INTO dispatches (incident_id, vehicle_id, status, dispatched_at, completed_at, notes)
    VALUES (
        gen_random_uuid(),
        v_vehicle_id,
        'EN_ROUTE',
        v_base_time + INTERVAL '4 minutes',
        NULL,
        'Responding to bushfire at Asokwa'
    );

    SELECT id INTO v_vehicle_id FROM vehicles WHERE call_sign = 'FIR-AS-01' LIMIT 1;
    v_base_time := NOW() - INTERVAL '37 days';
    INSERT INTO dispatches (incident_id, vehicle_id, status, dispatched_at, completed_at, notes)
    VALUES (
        gen_random_uuid(),
        v_vehicle_id,
        'COMPLETED',
        v_base_time + INTERVAL '7 minutes',
        v_base_time + INTERVAL '42 minutes',
        'Vehicle fire extinguished on highway'
    );

    -- ═══════════════════════════════════════════════════════════════════════════
    -- NORTHERN DISPATCHES (9 records)
    -- ═══════════════════════════════════════════════════════════════════════════

    -- Medical dispatches (4)
    SELECT id INTO v_vehicle_id FROM vehicles WHERE call_sign = 'AMB-NR-01' LIMIT 1;
    v_base_time := NOW() - INTERVAL '52 days';
    INSERT INTO dispatches (incident_id, vehicle_id, status, dispatched_at, completed_at, notes)
    VALUES (
        gen_random_uuid(),
        v_vehicle_id,
        'COMPLETED',
        v_base_time + INTERVAL '6 minutes',
        v_base_time + INTERVAL '41 minutes',
        'Dehydration patient rehydrated and transported'
    );

    SELECT id INTO v_vehicle_id FROM vehicles WHERE call_sign = 'AMB-NR-02' LIMIT 1;
    v_base_time := NOW() - INTERVAL '40 days';
    INSERT INTO dispatches (incident_id, vehicle_id, status, dispatched_at, completed_at, notes)
    VALUES (
        gen_random_uuid(),
        v_vehicle_id,
        'COMPLETED',
        v_base_time + INTERVAL '8 minutes',
        v_base_time + INTERVAL '50 minutes',
        'Highway accident victims transported to TTH'
    );

    SELECT id INTO v_vehicle_id FROM vehicles WHERE call_sign = 'AMB-NR-03' LIMIT 1;
    v_base_time := NOW() - INTERVAL '32 days';
    INSERT INTO dispatches (incident_id, vehicle_id, status, dispatched_at, completed_at, notes)
    VALUES (
        gen_random_uuid(),
        v_vehicle_id,
        'COMPLETED',
        v_base_time + INTERVAL '5 minutes',
        v_base_time + INTERVAL '30 minutes',
        'Maternity complication handled successfully'
    );

    -- Police dispatches (3)
    SELECT id INTO v_vehicle_id FROM vehicles WHERE call_sign = 'POL-NR-01' LIMIT 1;
    v_base_time := NOW() - INTERVAL '59 days';
    INSERT INTO dispatches (incident_id, vehicle_id, status, dispatched_at, completed_at, notes)
    VALUES (
        gen_random_uuid(),
        v_vehicle_id,
        'COMPLETED',
        v_base_time + INTERVAL '7 minutes',
        v_base_time + INTERVAL '45 minutes',
        'Motorcycle theft suspect arrested'
    );

    SELECT id INTO v_vehicle_id FROM vehicles WHERE call_sign = 'POL-NR-02' LIMIT 1;
    v_base_time := NOW() - INTERVAL '44 days';
    INSERT INTO dispatches (incident_id, vehicle_id, status, dispatched_at, completed_at, notes)
    VALUES (
        gen_random_uuid(),
        v_vehicle_id,
        'COMPLETED',
        v_base_time + INTERVAL '12 minutes',
        v_base_time + INTERVAL '62 minutes',
        'Land dispute mediated, parties separated'
    );

    -- Fire dispatches (2)
    SELECT id INTO v_vehicle_id FROM vehicles WHERE call_sign = 'FIR-NR-01' LIMIT 1;
    v_base_time := NOW() - INTERVAL '54 days';
    INSERT INTO dispatches (incident_id, vehicle_id, status, dispatched_at, completed_at, notes)
    VALUES (
        gen_random_uuid(),
        v_vehicle_id,
        'COMPLETED',
        v_base_time + INTERVAL '8 minutes',
        v_base_time + INTERVAL '78 minutes',
        'Market fire extinguished at Tamale Central'
    );

    SELECT id INTO v_vehicle_id FROM vehicles WHERE call_sign = 'FIR-NR-02' LIMIT 1;
    v_base_time := NOW() - INTERVAL '49 days';
    INSERT INTO dispatches (incident_id, vehicle_id, status, dispatched_at, completed_at, notes)
    VALUES (
        gen_random_uuid(),
        v_vehicle_id,
        'COMPLETED',
        v_base_time + INTERVAL '10 minutes',
        v_base_time + INTERVAL '95 minutes',
        'Bushfire contained before reaching settlement'
    );

    -- ═══════════════════════════════════════════════════════════════════════════
    -- REMAINING REGIONS DISPATCHES (21 records - covering Central, Western, Eastern, Volta)
    -- ═══════════════════════════════════════════════════════════════════════════

    -- Central Medical (3)
    SELECT id INTO v_vehicle_id FROM vehicles WHERE call_sign = 'AMB-CR-01' LIMIT 1;
    v_base_time := NOW() - INTERVAL '47 days';
    INSERT INTO dispatches (incident_id, vehicle_id, status, dispatched_at, completed_at, notes)
    VALUES (
        gen_random_uuid(),
        v_vehicle_id,
        'COMPLETED',
        v_base_time + INTERVAL '4 minutes',
        v_base_time + INTERVAL '19 minutes',
        'Drowning victim resuscitated and transported'
    );

    SELECT id INTO v_vehicle_id FROM vehicles WHERE call_sign = 'AMB-CR-02' LIMIT 1;
    v_base_time := NOW() - INTERVAL '35 days';
    INSERT INTO dispatches (incident_id, vehicle_id, status, dispatched_at, completed_at, notes)
    VALUES (
        gen_random_uuid(),
        v_vehicle_id,
        'COMPLETED',
        v_base_time + INTERVAL '6 minutes',
        v_base_time + INTERVAL '34 minutes',
        'Heat stroke patient treated and recovered'
    );

    SELECT id INTO v_vehicle_id FROM vehicles WHERE call_sign = 'AMB-CR-01' LIMIT 1;
    v_base_time := NOW() - INTERVAL '4 hours';
    INSERT INTO dispatches (incident_id, vehicle_id, status, dispatched_at, completed_at, notes)
    VALUES (
        gen_random_uuid(),
        v_vehicle_id,
        'EN_ROUTE',
        v_base_time + INTERVAL '5 minutes',
        NULL,
        'Responding to traffic accident at Swedru'
    );

    -- Central Police (3)
    SELECT id INTO v_vehicle_id FROM vehicles WHERE call_sign = 'POL-CR-01' LIMIT 1;
    v_base_time := NOW() - INTERVAL '52 days';
    INSERT INTO dispatches (incident_id, vehicle_id, status, dispatched_at, completed_at, notes)
    VALUES (
        gen_random_uuid(),
        v_vehicle_id,
        'COMPLETED',
        v_base_time + INTERVAL '6 minutes',
        v_base_time + INTERVAL '34 minutes',
        'Pickpocket apprehended at Cape Coast Castle'
    );

    SELECT id INTO v_vehicle_id FROM vehicles WHERE call_sign = 'POL-CR-02' LIMIT 1;
    v_base_time := NOW() - INTERVAL '40 days';
    INSERT INTO dispatches (incident_id, vehicle_id, status, dispatched_at, completed_at, notes)
    VALUES (
        gen_random_uuid(),
        v_vehicle_id,
        'COMPLETED',
        v_base_time + INTERVAL '5 minutes',
        v_base_time + INTERVAL '30 minutes',
        'Assault case handled at Winneba lorry station'
    );

    SELECT id INTO v_vehicle_id FROM vehicles WHERE call_sign = 'POL-CR-01' LIMIT 1;
    v_base_time := NOW() - INTERVAL '5 hours';
    INSERT INTO dispatches (incident_id, vehicle_id, status, dispatched_at, completed_at, notes)
    VALUES (
        gen_random_uuid(),
        v_vehicle_id,
        'EN_ROUTE',
        v_base_time + INTERVAL '7 minutes',
        NULL,
        'Responding to burglary report at Swedru'
    );

    -- Central Fire (2)
    SELECT id INTO v_vehicle_id FROM vehicles WHERE call_sign = 'FIR-CR-01' LIMIT 1;
    v_base_time := NOW() - INTERVAL '48 days';
    INSERT INTO dispatches (incident_id, vehicle_id, status, dispatched_at, completed_at, notes)
    VALUES (
        gen_random_uuid(),
        v_vehicle_id,
        'COMPLETED',
        v_base_time + INTERVAL '8 minutes',
        v_base_time + INTERVAL '53 minutes',
        'Shop fire extinguished at Cape Coast market'
    );

    SELECT id INTO v_vehicle_id FROM vehicles WHERE call_sign = 'FIR-CR-02' LIMIT 1;
    v_base_time := NOW() - INTERVAL '41 days';
    INSERT INTO dispatches (incident_id, vehicle_id, status, dispatched_at, completed_at, notes)
    VALUES (
        gen_random_uuid(),
        v_vehicle_id,
        'COMPLETED',
        v_base_time + INTERVAL '7 minutes',
        v_base_time + INTERVAL '57 minutes',
        'Electrical fire extinguished at Winneba'
    );

    -- Western Medical (3)
    SELECT id INTO v_vehicle_id FROM vehicles WHERE call_sign = 'AMB-WR-01' LIMIT 1;
    v_base_time := NOW() - INTERVAL '58 days';
    INSERT INTO dispatches (incident_id, vehicle_id, status, dispatched_at, completed_at, notes)
    VALUES (
        gen_random_uuid(),
        v_vehicle_id,
        'COMPLETED',
        v_base_time + INTERVAL '3 minutes',
        v_base_time + INTERVAL '21 minutes',
        'Industrial accident victim transported urgently'
    );

    SELECT id INTO v_vehicle_id FROM vehicles WHERE call_sign = 'AMB-WR-02' LIMIT 1;
    v_base_time := NOW() - INTERVAL '43 days';
    INSERT INTO dispatches (incident_id, vehicle_id, status, dispatched_at, completed_at, notes)
    VALUES (
        gen_random_uuid(),
        v_vehicle_id,
        'COMPLETED',
        v_base_time + INTERVAL '9 minutes',
        v_base_time + INTERVAL '47 minutes',
        'Motorcycle accident at mining area handled'
    );

    SELECT id INTO v_vehicle_id FROM vehicles WHERE call_sign = 'AMB-WR-01' LIMIT 1;
    v_base_time := NOW() - INTERVAL '27 days';
    INSERT INTO dispatches (incident_id, vehicle_id, status, dispatched_at, completed_at, notes)
    VALUES (
        gen_random_uuid(),
        v_vehicle_id,
        'COMPLETED',
        v_base_time + INTERVAL '4 minutes',
        v_base_time + INTERVAL '26 minutes',
        'Pregnancy emergency handled successfully'
    );

    -- Western Police (3)
    SELECT id INTO v_vehicle_id FROM vehicles WHERE call_sign = 'POL-WR-01' LIMIT 1;
    v_base_time := NOW() - INTERVAL '60 days';
    INSERT INTO dispatches (incident_id, vehicle_id, status, dispatched_at, completed_at, notes)
    VALUES (
        gen_random_uuid(),
        v_vehicle_id,
        'COMPLETED',
        v_base_time + INTERVAL '6 minutes',
        v_base_time + INTERVAL '38 minutes',
        'Armed robbery suspects arrested at Takoradi'
    );

    SELECT id INTO v_vehicle_id FROM vehicles WHERE call_sign = 'POL-WR-02' LIMIT 1;
    v_base_time := NOW() - INTERVAL '46 days';
    INSERT INTO dispatches (incident_id, vehicle_id, status, dispatched_at, completed_at, notes)
    VALUES (
        gen_random_uuid(),
        v_vehicle_id,
        'COMPLETED',
        v_base_time + INTERVAL '8 minutes',
        v_base_time + INTERVAL '48 minutes',
        'Vehicle accident scene secured at Tarkwa'
    );

    SELECT id INTO v_vehicle_id FROM vehicles WHERE call_sign = 'POL-WR-01' LIMIT 1;
    v_base_time := NOW() - INTERVAL '35 days';
    INSERT INTO dispatches (incident_id, vehicle_id, status, dispatched_at, completed_at, notes)
    VALUES (
        gen_random_uuid(),
        v_vehicle_id,
        'COMPLETED',
        v_base_time + INTERVAL '4 minutes',
        v_base_time + INTERVAL '24 minutes',
        'Violent altercation resolved at Sekondi harbor'
    );

    -- Western Fire (2)
    SELECT id INTO v_vehicle_id FROM vehicles WHERE call_sign = 'FIR-WR-01' LIMIT 1;
    v_base_time := NOW() - INTERVAL '56 days';
    INSERT INTO dispatches (incident_id, vehicle_id, status, dispatched_at, completed_at, notes)
    VALUES (
        gen_random_uuid(),
        v_vehicle_id,
        'COMPLETED',
        v_base_time + INTERVAL '6 minutes',
        v_base_time + INTERVAL '101 minutes',
        'Industrial warehouse fire extinguished at Takoradi'
    );

    SELECT id INTO v_vehicle_id FROM vehicles WHERE call_sign = 'FIR-WR-02' LIMIT 1;
    v_base_time := NOW() - INTERVAL '45 days';
    INSERT INTO dispatches (incident_id, vehicle_id, status, dispatched_at, completed_at, notes)
    VALUES (
        gen_random_uuid(),
        v_vehicle_id,
        'COMPLETED',
        v_base_time + INTERVAL '7 minutes',
        v_base_time + INTERVAL '49 minutes',
        'House fire extinguished at Tarkwa'
    );

    -- Eastern (3 total)
    SELECT id INTO v_vehicle_id FROM vehicles WHERE call_sign = 'AMB-ER-01' LIMIT 1;
    v_base_time := NOW() - INTERVAL '51 days';
    INSERT INTO dispatches (incident_id, vehicle_id, status, dispatched_at, completed_at, notes)
    VALUES (
        gen_random_uuid(),
        v_vehicle_id,
        'COMPLETED',
        v_base_time + INTERVAL '7 minutes',
        v_base_time + INTERVAL '39 minutes',
        'Bus accident casualties transported to Koforidua'
    );

    SELECT id INTO v_vehicle_id FROM vehicles WHERE call_sign = 'POL-ER-01' LIMIT 1;
    v_base_time := NOW() - INTERVAL '49 days';
    INSERT INTO dispatches (incident_id, vehicle_id, status, dispatched_at, completed_at, notes)
    VALUES (
        gen_random_uuid(),
        v_vehicle_id,
        'COMPLETED',
        v_base_time + INTERVAL '6 minutes',
        v_base_time + INTERVAL '41 minutes',
        'Theft investigation at Koforidua market'
    );

    SELECT id INTO v_vehicle_id FROM vehicles WHERE call_sign = 'FIR-ER-01' LIMIT 1;
    v_base_time := NOW() - INTERVAL '53 days';
    INSERT INTO dispatches (incident_id, vehicle_id, status, dispatched_at, completed_at, notes)
    VALUES (
        gen_random_uuid(),
        v_vehicle_id,
        'COMPLETED',
        v_base_time + INTERVAL '8 minutes',
        v_base_time + INTERVAL '68 minutes',
        'Market fire extinguished at Koforidua'
    );

    -- Volta (2 total)
    SELECT id INTO v_vehicle_id FROM vehicles WHERE call_sign = 'AMB-VR-01' LIMIT 1;
    v_base_time := NOW() - INTERVAL '46 days';
    INSERT INTO dispatches (incident_id, vehicle_id, status, dispatched_at, completed_at, notes)
    VALUES (
        gen_random_uuid(),
        v_vehicle_id,
        'COMPLETED',
        v_base_time + INTERVAL '5 minutes',
        v_base_time + INTERVAL '31 minutes',
        'Accident victim transported from Ho'
    );

    SELECT id INTO v_vehicle_id FROM vehicles WHERE call_sign = 'FIR-VR-01' LIMIT 1;
    v_base_time := NOW() - INTERVAL '47 days';
    INSERT INTO dispatches (incident_id, vehicle_id, status, dispatched_at, completed_at, notes)
    VALUES (
        gen_random_uuid(),
        v_vehicle_id,
        'COMPLETED',
        v_base_time + INTERVAL '10 minutes',
        v_base_time + INTERVAL '65 minutes',
        'Bushfire controlled near Ho farming area'
    );

END $$;

-- ════════════════════════════════════════════════════════════════════════════════
-- ANALYZE for query planner
-- ════════════════════════════════════════════════════════════════════════════════
ANALYZE dispatches;
