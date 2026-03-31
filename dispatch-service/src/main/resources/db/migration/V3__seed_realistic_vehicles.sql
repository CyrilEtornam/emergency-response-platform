-- ════════════════════════════════════════════════════════════════════════════════
-- V3__seed_realistic_vehicles.sql
-- Replace demo vehicles with realistic fleet linked to real Ghana stations
-- ════════════════════════════════════════════════════════════════════════════════

-- Note: Vehicles already deleted by V2 migration to maintain referential integrity

-- ─────────────────────────────────────────────────────────────────────────────────
-- GREATER ACCRA VEHICLES (15 total: 5 per agency)
-- ─────────────────────────────────────────────────────────────────────────────────

-- MEDICAL - Korle Bu Teaching Hospital
INSERT INTO vehicles (agency, vehicle_type, call_sign, status, latitude, longitude, station_id)
SELECT 'MEDICAL', 'AMBULANCE', 'AMB-GA-01', 'AVAILABLE', 5.5348, -0.2261, s.id
FROM stations s WHERE s.name = 'Korle Bu Teaching Hospital' LIMIT 1;

INSERT INTO vehicles (agency, vehicle_type, call_sign, status, latitude, longitude, station_id)
SELECT 'MEDICAL', 'AMBULANCE', 'AMB-GA-02', 'EN_ROUTE', 5.5600, -0.2050, s.id
FROM stations s WHERE s.name = 'Korle Bu Teaching Hospital' LIMIT 1;

-- MEDICAL - 37 Military Hospital
INSERT INTO vehicles (agency, vehicle_type, call_sign, status, latitude, longitude, station_id)
SELECT 'MEDICAL', 'AMBULANCE', 'AMB-GA-03', 'AVAILABLE', 5.5852, -0.1864, s.id
FROM stations s WHERE s.name = '37 Military Hospital' LIMIT 1;

-- MEDICAL - Ridge Hospital
INSERT INTO vehicles (agency, vehicle_type, call_sign, status, latitude, longitude, station_id)
SELECT 'MEDICAL', 'AMBULANCE', 'AMB-GA-04', 'MAINTENANCE', 5.5571, -0.1973, s.id
FROM stations s WHERE s.name = 'Ridge Hospital' LIMIT 1;

-- MEDICAL - Ga East Municipal Hospital
INSERT INTO vehicles (agency, vehicle_type, call_sign, status, latitude, longitude, station_id)
SELECT 'MEDICAL', 'AMBULANCE', 'AMB-GA-05', 'AVAILABLE', 5.6796, -0.1677, s.id
FROM stations s WHERE s.name = 'Ga East Municipal Hospital' LIMIT 1;

-- POLICE - Greater Accra Regional Police Command
INSERT INTO vehicles (agency, vehicle_type, call_sign, status, latitude, longitude, station_id)
SELECT 'POLICE', 'POLICE_CAR', 'POL-GA-01', 'AVAILABLE', 5.5520, -0.2100, s.id
FROM stations s WHERE s.name = 'Greater Accra Regional Police Command' LIMIT 1;

INSERT INTO vehicles (agency, vehicle_type, call_sign, status, latitude, longitude, station_id)
SELECT 'POLICE', 'POLICE_CAR', 'POL-GA-02', 'EN_ROUTE', 5.5812, -0.2380, s.id
FROM stations s WHERE s.name = 'Greater Accra Regional Police Command' LIMIT 1;

-- POLICE - Accra Central Police Station
INSERT INTO vehicles (agency, vehicle_type, call_sign, status, latitude, longitude, station_id)
SELECT 'POLICE', 'POLICE_CAR', 'POL-GA-03', 'AVAILABLE', 5.5600, -0.2050, s.id
FROM stations s WHERE s.name = 'Accra Central Police Station' LIMIT 1;

-- POLICE - Madina Divisional Police Command
INSERT INTO vehicles (agency, vehicle_type, call_sign, status, latitude, longitude, station_id)
SELECT 'POLICE', 'POLICE_CAR', 'POL-GA-04', 'AVAILABLE', 5.6796, -0.1680, s.id
FROM stations s WHERE s.name = 'Madina Divisional Police Command' LIMIT 1;

