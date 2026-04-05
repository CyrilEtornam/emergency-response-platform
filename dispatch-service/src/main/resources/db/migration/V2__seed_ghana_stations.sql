-- ════════════════════════════════════════════════════════════════════════════════
-- V2__seed_ghana_stations.sql
-- Populate dispatch_db.stations with real emergency facilities across Ghana
-- ════════════════════════════════════════════════════════════════════════════════

-- Delete existing data (vehicles first due to foreign key constraint)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'dispatches'
    ) THEN
        DELETE FROM dispatches;
    END IF;

    IF EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'vehicles'
    ) THEN
        DELETE FROM vehicles;
    END IF;

    IF EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'stations'
    ) THEN
        DELETE FROM stations;
    END IF;
END $$;

-- ─────────────────────────────────────────────────────────────────────────────────
-- GREATER ACCRA REGION
-- ─────────────────────────────────────────────────────────────────────────────────

-- MEDICAL
INSERT INTO stations (id, agency, name, latitude, longitude) VALUES
    (gen_random_uuid(), 'MEDICAL', 'Korle Bu Teaching Hospital', 5.5348, -0.2261),
    (gen_random_uuid(), 'MEDICAL', '37 Military Hospital', 5.5852, -0.1864),
    (gen_random_uuid(), 'MEDICAL', 'Ridge Hospital', 5.5571, -0.1973),
    (gen_random_uuid(), 'MEDICAL', 'Ga East Municipal Hospital', 5.6796, -0.1677),
    (gen_random_uuid(), 'MEDICAL', 'Tema General Hospital', 5.6698, -0.0166);

-- POLICE
INSERT INTO stations (id, agency, name, latitude, longitude) VALUES
    (gen_random_uuid(), 'POLICE', 'Ghana Police Service Headquarters', 5.5502, -0.2074),
    (gen_random_uuid(), 'POLICE', 'Greater Accra Regional Police Command', 5.5520, -0.2100),
    (gen_random_uuid(), 'POLICE', 'Accra Central Police Station', 5.5600, -0.2050),
    (gen_random_uuid(), 'POLICE', 'Madina Divisional Police Command', 5.6796, -0.1680),
    (gen_random_uuid(), 'POLICE', 'Tema Community 1 District Police Station', 5.6690, -0.0170);

-- FIRE
INSERT INTO stations (id, agency, name, latitude, longitude) VALUES
    (gen_random_uuid(), 'FIRE', 'Ghana National Fire Service Headquarters', 5.5571, -0.2010),
    (gen_random_uuid(), 'FIRE', 'Greater Accra Regional Fire Command', 5.5580, -0.2015),
    (gen_random_uuid(), 'FIRE', 'Makola Fire Station', 5.5570, -0.2025),
    (gen_random_uuid(), 'FIRE', 'Madina Fire Station', 5.6800, -0.1670),
    (gen_random_uuid(), 'FIRE', 'Tema Fire Station', 5.6700, -0.0180);

-- ─────────────────────────────────────────────────────────────────────────────────
-- ASHANTI REGION
-- ─────────────────────────────────────────────────────────────────────────────────

-- MEDICAL
INSERT INTO stations (id, agency, name, latitude, longitude) VALUES
    (gen_random_uuid(), 'MEDICAL', 'Komfo Anokye Teaching Hospital', 6.6885, -1.6244),
    (gen_random_uuid(), 'MEDICAL', 'Kumasi South Hospital', 6.6700, -1.6200),
    (gen_random_uuid(), 'MEDICAL', 'Manhyia Government Hospital', 6.7115, -1.6320),
    (gen_random_uuid(), 'MEDICAL', 'Okomfo Anokye Hospital Annexe', 6.6950, -1.6150);

-- POLICE
INSERT INTO stations (id, agency, name, latitude, longitude) VALUES
    (gen_random_uuid(), 'POLICE', 'Ashanti Regional Police Headquarters', 6.6959, -1.6286),
    (gen_random_uuid(), 'POLICE', 'Kumasi Central Police Station', 6.6923, -1.6269),
    (gen_random_uuid(), 'POLICE', 'Asokwa Divisional Police Command', 6.6700, -1.6100),
    (gen_random_uuid(), 'POLICE', 'Manhyia District Police Station', 6.7120, -1.6325);

