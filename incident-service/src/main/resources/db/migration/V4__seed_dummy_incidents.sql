-- ════════════════════════════════════════════════════════════════════════════════
-- V4__seed_dummy_incidents.sql
-- Populate incident_db.incidents with 100 realistic incidents across Ghana
-- ════════════════════════════════════════════════════════════════════════════════

-- Seed 100 realistic incidents spread over past 60 days
-- Distribution: 40% MEDICAL, 35% POLICE, 25% FIRE
-- Severity: 15% CRITICAL, 25% HIGH, 40% MEDIUM, 20% LOW
-- Status: 10% REPORTED, 15% ASSIGNED, 20% EN_ROUTE, 55% RESOLVED

-- ─────────────────────────────────────────────────────────────────────────────────
-- MEDICAL INCIDENTS (40 total)
-- ─────────────────────────────────────────────────────────────────────────────────

-- GREATER ACCRA - MEDICAL (10)
INSERT INTO incidents (type, severity, status, description, latitude, longitude, address, reported_by, created_at, updated_at) VALUES
    ('MEDICAL', 'CRITICAL', 'RESOLVED', 'Patient collapsed at Makola Market', 5.5570, -0.2025, 'Makola Market, Accra', 'Caller:+233200111222', NOW() - INTERVAL '55 days', NOW() - INTERVAL '55 days' + INTERVAL '28 minutes'),
    ('MEDICAL', 'HIGH', 'RESOLVED', 'Road accident on N1 Highway near Accra Mall with multiple injuries', 5.6510, -0.1770, 'N1 Highway, Accra', 'Caller:+233244333444', NOW() - INTERVAL '48 days', NOW() - INTERVAL '48 days' + INTERVAL '35 minutes'),
    ('MEDICAL', 'CRITICAL', 'RESOLVED', 'Pregnant woman in labor at Nima community', 5.5960, -0.1991, 'Nima, Accra', 'Caller:+233208555666', NOW() - INTERVAL '42 days', NOW() - INTERVAL '42 days' + INTERVAL '18 minutes'),
    ('MEDICAL', 'MEDIUM', 'RESOLVED', 'Child with severe malaria symptoms at Jamestown', 5.5310, -0.2099, 'Jamestown, Accra', 'Caller:+233201777888', NOW() - INTERVAL '38 days', NOW() - INTERVAL '38 days' + INTERVAL '22 minutes'),
    ('MEDICAL', 'HIGH', 'EN_ROUTE', 'Elderly man with chest pain at Madina Zongo Junction', 5.6805, -0.1672, 'Madina, Accra', 'Caller:+233245999000', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '2 hours'),
    ('MEDICAL', 'MEDIUM', 'ASSIGNED', 'Food poisoning case at Osu Night Market', 5.5550, -0.1788, 'Osu, Accra', 'Caller:+233208111222', NOW() - INTERVAL '45 minutes', NOW() - INTERVAL '45 minutes'),
    ('MEDICAL', 'CRITICAL', 'RESOLVED', 'Motorcycle accident near Tema Station', 5.6700, -0.0180, 'Tema, Greater Accra', 'Caller:+233244333444', NOW() - INTERVAL '30 days', NOW() - INTERVAL '30 days' + INTERVAL '32 minutes'),
    ('MEDICAL', 'LOW', 'REPORTED', 'Minor injury at Lapaz lorry station', 5.6104, -0.2468, 'Lapaz, Accra', NULL, NOW() - INTERVAL '25 minutes', NOW() - INTERVAL '25 minutes'),
    ('MEDICAL', 'MEDIUM', 'RESOLVED', 'Diabetic emergency at Dansoman Estates', 5.5378, -0.2640, 'Dansoman, Accra', 'Caller:+233201555666', NOW() - INTERVAL '25 days', NOW() - INTERVAL '25 days' + INTERVAL '20 minutes'),
    ('MEDICAL', 'HIGH', 'RESOLVED', 'Assault victim with head injury at Circle Odorkor', 5.5812, -0.2380, 'Circle, Accra', 'Caller:+233245777888', NOW() - INTERVAL '18 days', NOW() - INTERVAL '18 days' + INTERVAL '26 minutes');