INSERT INTO vehicles (agency, vehicle_type, call_sign, status, latitude, longitude, station_id)
SELECT 'POLICE', 'POLICE_CAR', 'POL-GA-05', 'MAINTENANCE', 5.5520, -0.2105, s.id
FROM stations s WHERE s.name = 'Greater Accra Regional Police Command' LIMIT 1;

-- FIRE - Ghana National Fire Service Headquarters
INSERT INTO vehicles (agency, vehicle_type, call_sign, status, latitude, longitude, station_id)
SELECT 'FIRE', 'FIRE_TRUCK', 'FIR-GA-01', 'AVAILABLE', 5.5571, -0.2010, s.id
FROM stations s WHERE s.name = 'Ghana National Fire Service Headquarters' LIMIT 1;

INSERT INTO vehicles (agency, vehicle_type, call_sign, status, latitude, longitude, station_id)
SELECT 'FIRE', 'FIRE_TRUCK', 'FIR-GA-02', 'EN_ROUTE', 5.5580, -0.2015, s.id
FROM stations s WHERE s.name = 'Greater Accra Regional Fire Command' LIMIT 1;

-- FIRE - Makola Fire Station
INSERT INTO vehicles (agency, vehicle_type, call_sign, status, latitude, longitude, station_id)
SELECT 'FIRE', 'FIRE_TRUCK', 'FIR-GA-03', 'AVAILABLE', 5.5570, -0.2025, s.id
FROM stations s WHERE s.name = 'Makola Fire Station' LIMIT 1;

-- FIRE - Madina Fire Station
INSERT INTO vehicles (agency, vehicle_type, call_sign, status, latitude, longitude, station_id)
SELECT 'FIRE', 'FIRE_TRUCK', 'FIR-GA-04', 'AVAILABLE', 5.6800, -0.1670, s.id
FROM stations s WHERE s.name = 'Madina Fire Station' LIMIT 1;

INSERT INTO vehicles (agency, vehicle_type, call_sign, status, latitude, longitude, station_id)
SELECT 'FIRE', 'FIRE_TRUCK', 'FIR-GA-05', 'EN_ROUTE', 5.5571, -0.2012, s.id
FROM stations s WHERE s.name = 'Ghana National Fire Service Headquarters' LIMIT 1;

-- ─────────────────────────────────────────────────────────────────────────────────
-- ASHANTI VEHICLES (12 total: 4 per agency)
-- ─────────────────────────────────────────────────────────────────────────────────

-- MEDICAL - Komfo Anokye Teaching Hospital
INSERT INTO vehicles (agency, vehicle_type, call_sign, status, latitude, longitude, station_id)
SELECT 'MEDICAL', 'AMBULANCE', 'AMB-AS-01', 'AVAILABLE', 6.6885, -1.6244, s.id
FROM stations s WHERE s.name = 'Komfo Anokye Teaching Hospital' LIMIT 1;

INSERT INTO vehicles (agency, vehicle_type, call_sign, status, latitude, longitude, station_id)
SELECT 'MEDICAL', 'AMBULANCE', 'AMB-AS-02', 'EN_ROUTE', 6.6923, -1.6269, s.id
FROM stations s WHERE s.name = 'Komfo Anokye Teaching Hospital' LIMIT 1;

-- MEDICAL - Kumasi South Hospital
INSERT INTO vehicles (agency, vehicle_type, call_sign, status, latitude, longitude, station_id)
SELECT 'MEDICAL', 'AMBULANCE', 'AMB-AS-03', 'AVAILABLE', 6.6700, -1.6200, s.id
FROM stations s WHERE s.name = 'Kumasi South Hospital' LIMIT 1;

-- MEDICAL - Manhyia Government Hospital
INSERT INTO vehicles (agency, vehicle_type, call_sign, status, latitude, longitude, station_id)
SELECT 'MEDICAL', 'AMBULANCE', 'AMB-AS-04', 'AVAILABLE', 6.7115, -1.6320, s.id
FROM stations s WHERE s.name = 'Manhyia Government Hospital' LIMIT 1;

-- POLICE - Ashanti Regional Police Headquarters
INSERT INTO vehicles (agency, vehicle_type, call_sign, status, latitude, longitude, station_id)
SELECT 'POLICE', 'POLICE_CAR', 'POL-AS-01', 'AVAILABLE', 6.6959, -1.6286, s.id
FROM stations s WHERE s.name = 'Ashanti Regional Police Headquarters' LIMIT 1;