-- FIRE
INSERT INTO stations (id, agency, name, latitude, longitude) VALUES
    (gen_random_uuid(), 'FIRE', 'Ashanti Regional Fire Service Command', 6.6960, -1.6280),
    (gen_random_uuid(), 'FIRE', 'Kumasi Central Fire Station', 6.6920, -1.6270),
    (gen_random_uuid(), 'FIRE', 'Asokwa Fire Station', 6.6710, -1.6110),
    (gen_random_uuid(), 'FIRE', 'Manhyia Fire Station', 6.7110, -1.6315);

-- ─────────────────────────────────────────────────────────────────────────────────
-- NORTHERN REGION
-- ─────────────────────────────────────────────────────────────────────────────────

-- MEDICAL
INSERT INTO stations (id, agency, name, latitude, longitude) VALUES
    (gen_random_uuid(), 'MEDICAL', 'Tamale Teaching Hospital', 9.4008, -0.8393),
    (gen_random_uuid(), 'MEDICAL', 'Tamale West Hospital', 9.3800, -0.8500),
    (gen_random_uuid(), 'MEDICAL', 'Tamale Central Hospital', 9.4100, -0.8300);

-- POLICE
INSERT INTO stations (id, agency, name, latitude, longitude) VALUES
    (gen_random_uuid(), 'POLICE', 'Northern Regional Police Headquarters', 9.4025, -0.8400),
    (gen_random_uuid(), 'POLICE', 'Tamale Central Police Station', 9.4050, -0.8380),
    (gen_random_uuid(), 'POLICE', 'Tamale District Police Command', 9.3950, -0.8420);

-- FIRE
INSERT INTO stations (id, agency, name, latitude, longitude) VALUES
    (gen_random_uuid(), 'FIRE', 'Northern Regional Fire Service Command', 9.4020, -0.8395),
    (gen_random_uuid(), 'FIRE', 'Tamale Central Fire Station', 9.4030, -0.8385),
    (gen_random_uuid(), 'FIRE', 'Tamale West Fire Station', 9.3850, -0.8480);

-- ─────────────────────────────────────────────────────────────────────────────────
-- CENTRAL REGION
-- ─────────────────────────────────────────────────────────────────────────────────

-- MEDICAL
INSERT INTO stations (id, agency, name, latitude, longitude) VALUES
    (gen_random_uuid(), 'MEDICAL', 'Cape Coast Teaching Hospital', 5.1053, -1.2465),
    (gen_random_uuid(), 'MEDICAL', 'Winneba Trauma and Specialist Hospital', 5.3510, -0.6237),
    (gen_random_uuid(), 'MEDICAL', 'Swedru Government Hospital', 5.5339, -0.7007);

-- POLICE
INSERT INTO stations (id, agency, name, latitude, longitude) VALUES
    (gen_random_uuid(), 'POLICE', 'Central Regional Police Headquarters', 5.1070, -1.2450),
    (gen_random_uuid(), 'POLICE', 'Cape Coast Police Station', 5.1060, -1.2470),
    (gen_random_uuid(), 'POLICE', 'Winneba District Police Command', 5.3520, -0.6240);

-- FIRE
INSERT INTO stations (id, agency, name, latitude, longitude) VALUES
    (gen_random_uuid(), 'FIRE', 'Central Regional Fire Service Command', 5.1055, -1.2460),
    (gen_random_uuid(), 'FIRE', 'Cape Coast Fire Station', 5.1050, -1.2475),
    (gen_random_uuid(), 'FIRE', 'Winneba Fire Station', 5.3515, -0.6230);

-- ─────────────────────────────────────────────────────────────────────────────────
-- WESTERN REGION
-- ─────────────────────────────────────────────────────────────────────────────────

-- MEDICAL
INSERT INTO stations (id, agency, name, latitude, longitude) VALUES
    (gen_random_uuid(), 'MEDICAL', 'Effia-Nkwanta Regional Hospital', 4.8990, -1.7547),
    (gen_random_uuid(), 'MEDICAL', 'Takoradi Hospital', 4.8845, -1.7554),
    (gen_random_uuid(), 'MEDICAL', 'Tarkwa Municipal Hospital', 5.2994, -1.9998);