-- ASHANTI - MEDICAL (8)
INSERT INTO incidents (type, severity, status, description, latitude, longitude, address, reported_by, created_at, updated_at) VALUES
    ('MEDICAL', 'CRITICAL', 'RESOLVED', 'Severe burn injuries at Kejetia Market fire', 6.6923, -1.6269, 'Kejetia, Kumasi', 'Caller:+233322111222', NOW() - INTERVAL '50 days', NOW() - INTERVAL '50 days' + INTERVAL '22 minutes'),
    ('MEDICAL', 'HIGH', 'RESOLVED', 'Motorcycle collision at Adum roundabout', 6.6959, -1.6286, 'Adum, Kumasi', 'Caller:+233322333444', NOW() - INTERVAL '44 days', NOW() - INTERVAL '44 days' + INTERVAL '28 minutes'),
    ('MEDICAL', 'MEDIUM', 'RESOLVED', 'Woman in labor at Manhyia residential area', 6.7118, -1.6322, 'Manhyia, Kumasi', 'Caller:+233322555666', NOW() - INTERVAL '36 days', NOW() - INTERVAL '36 days' + INTERVAL '24 minutes'),
    ('MEDICAL', 'HIGH', 'EN_ROUTE', 'Stroke patient at Asokwa', 6.6703, -1.6105, 'Asokwa, Kumasi', 'Caller:+233322777888', NOW() - INTERVAL '3 hours', NOW() - INTERVAL '3 hours'),
    ('MEDICAL', 'MEDIUM', 'RESOLVED', 'Child with respiratory distress at Bantama', 6.7000, -1.6350, 'Bantama, Kumasi', 'Caller:+233322999000', NOW() - INTERVAL '28 days', NOW() - INTERVAL '28 days' + INTERVAL '18 minutes'),
    ('MEDICAL', 'LOW', 'RESOLVED', 'Sprained ankle at KNUST campus', 6.6745, -1.5717, 'KNUST, Kumasi', 'Caller:+233322111333', NOW() - INTERVAL '20 days', NOW() - INTERVAL '20 days' + INTERVAL '30 minutes'),
    ('MEDICAL', 'HIGH', 'RESOLVED', 'Stabbing incident at Asafo Market', 6.6850, -1.6200, 'Asafo, Kumasi', 'Caller:+233322444555', NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days' + INTERVAL '20 minutes'),
    ('MEDICAL', 'MEDIUM', 'ASSIGNED', 'Elderly fall at Santasi residential area', 6.7100, -1.5900, 'Santasi, Kumasi', 'Caller:+233322666777', NOW() - INTERVAL '1 hour', NOW() - INTERVAL '1 hour');

-- NORTHERN - MEDICAL (4)
INSERT INTO incidents (type, severity, status, description, latitude, longitude, address, reported_by, created_at, updated_at) VALUES
    ('MEDICAL', 'HIGH', 'RESOLVED', 'Severe dehydration case at Tamale Central Market', 9.4050, -0.8380, 'Tamale Central, Northern', 'Caller:+233372111222', NOW() - INTERVAL '52 days', NOW() - INTERVAL '52 days' + INTERVAL '35 minutes'),
    ('MEDICAL', 'MEDIUM', 'RESOLVED', 'Road accident on Tamale-Bolgatanga highway', 9.4500, -0.8200, 'Tamale Highway, Northern', 'Caller:+233372333444', NOW() - INTERVAL '40 days', NOW() - INTERVAL '40 days' + INTERVAL '42 minutes'),
    ('MEDICAL', 'CRITICAL', 'RESOLVED', 'Maternity complication at Tamale West community', 9.3810, -0.8495, 'Tamale West, Northern', 'Caller:+233372555666', NOW() - INTERVAL '32 days', NOW() - INTERVAL '32 days' + INTERVAL '25 minutes'),
    ('MEDICAL', 'LOW', 'REPORTED', 'Minor cut requiring stitches at Tamale lorry park', 9.4020, -0.8400, 'Tamale, Northern', NULL, NOW() - INTERVAL '40 minutes', NOW() - INTERVAL '40 minutes');

-- CENTRAL - MEDICAL (3)
INSERT INTO incidents (type, severity, status, description, latitude, longitude, address, reported_by, created_at, updated_at) VALUES
    ('MEDICAL', 'HIGH', 'RESOLVED', 'Drowning victim at Cape Coast beach', 5.1045, -1.2480, 'Cape Coast, Central', 'Caller:+233332111222', NOW() - INTERVAL '47 days', NOW() - INTERVAL '47 days' + INTERVAL '15 minutes'),
    ('MEDICAL', 'MEDIUM', 'RESOLVED', 'Heat stroke at Winneba market', 5.3512, -0.6235, 'Winneba, Central', 'Caller:+233332333444', NOW() - INTERVAL '35 days', NOW() - INTERVAL '35 days' + INTERVAL '28 minutes'),
    ('MEDICAL', 'HIGH', 'EN_ROUTE', 'Traffic accident at Swedru junction', 5.5340, -0.7010, 'Swedru, Central', 'Caller:+233332555666', NOW() - INTERVAL '4 hours', NOW() - INTERVAL '4 hours');

-- WESTERN - MEDICAL (3)
INSERT INTO incidents (type, severity, status, description, latitude, longitude, address, reported_by, created_at, updated_at) VALUES
    ('MEDICAL', 'CRITICAL', 'RESOLVED', 'Industrial accident at Takoradi harbor', 4.8848, -1.7556, 'Takoradi Harbor, Western', 'Caller:+233312111222', NOW() - INTERVAL '58 days', NOW() - INTERVAL '58 days' + INTERVAL '18 minutes'),
    ('MEDICAL', 'MEDIUM', 'RESOLVED', 'Motorcycle accident at Tarkwa mining area', 5.3000, -2.0005, 'Tarkwa, Western', 'Caller:+233312333444', NOW() - INTERVAL '43 days', NOW() - INTERVAL '43 days' + INTERVAL '38 minutes'),
    ('MEDICAL', 'HIGH', 'RESOLVED', 'Pregnant woman emergency at Sekondi', 4.8995, -1.7543, 'Sekondi, Western', 'Caller:+233312555666', NOW() - INTERVAL '27 days', NOW() - INTERVAL '27 days' + INTERVAL '22 minutes');

-- EASTERN - MEDICAL (3)
INSERT INTO incidents (type, severity, status, description, latitude, longitude, address, reported_by, created_at, updated_at) VALUES
    ('MEDICAL', 'HIGH', 'RESOLVED', 'Bus accident on Koforidua-Accra road', 6.0850, -0.2600, 'Koforidua, Eastern', 'Caller:+233342111222', NOW() - INTERVAL '51 days', NOW() - INTERVAL '51 days' + INTERVAL '32 minutes'),
    ('MEDICAL', 'MEDIUM', 'RESOLVED', 'Child with fever at Nsawam', 5.8090, -0.3515, 'Nsawam, Eastern', 'Caller:+233342333444', NOW() - INTERVAL '38 days', NOW() - INTERVAL '38 days' + INTERVAL '24 minutes'),
    ('MEDICAL', 'LOW', 'ASSIGNED', 'Minor injury at Akwatia market', 5.9425, -0.8052, 'Akwatia, Eastern', 'Caller:+233342555666', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '2 hours');

-- VOLTA - MEDICAL (3)
INSERT INTO incidents (type, severity, status, description, latitude, longitude, address, reported_by, created_at, updated_at) VALUES
    ('MEDICAL', 'MEDIUM', 'RESOLVED', 'Accident victim at Ho town center', 6.6012, 0.4709, 'Ho, Volta', 'Caller:+233362111222', NOW() - INTERVAL '46 days', NOW() - INTERVAL '46 days' + INTERVAL '26 minutes'),
    ('MEDICAL', 'HIGH', 'RESOLVED', 'Snake bite at Hohoe farming community', 7.1527, 0.2813, 'Hohoe, Volta', 'Caller:+233362333444', NOW() - INTERVAL '33 days', NOW() - INTERVAL '33 days' + INTERVAL '45 minutes'),
    ('MEDICAL', 'MEDIUM', 'EN_ROUTE', 'Pregnancy complications at Keta', 5.9182, 0.9872, 'Keta, Volta', 'Caller:+233362555666', NOW() - INTERVAL '5 hours', NOW() - INTERVAL '5 hours');

-- OTHER REGIONS - MEDICAL (6)
INSERT INTO incidents (type, severity, status, description, latitude, longitude, address, reported_by, created_at, updated_at) VALUES
    ('MEDICAL', 'HIGH', 'RESOLVED', 'Motorbike crash at Bolgatanga market', 10.7868, -0.8513, 'Bolgatanga, Upper East', 'Caller:+233382111222', NOW() - INTERVAL '49 days', NOW() - INTERVAL '49 days' + INTERVAL '40 minutes'),
    ('MEDICAL', 'MEDIUM', 'RESOLVED', 'Elderly patient at Wa hospital junction', 10.0602, -2.5097, 'Wa, Upper West', 'Caller:+233392111222', NOW() - INTERVAL '41 days', NOW() - INTERVAL '41 days' + INTERVAL '35 minutes'),
    ('MEDICAL', 'LOW', 'RESOLVED', 'Minor injury at Sunyani lorry station', 7.3392, -2.3264, 'Sunyani, Bono', 'Caller:+233352111222', NOW() - INTERVAL '34 days', NOW() - INTERVAL '34 days' + INTERVAL '30 minutes'),
    ('MEDICAL', 'MEDIUM', 'RESOLVED', 'Child fever at Techiman market', 7.5886, -1.9376, 'Techiman, Bono East', 'Caller:+233352222333', NOW() - INTERVAL '29 days', NOW() - INTERVAL '29 days' + INTERVAL '25 minutes'),
    ('MEDICAL', 'HIGH', 'RESOLVED', 'Machete wound at Goaso farming area', 6.8002, -2.5332, 'Goaso, Ahafo', 'Caller:+233352333444', NOW() - INTERVAL '22 days', NOW() - INTERVAL '22 days' + INTERVAL '38 minutes'),
    ('MEDICAL', 'LOW', 'REPORTED', 'Minor burn at Damongo', 9.0862, -1.8252, 'Damongo, Savannah', NULL, NOW() - INTERVAL '35 minutes', NOW() - INTERVAL '35 minutes');

-- ─────────────────────────────────────────────────────────────────────────────────
-- POLICE INCIDENTS (35 total)
-- ─────────────────────────────────────────────────────────────────────────────────

-- GREATER ACCRA - POLICE (9)
INSERT INTO incidents (type, severity, status, description, latitude, longitude, address, reported_by, created_at, updated_at) VALUES
    ('POLICE', 'HIGH', 'RESOLVED', 'Armed robbery at Mobile Money agent in Madina', 5.6798, -0.1675, 'Madina Market, Accra', 'Caller:+233201555666', NOW() - INTERVAL '57 days', NOW() - INTERVAL '57 days' + INTERVAL '42 minutes'),
    ('POLICE', 'CRITICAL', 'RESOLVED', 'Armed assault at Nima community', 5.5965, -0.1988, 'Nima, Accra', 'Caller:+233245777888', NOW() - INTERVAL '54 days', NOW() - INTERVAL '54 days' + INTERVAL '25 minutes'),
    ('POLICE', 'MEDIUM', 'RESOLVED', 'Theft reported at Circle Odorkor market', 5.5815, -0.2378, 'Circle, Accra', 'Caller:+233208999000', NOW() - INTERVAL '50 days', NOW() - INTERVAL '50 days' + INTERVAL '35 minutes'),
    ('POLICE', 'HIGH', 'RESOLVED', 'Road accident with injuries on 37 Military Hospital junction', 5.5852, -0.1866, '37 Station, Accra', 'Caller:+233244111222', NOW() - INTERVAL '45 days', NOW() - INTERVAL '45 days' + INTERVAL '20 minutes'),
    ('POLICE', 'MEDIUM', 'EN_ROUTE', 'Domestic disturbance at East Legon residential area', 5.6450, -0.1650, 'East Legon, Accra', 'Caller:+233201333444', NOW() - INTERVAL '3 hours', NOW() - INTERVAL '3 hours'),
    ('POLICE', 'HIGH', 'ASSIGNED', 'Break-in at Dansoman industrial area', 5.5380, -0.2642, 'Dansoman, Accra', 'Caller:+233245555666', NOW() - INTERVAL '90 minutes', NOW() - INTERVAL '90 minutes'),
    ('POLICE', 'LOW', 'REPORTED', 'Minor dispute at Makola Market', 5.5572, -0.2023, 'Makola, Accra', NULL, NOW() - INTERVAL '50 minutes', NOW() - INTERVAL '50 minutes'),
    ('POLICE', 'MEDIUM', 'RESOLVED', 'Shoplifting at Accra Mall', 5.6512, -0.1768, 'Accra Mall, Accra', 'Caller:+233208777888', NOW() - INTERVAL '39 days', NOW() - INTERVAL '39 days' + INTERVAL '28 minutes'),
    ('POLICE', 'HIGH', 'RESOLVED', 'Assault case at Lapaz lorry station', 5.6106, -0.2466, 'Lapaz, Accra', 'Caller:+233201999000', NOW() - INTERVAL '31 days', NOW() - INTERVAL '31 days' + INTERVAL '32 minutes');

-- ASHANTI - POLICE (7)
INSERT INTO incidents (type, severity, status, description, latitude, longitude, address, reported_by, created_at, updated_at) VALUES
    ('POLICE', 'CRITICAL', 'RESOLVED', 'Armed robbery at Adum business district', 6.6960, -1.6285, 'Adum, Kumasi', 'Caller:+233322111222', NOW() - INTERVAL '56 days', NOW() - INTERVAL '56 days' + INTERVAL '22 minutes'),
    ('POLICE', 'HIGH', 'RESOLVED', 'Market brawl at Kejetia', 6.6925, -1.6267, 'Kejetia, Kumasi', 'Caller:+233322333444', NOW() - INTERVAL '53 days', NOW() - INTERVAL '53 days' + INTERVAL '18 minutes'),
    ('POLICE', 'MEDIUM', 'RESOLVED', 'Vehicle theft at Asokwa', 6.6705, -1.6103, 'Asokwa, Kumasi', 'Caller:+233322555666', NOW() - INTERVAL '48 days', NOW() - INTERVAL '48 days' + INTERVAL '45 minutes'),
    ('POLICE', 'HIGH', 'EN_ROUTE', 'Armed men at Santasi junction', 6.7105, -1.5898, 'Santasi, Kumasi', 'Caller:+233322777888', NOW() - INTERVAL '4 hours', NOW() - INTERVAL '4 hours'),
    ('POLICE', 'MEDIUM', 'RESOLVED', 'Accident on Kumasi-Accra highway', 6.6500, -1.5800, 'Kumasi Highway, Ashanti', 'Caller:+233322999000', NOW() - INTERVAL '37 days', NOW() - INTERVAL '37 days' + INTERVAL '35 minutes'),
    ('POLICE', 'LOW', 'ASSIGNED', 'Lost child at Manhyia Palace area', 6.7120, -1.6320, 'Manhyia, Kumasi', 'Caller:+233322111333', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '2 hours'),
    ('POLICE', 'MEDIUM', 'RESOLVED', 'Domestic violence at Bantama', 6.7002, -1.6348, 'Bantama, Kumasi', 'Caller:+233322444555', NOW() - INTERVAL '26 days', NOW() - INTERVAL '26 days' + INTERVAL '30 minutes');

-- NORTHERN - POLICE (3)
INSERT INTO incidents (type, severity, status, description, latitude, longitude, address, reported_by, created_at, updated_at) VALUES
    ('POLICE', 'HIGH', 'RESOLVED', 'Motorcycle theft at Tamale Central', 9.4052, -0.8378, 'Tamale Central, Northern', 'Caller:+233372111222', NOW() - INTERVAL '59 days', NOW() - INTERVAL '59 days' + INTERVAL '38 minutes'),
    ('POLICE', 'MEDIUM', 'RESOLVED', 'Land dispute escalation near Tamale', 9.3900, -0.8500, 'Tamale, Northern', 'Caller:+233372333444', NOW() - INTERVAL '44 days', NOW() - INTERVAL '44 days' + INTERVAL '50 minutes'),
    ('POLICE', 'LOW', 'REPORTED', 'Noise complaint at Tamale residential area', 9.4010, -0.8395, 'Tamale, Northern', NULL, NOW() - INTERVAL '55 minutes', NOW() - INTERVAL '55 minutes');

-- CENTRAL - POLICE (3)
INSERT INTO incidents (type, severity, status, description, latitude, longitude, address, reported_by, created_at, updated_at) VALUES
    ('POLICE', 'MEDIUM', 'RESOLVED', 'Pickpocketing at Cape Coast Castle area', 5.1055, -1.2463, 'Cape Coast, Central', 'Caller:+233332111222', NOW() - INTERVAL '52 days', NOW() - INTERVAL '52 days' + INTERVAL '28 minutes'),
    ('POLICE', 'HIGH', 'RESOLVED', 'Assault at Winneba lorry station', 5.3514, -0.6238, 'Winneba, Central', 'Caller:+233332333444', NOW() - INTERVAL '40 days', NOW() - INTERVAL '40 days' + INTERVAL '25 minutes'),
    ('POLICE', 'MEDIUM', 'EN_ROUTE', 'Burglary at Swedru residential area', 5.5342, -0.7005, 'Swedru, Central', 'Caller:+233332555666', NOW() - INTERVAL '5 hours', NOW() - INTERVAL '5 hours');

-- WESTERN - POLICE (3)
INSERT INTO incidents (type, severity, status, description, latitude, longitude, address, reported_by, created_at, updated_at) VALUES
    ('POLICE', 'HIGH', 'RESOLVED', 'Armed robbery at Takoradi Market Circle', 4.8850, -1.7552, 'Takoradi, Western', 'Caller:+233312111222', NOW() - INTERVAL '60 days', NOW() - INTERVAL '60 days' + INTERVAL '32 minutes'),
    ('POLICE', 'MEDIUM', 'RESOLVED', 'Vehicle accident at Tarkwa junction', 5.2998, -2.0002, 'Tarkwa, Western', 'Caller:+233312333444', NOW() - INTERVAL '46 days', NOW() - INTERVAL '46 days' + INTERVAL '40 minutes'),
    ('POLICE', 'CRITICAL', 'RESOLVED', 'Violent altercation at Sekondi harbor', 4.8992, -1.7545, 'Sekondi, Western', 'Caller:+233312555666', NOW() - INTERVAL '35 days', NOW() - INTERVAL '35 days' + INTERVAL '20 minutes');

-- EASTERN - POLICE (3)
INSERT INTO incidents (type, severity, status, description, latitude, longitude, address, reported_by, created_at, updated_at) VALUES
    ('POLICE', 'MEDIUM', 'RESOLVED', 'Theft at Koforidua market', 6.0900, -0.2592, 'Koforidua, Eastern', 'Caller:+233342111222', NOW() - INTERVAL '49 days', NOW() - INTERVAL '49 days' + INTERVAL '35 minutes'),
    ('POLICE', 'HIGH', 'RESOLVED', 'Road rage incident on Nsawam highway', 5.8092, -0.3516, 'Nsawam, Eastern', 'Caller:+233342333444', NOW() - INTERVAL '42 days', NOW() - INTERVAL '42 days' + INTERVAL '28 minutes'),
    ('POLICE', 'LOW', 'ASSIGNED', 'Minor dispute at Akwatia', 5.9427, -0.8054, 'Akwatia, Eastern', 'Caller:+233342555666', NOW() - INTERVAL '3 hours', NOW() - INTERVAL '3 hours');

-- VOLTA - POLICE (2)
INSERT INTO incidents (type, severity, status, description, latitude, longitude, address, reported_by, created_at, updated_at) VALUES
    ('POLICE', 'MEDIUM', 'RESOLVED', 'Property damage at Ho market', 6.6014, 0.4708, 'Ho, Volta', 'Caller:+233362111222', NOW() - INTERVAL '47 days', NOW() - INTERVAL '47 days' + INTERVAL '32 minutes'),
    ('POLICE', 'HIGH', 'RESOLVED', 'Assault case at Hohoe', 7.1528, 0.2812, 'Hohoe, Volta', 'Caller:+233362333444', NOW() - INTERVAL '36 days', NOW() - INTERVAL '36 days' + INTERVAL '25 minutes');

-- OTHER REGIONS - POLICE (5)
INSERT INTO incidents (type, severity, status, description, latitude, longitude, address, reported_by, created_at, updated_at) VALUES
    ('POLICE', 'MEDIUM', 'RESOLVED', 'Market dispute at Bolgatanga', 10.7869, -0.8512, 'Bolgatanga, Upper East', 'Caller:+233382111222', NOW() - INTERVAL '51 days', NOW() - INTERVAL '51 days' + INTERVAL '40 minutes'),
    ('POLICE', 'LOW', 'RESOLVED', 'Minor theft at Wa market', 10.0603, -2.5096, 'Wa, Upper West', 'Caller:+233392111222', NOW() - INTERVAL '43 days', NOW() - INTERVAL '43 days' + INTERVAL '35 minutes'),
    ('POLICE', 'MEDIUM', 'RESOLVED', 'Burglary at Sunyani residential area', 7.3393, -2.3263, 'Sunyani, Bono', 'Caller:+233352111222', NOW() - INTERVAL '38 days', NOW() - INTERVAL '38 days' + INTERVAL '45 minutes'),
    ('POLICE', 'HIGH', 'RESOLVED', 'Armed robbery at Techiman lorry park', 7.5887, -1.9375, 'Techiman, Bono East', 'Caller:+233352222333', NOW() - INTERVAL '30 days', NOW() - INTERVAL '30 days' + INTERVAL '30 minutes'),
    ('POLICE', 'LOW', 'REPORTED', 'Noise disturbance at Goaso', 6.8003, -2.5331, 'Goaso, Ahafo', NULL, NOW() - INTERVAL '45 minutes', NOW() - INTERVAL '45 minutes');

-- ─────────────────────────────────────────────────────────────────────────────────
-- FIRE INCIDENTS (25 total)
-- ─────────────────────────────────────────────────────────────────────────────────

-- GREATER ACCRA - FIRE (6)
INSERT INTO incidents (type, severity, status, description, latitude, longitude, address, reported_by, created_at, updated_at) VALUES
    ('FIRE', 'CRITICAL', 'RESOLVED', 'Kiosk fire spreading at Kantamanto Market', 5.5580, -0.2010, 'Kantamanto, Accra', 'Caller:+233208999000', NOW() - INTERVAL '55 days', NOW() - INTERVAL '55 days' + INTERVAL '65 minutes'),
    ('FIRE', 'HIGH', 'RESOLVED', 'Electrical fire at shop in Makola Market', 5.5568, -0.2027, 'Makola, Accra', 'Caller:+233244111222', NOW() - INTERVAL '50 days', NOW() - INTERVAL '50 days' + INTERVAL '48 minutes'),
    ('FIRE', 'CRITICAL', 'RESOLVED', 'House fire at Dansoman Estates', 5.5375, -0.2638, 'Dansoman, Accra', 'Caller:+233201333444', NOW() - INTERVAL '46 days', NOW() - INTERVAL '46 days' + INTERVAL '55 minutes'),
    ('FIRE', 'MEDIUM', 'RESOLVED', 'Gas cylinder explosion at Tudu Station', 5.5620, -0.2020, 'Tudu, Accra', 'Caller:+233245555666', NOW() - INTERVAL '42 days', NOW() - INTERVAL '42 days' + INTERVAL '38 minutes'),
    ('FIRE', 'HIGH', 'EN_ROUTE', 'Kitchen fire at Adabraka residential area', 5.5702, -0.2073, 'Adabraka, Accra', 'Caller:+233208777888', NOW() - INTERVAL '6 hours', NOW() - INTERVAL '6 hours'),
    ('FIRE', 'LOW', 'REPORTED', 'Trash fire at Madina market', 5.6797, -0.1678, 'Madina, Accra', NULL, NOW() - INTERVAL '30 minutes', NOW() - INTERVAL '30 minutes');

-- ASHANTI - FIRE (5)
INSERT INTO incidents (type, severity, status, description, latitude, longitude, address, reported_by, created_at, updated_at) VALUES
    ('FIRE', 'CRITICAL', 'RESOLVED', 'Major fire outbreak at Kejetia Market', 6.6922, -1.6270, 'Kejetia, Kumasi', 'Caller:+233322111222', NOW() - INTERVAL '58 days', NOW() - INTERVAL '58 days' + INTERVAL '90 minutes'),
    ('FIRE', 'HIGH', 'RESOLVED', 'Electrical fire at Adum commercial building', 6.6958, -1.6287, 'Adum, Kumasi', 'Caller:+233322333444', NOW() - INTERVAL '52 days', NOW() - INTERVAL '52 days' + INTERVAL '55 minutes'),
    ('FIRE', 'MEDIUM', 'RESOLVED', 'Kitchen fire at Manhyia Palace Road', 6.7116, -1.6323, 'Manhyia, Kumasi', 'Caller:+233322555666', NOW() - INTERVAL '44 days', NOW() - INTERVAL '44 days' + INTERVAL '40 minutes'),
    ('FIRE', 'HIGH', 'EN_ROUTE', 'Bushfire threatening Asokwa settlement', 6.6702, -1.6107, 'Asokwa, Kumasi', 'Caller:+233322777888', NOW() - INTERVAL '5 hours', NOW() - INTERVAL '5 hours'),
    ('FIRE', 'MEDIUM', 'RESOLVED', 'Vehicle fire on Kumasi-Accra highway', 6.6600, -1.5900, 'Kumasi Highway, Ashanti', 'Caller:+233322999000', NOW() - INTERVAL '37 days', NOW() - INTERVAL '37 days' + INTERVAL '35 minutes');

-- NORTHERN - FIRE (3)
INSERT INTO incidents (type, severity, status, description, latitude, longitude, address, reported_by, created_at, updated_at) VALUES
    ('FIRE', 'HIGH', 'RESOLVED', 'Market fire at Tamale Central', 9.4048, -0.8382, 'Tamale Central, Northern', 'Caller:+233372111222', NOW() - INTERVAL '54 days', NOW() - INTERVAL '54 days' + INTERVAL '70 minutes'),
    ('FIRE', 'CRITICAL', 'RESOLVED', 'Bushfire threatening farm settlement near Tamale', 9.3700, -0.8600, 'Tamale, Northern', 'Caller:+233372333444', NOW() - INTERVAL '49 days', NOW() - INTERVAL '49 days' + INTERVAL '85 minutes'),
    ('FIRE', 'MEDIUM', 'ASSIGNED', 'Residential fire at Tamale West', 9.3808, -0.8497, 'Tamale West, Northern', 'Caller:+233372555666', NOW() - INTERVAL '4 hours', NOW() - INTERVAL '4 hours');

-- CENTRAL - FIRE (2)
INSERT INTO incidents (type, severity, status, description, latitude, longitude, address, reported_by, created_at, updated_at) VALUES
    ('FIRE', 'MEDIUM', 'RESOLVED', 'Shop fire at Cape Coast market', 5.1052, -1.2467, 'Cape Coast, Central', 'Caller:+233332111222', NOW() - INTERVAL '48 days', NOW() - INTERVAL '48 days' + INTERVAL '45 minutes'),
    ('FIRE', 'HIGH', 'RESOLVED', 'Electrical fire at Winneba residential area', 5.3513, -0.6236, 'Winneba, Central', 'Caller:+233332333444', NOW() - INTERVAL '41 days', NOW() - INTERVAL '41 days' + INTERVAL '50 minutes');

-- WESTERN - FIRE (2)
INSERT INTO incidents (type, severity, status, description, latitude, longitude, address, reported_by, created_at, updated_at) VALUES
    ('FIRE', 'CRITICAL', 'RESOLVED', 'Industrial fire at Takoradi harbor warehouse', 4.8847, -1.7558, 'Takoradi Harbor, Western', 'Caller:+233312111222', NOW() - INTERVAL '56 days', NOW() - INTERVAL '56 days' + INTERVAL '95 minutes'),
    ('FIRE', 'MEDIUM', 'RESOLVED', 'House fire at Tarkwa residential area', 5.3002, -2.0003, 'Tarkwa, Western', 'Caller:+233312333444', NOW() - INTERVAL '45 days', NOW() - INTERVAL '45 days' + INTERVAL '42 minutes');

-- EASTERN - FIRE (2)
INSERT INTO incidents (type, severity, status, description, latitude, longitude, address, reported_by, created_at, updated_at) VALUES
    ('FIRE', 'HIGH', 'RESOLVED', 'Market fire at Koforidua', 6.0898, -0.2596, 'Koforidua, Eastern', 'Caller:+233342111222', NOW() - INTERVAL '53 days', NOW() - INTERVAL '53 days' + INTERVAL '60 minutes'),
    ('FIRE', 'MEDIUM', 'EN_ROUTE', 'Kitchen fire at Nsawam residential', 5.8091, -0.3517, 'Nsawam, Eastern', 'Caller:+233342333444', NOW() - INTERVAL '7 hours', NOW() - INTERVAL '7 hours');

-- VOLTA - FIRE (1)
INSERT INTO incidents (type, severity, status, description, latitude, longitude, address, reported_by, created_at, updated_at) VALUES
    ('FIRE', 'MEDIUM', 'RESOLVED', 'Bushfire near Ho farming community', 6.6011, 0.4710, 'Ho, Volta', 'Caller:+233362111222', NOW() - INTERVAL '47 days', NOW() - INTERVAL '47 days' + INTERVAL '55 minutes');

-- OTHER REGIONS - FIRE (4)
INSERT INTO incidents (type, severity, status, description, latitude, longitude, address, reported_by, created_at, updated_at) VALUES
    ('FIRE', 'MEDIUM', 'RESOLVED', 'Shop fire at Bolgatanga market', 10.7866, -0.8515, 'Bolgatanga, Upper East', 'Caller:+233382111222', NOW() - INTERVAL '50 days', NOW() - INTERVAL '50 days' + INTERVAL '48 minutes'),
    ('FIRE', 'HIGH', 'RESOLVED', 'Residential fire at Wa', 10.0604, -2.5098, 'Wa, Upper West', 'Caller:+233392111222', NOW() - INTERVAL '43 days', NOW() - INTERVAL '43 days' + INTERVAL '52 minutes'),
    ('FIRE', 'LOW', 'RESOLVED', 'Tire burning at Sunyani', 7.3391, -2.3266, 'Sunyani, Bono', 'Caller:+233352111222', NOW() - INTERVAL '39 days', NOW() - INTERVAL '39 days' + INTERVAL '30 minutes'),
    ('FIRE', 'CRITICAL', 'RESOLVED', 'Bushfire threatening farm at Techiman', 7.5885, -1.9379, 'Techiman, Bono East', 'Caller:+233352222333', NOW() - INTERVAL '34 days', NOW() - INTERVAL '34 days' + INTERVAL '80 minutes');

-- ════════════════════════════════════════════════════════════════════════════════
-- ANALYZE for query planner
-- ════════════════════════════════════════════════════════════════════════════════
ANALYZE incidents;