INSERT INTO vehicles (agency, vehicle_type, call_sign, status, latitude, longitude, station_id)
SELECT 'POLICE', 'POLICE_CAR', 'POL-AS-02', 'EN_ROUTE', 6.6700, -1.6100, s.id
FROM stations s WHERE s.name = 'Ashanti Regional Police Headquarters' LIMIT 1;

-- POLICE - Kumasi Central Police Station
INSERT INTO vehicles (agency, vehicle_type, call_sign, status, latitude, longitude, station_id)
SELECT 'POLICE', 'POLICE_CAR', 'POL-AS-03', 'AVAILABLE', 6.6923, -1.6269, s.id
FROM stations s WHERE s.name = 'Kumasi Central Police Station' LIMIT 1;

-- POLICE - Asokwa Divisional Police Command
INSERT INTO vehicles (agency, vehicle_type, call_sign, status, latitude, longitude, station_id)
SELECT 'POLICE', 'POLICE_CAR', 'POL-AS-04', 'MAINTENANCE', 6.6700, -1.6100, s.id
FROM stations s WHERE s.name = 'Asokwa Divisional Police Command' LIMIT 1;

-- FIRE - Ashanti Regional Fire Service Command
INSERT INTO vehicles (agency, vehicle_type, call_sign, status, latitude, longitude, station_id)
SELECT 'FIRE', 'FIRE_TRUCK', 'FIR-AS-01', 'AVAILABLE', 6.6960, -1.6280, s.id
FROM stations s WHERE s.name = 'Ashanti Regional Fire Service Command' LIMIT 1;

INSERT INTO vehicles (agency, vehicle_type, call_sign, status, latitude, longitude, station_id)
SELECT 'FIRE', 'FIRE_TRUCK', 'FIR-AS-02', 'EN_ROUTE', 6.6920, -1.6270, s.id
FROM stations s WHERE s.name = 'Kumasi Central Fire Station' LIMIT 1;

-- FIRE - Asokwa Fire Station
INSERT INTO vehicles (agency, vehicle_type, call_sign, status, latitude, longitude, station_id)
SELECT 'FIRE', 'FIRE_TRUCK', 'FIR-AS-03', 'AVAILABLE', 6.6710, -1.6110, s.id
FROM stations s WHERE s.name = 'Asokwa Fire Station' LIMIT 1;

-- FIRE - Manhyia Fire Station
INSERT INTO vehicles (agency, vehicle_type, call_sign, status, latitude, longitude, station_id)
SELECT 'FIRE', 'FIRE_TRUCK', 'FIR-AS-04', 'AVAILABLE', 6.7110, -1.6315, s.id
FROM stations s WHERE s.name = 'Manhyia Fire Station' LIMIT 1;

-- ─────────────────────────────────────────────────────────────────────────────────
-- NORTHERN VEHICLES (9 total: 3 per agency)
-- ─────────────────────────────────────────────────────────────────────────────────

-- MEDICAL - Tamale Teaching Hospital
INSERT INTO vehicles (agency, vehicle_type, call_sign, status, latitude, longitude, station_id)
SELECT 'MEDICAL', 'AMBULANCE', 'AMB-NR-01', 'AVAILABLE', 9.4008, -0.8393, s.id
FROM stations s WHERE s.name = 'Tamale Teaching Hospital' LIMIT 1;

INSERT INTO vehicles (agency, vehicle_type, call_sign, status, latitude, longitude, station_id)
SELECT 'MEDICAL', 'AMBULANCE', 'AMB-NR-02', 'EN_ROUTE', 9.4050, -0.8380, s.id
FROM stations s WHERE s.name = 'Tamale Teaching Hospital' LIMIT 1;

-- MEDICAL - Tamale West Hospital
INSERT INTO vehicles (agency, vehicle_type, call_sign, status, latitude, longitude, station_id)
SELECT 'MEDICAL', 'AMBULANCE', 'AMB-NR-03', 'AVAILABLE', 9.3800, -0.8500, s.id
FROM stations s WHERE s.name = 'Tamale West Hospital' LIMIT 1;