-- POLICE
INSERT INTO stations (id, agency, name, latitude, longitude) VALUES
    (gen_random_uuid(), 'POLICE', 'Western Regional Police Headquarters', 4.8950, -1.7520),
    (gen_random_uuid(), 'POLICE', 'Takoradi Central Police Station', 4.8860, -1.7550),
    (gen_random_uuid(), 'POLICE', 'Tarkwa District Police Command', 5.3000, -2.0000);

-- FIRE
INSERT INTO stations (id, agency, name, latitude, longitude) VALUES
    (gen_random_uuid(), 'FIRE', 'Western Regional Fire Service Command', 4.8960, -1.7530),
    (gen_random_uuid(), 'FIRE', 'Takoradi Fire Station', 4.8850, -1.7560),
    (gen_random_uuid(), 'FIRE', 'Tarkwa Fire Station', 5.3005, -1.9990);

-- ─────────────────────────────────────────────────────────────────────────────────
-- EASTERN REGION
-- ─────────────────────────────────────────────────────────────────────────────────

-- MEDICAL
INSERT INTO stations (id, agency, name, latitude, longitude) VALUES
    (gen_random_uuid(), 'MEDICAL', 'Eastern Regional Hospital Koforidua', 6.0897, -0.2594),
    (gen_random_uuid(), 'MEDICAL', 'St. Dominic Hospital Akwatia', 5.9422, -0.8056),
    (gen_random_uuid(), 'MEDICAL', 'Nsawam Government Hospital', 5.8088, -0.3518);

-- POLICE
INSERT INTO stations (id, agency, name, latitude, longitude) VALUES
    (gen_random_uuid(), 'POLICE', 'Eastern Regional Police Headquarters', 6.0900, -0.2600),
    (gen_random_uuid(), 'POLICE', 'Koforidua Central Police Station', 6.0920, -0.2580),
    (gen_random_uuid(), 'POLICE', 'Nsawam District Police Command', 5.8090, -0.3520);

-- FIRE
INSERT INTO stations (id, agency, name, latitude, longitude) VALUES
    (gen_random_uuid(), 'FIRE', 'Eastern Regional Fire Service Command', 6.0895, -0.2595),
    (gen_random_uuid(), 'FIRE', 'Koforidua Fire Station', 6.0910, -0.2585),
    (gen_random_uuid(), 'FIRE', 'Nsawam Fire Station', 5.8085, -0.3515);

-- ─────────────────────────────────────────────────────────────────────────────────
-- VOLTA REGION
-- ─────────────────────────────────────────────────────────────────────────────────

-- MEDICAL
INSERT INTO stations (id, agency, name, latitude, longitude) VALUES
    (gen_random_uuid(), 'MEDICAL', 'Ho Teaching Hospital', 6.6009, 0.4707),
    (gen_random_uuid(), 'MEDICAL', 'Hohoe Municipal Hospital', 7.1529, 0.2811),
    (gen_random_uuid(), 'MEDICAL', 'Keta Municipal Hospital', 5.9180, 0.9870);

-- POLICE
INSERT INTO stations (id, agency, name, latitude, longitude) VALUES
    (gen_random_uuid(), 'POLICE', 'Volta Regional Police Headquarters', 6.6020, 0.4710),
    (gen_random_uuid(), 'POLICE', 'Ho Central Police Station', 6.6015, 0.4705),
    (gen_random_uuid(), 'POLICE', 'Hohoe District Police Command', 7.1530, 0.2815);

-- FIRE
INSERT INTO stations (id, agency, name, latitude, longitude) VALUES
    (gen_random_uuid(), 'FIRE', 'Volta Regional Fire Service Command', 6.6010, 0.4708),
    (gen_random_uuid(), 'FIRE', 'Ho Fire Station', 6.6012, 0.4710),
    (gen_random_uuid(), 'FIRE', 'Hohoe Fire Station', 7.1525, 0.2810);

-- ─────────────────────────────────────────────────────────────────────────────────
-- UPPER EAST REGION
-- ─────────────────────────────────────────────────────────────────────────────────

-- MEDICAL
INSERT INTO stations (id, agency, name, latitude, longitude) VALUES
    (gen_random_uuid(), 'MEDICAL', 'Bolgatanga Regional Hospital', 10.7867, -0.8514),
    (gen_random_uuid(), 'MEDICAL', 'Bawku Presbyterian Hospital', 11.0557, -0.2470),
    (gen_random_uuid(), 'MEDICAL', 'Navrongo War Memorial Hospital', 10.8967, -1.0927);

-- POLICE
INSERT INTO stations (id, agency, name, latitude, longitude) VALUES
    (gen_random_uuid(), 'POLICE', 'Upper East Regional Police Headquarters', 10.7870, -0.8520),
    (gen_random_uuid(), 'POLICE', 'Bolgatanga Police Station', 10.7865, -0.8510),
    (gen_random_uuid(), 'POLICE', 'Bawku District Police Command', 11.0560, -0.2475);

-- FIRE
INSERT INTO stations (id, agency, name, latitude, longitude) VALUES
    (gen_random_uuid(), 'FIRE', 'Upper East Regional Fire Service Command', 10.7868, -0.8515),
    (gen_random_uuid(), 'FIRE', 'Bolgatanga Fire Station', 10.7870, -0.8512),
    (gen_random_uuid(), 'FIRE', 'Bawku Fire Station', 11.0555, -0.2468);

-- ─────────────────────────────────────────────────────────────────────────────────
-- UPPER WEST REGION
-- ─────────────────────────────────────────────────────────────────────────────────

-- MEDICAL
INSERT INTO stations (id, agency, name, latitude, longitude) VALUES
    (gen_random_uuid(), 'MEDICAL', 'Wa Regional Hospital', 10.0601, -2.5099),
    (gen_random_uuid(), 'MEDICAL', 'Lawra District Hospital', 10.6510, -2.9006),
    (gen_random_uuid(), 'MEDICAL', 'Jirapa District Hospital', 10.4950, -2.7500);

-- POLICE
INSERT INTO stations (id, agency, name, latitude, longitude) VALUES
    (gen_random_uuid(), 'POLICE', 'Upper West Regional Police Headquarters', 10.0605, -2.5100),
    (gen_random_uuid(), 'POLICE', 'Wa Police Station', 10.0600, -2.5095),
    (gen_random_uuid(), 'POLICE', 'Lawra District Police Command', 10.6515, -2.9010);

-- FIRE
INSERT INTO stations (id, agency, name, latitude, longitude) VALUES
    (gen_random_uuid(), 'FIRE', 'Upper West Regional Fire Service Command', 10.0603, -2.5098),
    (gen_random_uuid(), 'FIRE', 'Wa Fire Station', 10.0602, -2.5096),
    (gen_random_uuid(), 'FIRE', 'Lawra Fire Station', 10.6512, -2.9008);

-- ─────────────────────────────────────────────────────────────────────────────────
-- BONO REGION
-- ─────────────────────────────────────────────────────────────────────────────────

-- MEDICAL
INSERT INTO stations (id, agency, name, latitude, longitude) VALUES
    (gen_random_uuid(), 'MEDICAL', 'Sunyani Regional Hospital', 7.3391, -2.3265),
    (gen_random_uuid(), 'MEDICAL', 'Holy Family Hospital Berekum', 7.4534, -2.5832),
    (gen_random_uuid(), 'MEDICAL', 'Dormaa Presbyterian Hospital', 7.1556, -2.9635);

-- POLICE
INSERT INTO stations (id, agency, name, latitude, longitude) VALUES
    (gen_random_uuid(), 'POLICE', 'Bono Regional Police Headquarters', 7.3395, -2.3270),
    (gen_random_uuid(), 'POLICE', 'Sunyani Police Station', 7.3390, -2.3260),
    (gen_random_uuid(), 'POLICE', 'Berekum District Police Command', 7.4540, -2.5835);

-- FIRE
INSERT INTO stations (id, agency, name, latitude, longitude) VALUES
    (gen_random_uuid(), 'FIRE', 'Bono Regional Fire Service Command', 7.3393, -2.3268),
    (gen_random_uuid(), 'FIRE', 'Sunyani Fire Station', 7.3392, -2.3263),
    (gen_random_uuid(), 'FIRE', 'Berekum Fire Station', 7.4535, -2.5830);

-- ─────────────────────────────────────────────────────────────────────────────────
-- BONO EAST REGION
-- ─────────────────────────────────────────────────────────────────────────────────

-- MEDICAL
INSERT INTO stations (id, agency, name, latitude, longitude) VALUES
    (gen_random_uuid(), 'MEDICAL', 'Techiman Holy Family Hospital', 7.5885, -1.9378),
    (gen_random_uuid(), 'MEDICAL', 'Atebubu Government Hospital', 7.7550, -0.9922),
    (gen_random_uuid(), 'MEDICAL', 'Kintampo Municipal Hospital', 8.0557, -1.7311);