-- POLICE - Northern Regional Police Headquarters
INSERT INTO vehicles (agency, vehicle_type, call_sign, status, latitude, longitude, station_id)
SELECT 'POLICE', 'POLICE_CAR', 'POL-NR-01', 'AVAILABLE', 9.4025, -0.8400, s.id
FROM stations s WHERE s.name = 'Northern Regional Police Headquarters' LIMIT 1;

INSERT INTO vehicles (agency, vehicle_type, call_sign, status, latitude, longitude, station_id)
SELECT 'POLICE', 'POLICE_CAR', 'POL-NR-02', 'EN_ROUTE', 9.4050, -0.8380, s.id
FROM stations s WHERE s.name = 'Tamale Central Police Station' LIMIT 1;

-- POLICE - Tamale District Police Command
INSERT INTO vehicles (agency, vehicle_type, call_sign, status, latitude, longitude, station_id)
SELECT 'POLICE', 'POLICE_CAR', 'POL-NR-03', 'AVAILABLE', 9.3950, -0.8420, s.id
FROM stations s WHERE s.name = 'Tamale District Police Command' LIMIT 1;

-- FIRE - Northern Regional Fire Service Command
INSERT INTO vehicles (agency, vehicle_type, call_sign, status, latitude, longitude, station_id)
SELECT 'FIRE', 'FIRE_TRUCK', 'FIR-NR-01', 'AVAILABLE', 9.4020, -0.8395, s.id
FROM stations s WHERE s.name = 'Northern Regional Fire Service Command' LIMIT 1;

INSERT INTO vehicles (agency, vehicle_type, call_sign, status, latitude, longitude, station_id)
SELECT 'FIRE', 'FIRE_TRUCK', 'FIR-NR-02', 'AVAILABLE', 9.4030, -0.8385, s.id
FROM stations s WHERE s.name = 'Tamale Central Fire Station' LIMIT 1;

-- FIRE - Tamale West Fire Station
INSERT INTO vehicles (agency, vehicle_type, call_sign, status, latitude, longitude, station_id)
SELECT 'FIRE', 'FIRE_TRUCK', 'FIR-NR-03', 'MAINTENANCE', 9.3850, -0.8480, s.id
FROM stations s WHERE s.name = 'Tamale West Fire Station' LIMIT 1;

-- ─────────────────────────────────────────────────────────────────────────────────
-- CENTRAL VEHICLES (6 total: 2 per agency)
-- ─────────────────────────────────────────────────────────────────────────────────

-- MEDICAL - Cape Coast Teaching Hospital
INSERT INTO vehicles (agency, vehicle_type, call_sign, status, latitude, longitude, station_id)
SELECT 'MEDICAL', 'AMBULANCE', 'AMB-CR-01', 'AVAILABLE', 5.1053, -1.2465, s.id
FROM stations s WHERE s.name = 'Cape Coast Teaching Hospital' LIMIT 1;

-- MEDICAL - Winneba Trauma and Specialist Hospital
INSERT INTO vehicles (agency, vehicle_type, call_sign, status, latitude, longitude, station_id)
SELECT 'MEDICAL', 'AMBULANCE', 'AMB-CR-02', 'AVAILABLE', 5.3510, -0.6237, s.id
FROM stations s WHERE s.name = 'Winneba Trauma and Specialist Hospital' LIMIT 1;

-- POLICE - Central Regional Police Headquarters
INSERT INTO vehicles (agency, vehicle_type, call_sign, status, latitude, longitude, station_id)
SELECT 'POLICE', 'POLICE_CAR', 'POL-CR-01', 'AVAILABLE', 5.1070, -1.2450, s.id
FROM stations s WHERE s.name = 'Central Regional Police Headquarters' LIMIT 1;

-- POLICE - Cape Coast Police Station
INSERT INTO vehicles (agency, vehicle_type, call_sign, status, latitude, longitude, station_id)
SELECT 'POLICE', 'POLICE_CAR', 'POL-CR-02', 'EN_ROUTE', 5.1060, -1.2470, s.id
FROM stations s WHERE s.name = 'Cape Coast Police Station' LIMIT 1;

-- FIRE - Central Regional Fire Service Command
INSERT INTO vehicles (agency, vehicle_type, call_sign, status, latitude, longitude, station_id)
SELECT 'FIRE', 'FIRE_TRUCK', 'FIR-CR-01', 'AVAILABLE', 5.1055, -1.2460, s.id
FROM stations s WHERE s.name = 'Central Regional Fire Service Command' LIMIT 1;

-- FIRE - Cape Coast Fire Station
INSERT INTO vehicles (agency, vehicle_type, call_sign, status, latitude, longitude, station_id)
SELECT 'FIRE', 'FIRE_TRUCK', 'FIR-CR-02', 'AVAILABLE', 5.1050, -1.2475, s.id
FROM stations s WHERE s.name = 'Cape Coast Fire Station' LIMIT 1;

-- ─────────────────────────────────────────────────────────────────────────────────
-- WESTERN VEHICLES (6 total: 2 per agency)
-- ─────────────────────────────────────────────────────────────────────────────────

-- MEDICAL - Effia-Nkwanta Regional Hospital
INSERT INTO vehicles (agency, vehicle_type, call_sign, status, latitude, longitude, station_id)
SELECT 'MEDICAL', 'AMBULANCE', 'AMB-WR-01', 'AVAILABLE', 4.8990, -1.7547, s.id
FROM stations s WHERE s.name = 'Effia-Nkwanta Regional Hospital' LIMIT 1;

-- MEDICAL - Takoradi Hospital
INSERT INTO vehicles (agency, vehicle_type, call_sign, status, latitude, longitude, station_id)
SELECT 'MEDICAL', 'AMBULANCE', 'AMB-WR-02', 'AVAILABLE', 4.8845, -1.7554, s.id
FROM stations s WHERE s.name = 'Takoradi Hospital' LIMIT 1;

-- POLICE - Western Regional Police Headquarters
INSERT INTO vehicles (agency, vehicle_type, call_sign, status, latitude, longitude, station_id)
SELECT 'POLICE', 'POLICE_CAR', 'POL-WR-01', 'AVAILABLE', 4.8950, -1.7520, s.id
FROM stations s WHERE s.name = 'Western Regional Police Headquarters' LIMIT 1;

-- POLICE - Takoradi Central Police Station
INSERT INTO vehicles (agency, vehicle_type, call_sign, status, latitude, longitude, station_id)
SELECT 'POLICE', 'POLICE_CAR', 'POL-WR-02', 'EN_ROUTE', 4.8860, -1.7550, s.id
FROM stations s WHERE s.name = 'Takoradi Central Police Station' LIMIT 1;

-- FIRE - Western Regional Fire Service Command
INSERT INTO vehicles (agency, vehicle_type, call_sign, status, latitude, longitude, station_id)
SELECT 'FIRE', 'FIRE_TRUCK', 'FIR-WR-01', 'AVAILABLE', 4.8960, -1.7530, s.id
FROM stations s WHERE s.name = 'Western Regional Fire Service Command' LIMIT 1;

-- FIRE - Takoradi Fire Station
INSERT INTO vehicles (agency, vehicle_type, call_sign, status, latitude, longitude, station_id)
SELECT 'FIRE', 'FIRE_TRUCK', 'FIR-WR-02', 'AVAILABLE', 4.8850, -1.7560, s.id
FROM stations s WHERE s.name = 'Takoradi Fire Station' LIMIT 1;

-- ─────────────────────────────────────────────────────────────────────────────────
-- EASTERN VEHICLES (6 total: 2 per agency)
-- ─────────────────────────────────────────────────────────────────────────────────

-- MEDICAL - Eastern Regional Hospital Koforidua
INSERT INTO vehicles (agency, vehicle_type, call_sign, status, latitude, longitude, station_id)
SELECT 'MEDICAL', 'AMBULANCE', 'AMB-ER-01', 'AVAILABLE', 6.0897, -0.2594, s.id
FROM stations s WHERE s.name = 'Eastern Regional Hospital Koforidua' LIMIT 1;

-- MEDICAL - Nsawam Government Hospital
INSERT INTO vehicles (agency, vehicle_type, call_sign, status, latitude, longitude, station_id)
SELECT 'MEDICAL', 'AMBULANCE', 'AMB-ER-02', 'EN_ROUTE', 5.8088, -0.3518, s.id
FROM stations s WHERE s.name = 'Nsawam Government Hospital' LIMIT 1;