-- POLICE
INSERT INTO stations (id, agency, name, latitude, longitude) VALUES
    (gen_random_uuid(), 'POLICE', 'Bono East Regional Police Headquarters', 7.5890, -1.9380),
    (gen_random_uuid(), 'POLICE', 'Techiman Police Station', 7.5888, -1.9375),
    (gen_random_uuid(), 'POLICE', 'Atebubu District Police Command', 7.7555, -0.9925);

-- FIRE
INSERT INTO stations (id, agency, name, latitude, longitude) VALUES
    (gen_random_uuid(), 'FIRE', 'Bono East Regional Fire Service Command', 7.5887, -1.9377),
    (gen_random_uuid(), 'FIRE', 'Techiman Fire Station', 7.5886, -1.9376),
    (gen_random_uuid(), 'FIRE', 'Atebubu Fire Station', 7.7552, -0.9920);

-- ─────────────────────────────────────────────────────────────────────────────────
-- AHAFO REGION
-- ─────────────────────────────────────────────────────────────────────────────────

-- MEDICAL
INSERT INTO stations (id, agency, name, latitude, longitude) VALUES
    (gen_random_uuid(), 'MEDICAL', 'Goaso Government Hospital', 6.8000, -2.5333),
    (gen_random_uuid(), 'MEDICAL', 'Hwidiem District Hospital', 6.7417, -2.3494),
    (gen_random_uuid(), 'MEDICAL', 'Bechem Government Hospital', 7.0894, -2.0239);

-- POLICE
INSERT INTO stations (id, agency, name, latitude, longitude) VALUES
    (gen_random_uuid(), 'POLICE', 'Ahafo Regional Police Headquarters', 6.8005, -2.5335),
    (gen_random_uuid(), 'POLICE', 'Goaso Police Station', 6.8002, -2.5330),
    (gen_random_uuid(), 'POLICE', 'Bechem District Police Command', 7.0895, -2.0240);

-- FIRE
INSERT INTO stations (id, agency, name, latitude, longitude) VALUES
    (gen_random_uuid(), 'FIRE', 'Ahafo Regional Fire Service Command', 6.8003, -2.5332),
    (gen_random_uuid(), 'FIRE', 'Goaso Fire Station', 6.8001, -2.5331),
    (gen_random_uuid(), 'FIRE', 'Bechem Fire Station', 7.0896, -2.0238);

-- ─────────────────────────────────────────────────────────────────────────────────
-- SAVANNAH REGION
-- ─────────────────────────────────────────────────────────────────────────────────

-- MEDICAL
INSERT INTO stations (id, agency, name, latitude, longitude) VALUES
    (gen_random_uuid(), 'MEDICAL', 'Damongo Hospital', 9.0861, -1.8253),
    (gen_random_uuid(), 'MEDICAL', 'Salaga Government Hospital', 8.5500, -0.5167),
    (gen_random_uuid(), 'MEDICAL', 'Bole District Hospital', 9.0333, -2.4833);

-- POLICE
INSERT INTO stations (id, agency, name, latitude, longitude) VALUES
    (gen_random_uuid(), 'POLICE', 'Savannah Regional Police Headquarters', 9.0865, -1.8255),
    (gen_random_uuid(), 'POLICE', 'Damongo Police Station', 9.0863, -1.8250),
    (gen_random_uuid(), 'POLICE', 'Salaga District Police Command', 8.5505, -0.5170);

-- FIRE
INSERT INTO stations (id, agency, name, latitude, longitude) VALUES
    (gen_random_uuid(), 'FIRE', 'Savannah Regional Fire Service Command', 9.0862, -1.8252),
    (gen_random_uuid(), 'FIRE', 'Damongo Fire Station', 9.0860, -1.8251),
    (gen_random_uuid(), 'FIRE', 'Salaga Fire Station', 8.5502, -0.5168);

-- ─────────────────────────────────────────────────────────────────────────────────
-- NORTH EAST REGION
-- ─────────────────────────────────────────────────────────────────────────────────