-- POLICE - Eastern Regional Police Headquarters
INSERT INTO vehicles (agency, vehicle_type, call_sign, status, latitude, longitude, station_id)
SELECT 'POLICE', 'POLICE_CAR', 'POL-ER-01', 'AVAILABLE', 6.0900, -0.2600, s.id
FROM stations s WHERE s.name = 'Eastern Regional Police Headquarters' LIMIT 1;

-- POLICE - Koforidua Central Police Station
INSERT INTO vehicles (agency, vehicle_type, call_sign, status, latitude, longitude, station_id)
SELECT 'POLICE', 'POLICE_CAR', 'POL-ER-02', 'AVAILABLE', 6.0920, -0.2580, s.id
FROM stations s WHERE s.name = 'Koforidua Central Police Station' LIMIT 1;

-- FIRE - Eastern Regional Fire Service Command
INSERT INTO vehicles (agency, vehicle_type, call_sign, status, latitude, longitude, station_id)
SELECT 'FIRE', 'FIRE_TRUCK', 'FIR-ER-01', 'AVAILABLE', 6.0895, -0.2595, s.id
FROM stations s WHERE s.name = 'Eastern Regional Fire Service Command' LIMIT 1;

-- FIRE - Koforidua Fire Station
INSERT INTO vehicles (agency, vehicle_type, call_sign, status, latitude, longitude, station_id)
SELECT 'FIRE', 'FIRE_TRUCK', 'FIR-ER-02', 'MAINTENANCE', 6.0910, -0.2585, s.id
FROM stations s WHERE s.name = 'Koforidua Fire Station' LIMIT 1;

-- ─────────────────────────────────────────────────────────────────────────────────
-- VOLTA VEHICLES (6 total: 2 per agency)
-- ─────────────────────────────────────────────────────────────────────────────────

-- MEDICAL - Ho Teaching Hospital
INSERT INTO vehicles (agency, vehicle_type, call_sign, status, latitude, longitude, station_id)
SELECT 'MEDICAL', 'AMBULANCE', 'AMB-VR-01', 'AVAILABLE', 6.6009, 0.4707, s.id
FROM stations s WHERE s.name = 'Ho Teaching Hospital' LIMIT 1;

-- MEDICAL - Hohoe Municipal Hospital
INSERT INTO vehicles (agency, vehicle_type, call_sign, status, latitude, longitude, station_id)
SELECT 'MEDICAL', 'AMBULANCE', 'AMB-VR-02', 'AVAILABLE', 7.1529, 0.2811, s.id
FROM stations s WHERE s.name = 'Hohoe Municipal Hospital' LIMIT 1;

-- POLICE - Volta Regional Police Headquarters
INSERT INTO vehicles (agency, vehicle_type, call_sign, status, latitude, longitude, station_id)
SELECT 'POLICE', 'POLICE_CAR', 'POL-VR-01', 'AVAILABLE', 6.6020, 0.4710, s.id
FROM stations s WHERE s.name = 'Volta Regional Police Headquarters' LIMIT 1;

-- POLICE - Ho Central Police Station
INSERT INTO vehicles (agency, vehicle_type, call_sign, status, latitude, longitude, station_id)
SELECT 'POLICE', 'POLICE_CAR', 'POL-VR-02', 'AVAILABLE', 6.6015, 0.4705, s.id
FROM stations s WHERE s.name = 'Ho Central Police Station' LIMIT 1;

-- FIRE - Volta Regional Fire Service Command
INSERT INTO vehicles (agency, vehicle_type, call_sign, status, latitude, longitude, station_id)
SELECT 'FIRE', 'FIRE_TRUCK', 'FIR-VR-01', 'AVAILABLE', 6.6010, 0.4708, s.id
FROM stations s WHERE s.name = 'Volta Regional Fire Service Command' LIMIT 1;

-- FIRE - Ho Fire Station
INSERT INTO vehicles (agency, vehicle_type, call_sign, status, latitude, longitude, station_id)
SELECT 'FIRE', 'FIRE_TRUCK', 'FIR-VR-02', 'EN_ROUTE', 6.6012, 0.4710, s.id
FROM stations s WHERE s.name = 'Ho Fire Station' LIMIT 1;

-- ════════════════════════════════════════════════════════════════════════════════
-- ANALYZE for query planner
-- ════════════════════════════════════════════════════════════════════════════════
ANALYZE vehicles;