-- MEDICAL
INSERT INTO stations (id, agency, name, latitude, longitude) VALUES
    (gen_random_uuid(), 'MEDICAL', 'Nalerigu Baptist Medical Centre', 10.5333, -0.3667),
    (gen_random_uuid(), 'MEDICAL', 'Walewale Government Hospital', 10.3000, -0.8333),
    (gen_random_uuid(), 'MEDICAL', 'Gambaga District Hospital', 10.5167, -0.5500);

-- POLICE
INSERT INTO stations (id, agency, name, latitude, longitude) VALUES
    (gen_random_uuid(), 'POLICE', 'North East Regional Police Headquarters', 10.5335, -0.3670),
    (gen_random_uuid(), 'POLICE', 'Nalerigu Police Station', 10.5330, -0.3665),
    (gen_random_uuid(), 'POLICE', 'Walewale District Police Command', 10.3005, -0.8335);

-- FIRE
INSERT INTO stations (id, agency, name, latitude, longitude) VALUES
    (gen_random_uuid(), 'FIRE', 'North East Regional Fire Service Command', 10.5332, -0.3668),
    (gen_random_uuid(), 'FIRE', 'Nalerigu Fire Station', 10.5331, -0.3666),
    (gen_random_uuid(), 'FIRE', 'Walewale Fire Station', 10.3002, -0.8332);

-- ─────────────────────────────────────────────────────────────────────────────────
-- OTI REGION
-- ─────────────────────────────────────────────────────────────────────────────────

-- MEDICAL
INSERT INTO stations (id, agency, name, latitude, longitude) VALUES
    (gen_random_uuid(), 'MEDICAL', 'Dambai Government Hospital', 8.0833, 0.1500),
    (gen_random_uuid(), 'MEDICAL', 'Krachi East District Hospital', 7.7667, 0.0500),
    (gen_random_uuid(), 'MEDICAL', 'Jasikan Government Hospital', 7.4333, 0.4667);

-- POLICE
INSERT INTO stations (id, agency, name, latitude, longitude) VALUES
    (gen_random_uuid(), 'POLICE', 'Oti Regional Police Headquarters', 8.0835, 0.1505),
    (gen_random_uuid(), 'POLICE', 'Dambai Police Station', 8.0830, 0.1500),
    (gen_random_uuid(), 'POLICE', 'Jasikan District Police Command', 7.4335, 0.4670);

-- FIRE
INSERT INTO stations (id, agency, name, latitude, longitude) VALUES
    (gen_random_uuid(), 'FIRE', 'Oti Regional Fire Service Command', 8.0832, 0.1502),
    (gen_random_uuid(), 'FIRE', 'Dambai Fire Station', 8.0831, 0.1501),
    (gen_random_uuid(), 'FIRE', 'Jasikan Fire Station', 7.4332, 0.4668);

-- ─────────────────────────────────────────────────────────────────────────────────
-- WESTERN NORTH REGION
-- ─────────────────────────────────────────────────────────────────────────────────

-- MEDICAL
INSERT INTO stations (id, agency, name, latitude, longitude) VALUES
    (gen_random_uuid(), 'MEDICAL', 'Sefwi Wiawso Government Hospital', 6.2000, -2.4833),
    (gen_random_uuid(), 'MEDICAL', 'Bibiani Government Hospital', 6.4667, -2.3167),
    (gen_random_uuid(), 'MEDICAL', 'Juaboso District Hospital', 6.3333, -2.7000);

-- POLICE
INSERT INTO stations (id, agency, name, latitude, longitude) VALUES
    (gen_random_uuid(), 'POLICE', 'Western North Regional Police Headquarters', 6.2005, -2.4835),
    (gen_random_uuid(), 'POLICE', 'Sefwi Wiawso Police Station', 6.2002, -2.4830),
    (gen_random_uuid(), 'POLICE', 'Bibiani District Police Command', 6.4670, -2.3170);

-- FIRE
INSERT INTO stations (id, agency, name, latitude, longitude) VALUES
    (gen_random_uuid(), 'FIRE', 'Western North Regional Fire Service Command', 6.2003, -2.4833),
    (gen_random_uuid(), 'FIRE', 'Sefwi Wiawso Fire Station', 6.2001, -2.4831),
    (gen_random_uuid(), 'FIRE', 'Bibiani Fire Station', 6.4668, -2.3168);

-- ════════════════════════════════════════════════════════════════════════════════
-- ANALYZE for query planner
-- ════════════════════════════════════════════════════════════════════════════════
ANALYZE stations;
