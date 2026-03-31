-- Seed 60 responders across Ghana (20 per type)

-- Greater Accra - MEDICAL
INSERT INTO responders (name, type, latitude, longitude, availability, created_at, updated_at)
VALUES 
('Ambulance Team Alpha', 'MEDICAL', 5.6037, -0.1870, 'AVAILABLE', NOW() - INTERVAL '30 days', NOW()),
('Paramedic Unit Bravo', 'MEDICAL', 5.5794, -0.2163, 'AVAILABLE', NOW() - INTERVAL '25 days', NOW()),
('Emergency Medical Team Charlie', 'MEDICAL', 5.6529, -0.1750, 'BUSY', NOW() - INTERVAL '20 days', NOW()),
('Ambulance Crew Delta', 'MEDICAL', 5.6149, -0.2047, 'AVAILABLE', NOW() - INTERVAL '15 days', NOW()),
-- Ashanti - MEDICAL
('Kumasi Ambulance Alpha', 'MEDICAL', 6.6885, -1.6244, 'AVAILABLE', NOW() - INTERVAL '28 days', NOW()),
('Paramedic Team Bravo KMA', 'MEDICAL', 6.6743, -1.6161, 'AVAILABLE', NOW() - INTERVAL '22 days', NOW()),
('Emergency Team Kumasi', 'MEDICAL', 6.7154, -1.6080, 'OFF_DUTY', NOW() - INTERVAL '18 days', NOW()),
-- Northern - MEDICAL
('Tamale Med Unit Alpha', 'MEDICAL', 9.4034, -0.8424, 'AVAILABLE', NOW() - INTERVAL '26 days', NOW()),
('Ambulance Team Tamale', 'MEDICAL', 9.3872, -0.8535, 'AVAILABLE', NOW() - INTERVAL '19 days', NOW()),
-- Central - MEDICAL
('Cape Coast Ambulance', 'MEDICAL', 5.1053, -1.2466, 'AVAILABLE', NOW() - INTERVAL '24 days', NOW()),
('Paramedics Cape Coast', 'MEDICAL', 5.1222, -1.2706, 'BUSY', NOW() - INTERVAL '17 days', NOW()),
-- Western - MEDICAL
('Takoradi Medical Team', 'MEDICAL', 4.8974, -1.7562, 'AVAILABLE', NOW() - INTERVAL '21 days', NOW()),
('Ambulance Sekondi', 'MEDICAL', 4.9305, -1.7110, 'AVAILABLE', NOW() - INTERVAL '16 days', NOW()),
-- Eastern - MEDICAL
('Koforidua Ambulance', 'MEDICAL', 6.0938, -0.2598, 'AVAILABLE', NOW() - INTERVAL '23 days', NOW()),
('Emergency Med Koforidua', 'MEDICAL', 6.0812, -0.2723, 'AVAILABLE', NOW() - INTERVAL '14 days', NOW()),
-- Volta - MEDICAL
('Ho Medical Unit', 'MEDICAL', 6.6109, 0.4714, 'AVAILABLE', NOW() - INTERVAL '27 days', NOW()),
('Ambulance Team Ho', 'MEDICAL', 6.6031, 0.4802, 'OFF_DUTY', NOW() - INTERVAL '12 days', NOW()),
-- Bono - MEDICAL
('Sunyani Ambulance', 'MEDICAL', 7.3391, -2.3267, 'AVAILABLE', NOW() - INTERVAL '20 days', NOW()),
-- Upper East - MEDICAL
('Bolgatanga Med Unit', 'MEDICAL', 10.7858, -0.8515, 'AVAILABLE', NOW() - INTERVAL '18 days', NOW()),
-- Upper West - MEDICAL
('Wa Ambulance Team', 'MEDICAL', 10.0605, -2.5091, 'AVAILABLE', NOW() - INTERVAL '15 days', NOW());

-- Greater Accra - POLICE
INSERT INTO responders (name, type, latitude, longitude, availability, created_at, updated_at)
VALUES 
('Police Unit 001 Accra', 'POLICE', 5.6037, -0.1870, 'AVAILABLE', NOW() - INTERVAL '30 days', NOW()),
('SWAT Team Alpha', 'POLICE', 5.5560, -0.1969, 'AVAILABLE', NOW() - INTERVAL '25 days', NOW()),
('Patrol Unit Tema', 'POLICE', 5.6698, 0.0165, 'BUSY', NOW() - INTERVAL '22 days', NOW()),
('Highway Patrol GA-01', 'POLICE', 5.6391, -0.2116, 'AVAILABLE', NOW() - INTERVAL '20 days', NOW()),
-- Ashanti - POLICE
('Kumasi Police Unit 45', 'POLICE', 6.6885, -1.6244, 'AVAILABLE', NOW() - INTERVAL '28 days', NOW()),
('MTTD Kumasi', 'POLICE', 6.6976, -1.6286, 'AVAILABLE', NOW() - INTERVAL '24 days', NOW()),
('Patrol Unit Obuasi', 'POLICE', 6.2027, -1.6696, 'AVAILABLE', NOW() - INTERVAL '19 days', NOW()),
-- Northern - POLICE
('Tamale Police 12', 'POLICE', 9.4034, -0.8424, 'AVAILABLE', NOW() - INTERVAL '26 days', NOW()),
('Highway Patrol NR-02', 'POLICE', 9.5427, -0.9096, 'OFF_DUTY', NOW() - INTERVAL '21 days', NOW()),
-- Central - POLICE
('Cape Coast Police Unit', 'POLICE', 5.1053, -1.2466, 'AVAILABLE', NOW() - INTERVAL '23 days', NOW()),
('MTTD Cape Coast', 'POLICE', 5.1222, -1.2706, 'AVAILABLE', NOW() - INTERVAL '17 days', NOW()),
-- Western - POLICE
('Takoradi Police 34', 'POLICE', 4.8974, -1.7562, 'AVAILABLE', NOW() - INTERVAL '22 days', NOW()),
('Sekondi Patrol Unit', 'POLICE', 4.9305, -1.7110, 'BUSY', NOW() - INTERVAL '16 days', NOW()),
-- Eastern - POLICE
('Koforidua Police HQ', 'POLICE', 6.0938, -0.2598, 'AVAILABLE', NOW() - INTERVAL '24 days', NOW()),
('Highway Patrol ER-03', 'POLICE', 6.0812, -0.2723, 'AVAILABLE', NOW() - INTERVAL '14 days', NOW()),
-- Volta - POLICE
('Ho Police Station', 'POLICE', 6.6109, 0.4714, 'AVAILABLE', NOW() - INTERVAL '27 days', NOW()),
('Patrol Unit Volta', 'POLICE', 6.6031, 0.4802, 'AVAILABLE', NOW() - INTERVAL '13 days', NOW()),
-- Bono - POLICE
('Sunyani Police Unit', 'POLICE', 7.3391, -2.3267, 'AVAILABLE', NOW() - INTERVAL '20 days', NOW()),
-- Upper East - POLICE
('Bolgatanga Police HQ', 'POLICE', 10.7858, -0.8515, 'AVAILABLE', NOW() - INTERVAL '18 days', NOW()),
-- Upper West - POLICE
('Wa Police Command', 'POLICE', 10.0605, -2.5091, 'AVAILABLE', NOW() - INTERVAL '16 days', NOW());

-- Greater Accra - FIRE
INSERT INTO responders (name, type, latitude, longitude, availability, created_at, updated_at)
VALUES 
('Fire Crew Alpha Accra', 'FIRE', 5.6037, -0.1870, 'AVAILABLE', NOW() - INTERVAL '30 days', NOW()),
('Fire Station Kaneshie', 'FIRE', 5.5794, -0.2163, 'AVAILABLE', NOW() - INTERVAL '26 days', NOW()),
('Fire Unit Tema', 'FIRE', 5.6698, 0.0165, 'BUSY', NOW() - INTERVAL '23 days', NOW()),
('Emergency Fire Madina', 'FIRE', 5.6805, -0.1673, 'AVAILABLE', NOW() - INTERVAL '19 days', NOW()),
-- Ashanti - FIRE
('Kumasi Fire Alpha', 'FIRE', 6.6885, -1.6244, 'AVAILABLE', NOW() - INTERVAL '28 days', NOW()),
('Fire Station Kejetia', 'FIRE', 6.6976, -1.6286, 'AVAILABLE', NOW() - INTERVAL '24 days', NOW()),
('Fire Team Obuasi', 'FIRE', 6.2027, -1.6696, 'OFF_DUTY', NOW() - INTERVAL '20 days', NOW()),
-- Northern - FIRE
('Tamale Fire HQ', 'FIRE', 9.4034, -0.8424, 'AVAILABLE', NOW() - INTERVAL '27 days', NOW()),
('Fire Crew Tamale West', 'FIRE', 9.3872, -0.8535, 'AVAILABLE', NOW() - INTERVAL '22 days', NOW()),
-- Central - FIRE
('Cape Coast Fire Station', 'FIRE', 5.1053, -1.2466, 'AVAILABLE', NOW() - INTERVAL '25 days', NOW()),
('Fire Unit Central', 'FIRE', 5.1222, -1.2706, 'BUSY', NOW() - INTERVAL '18 days', NOW()),
-- Western - FIRE
('Takoradi Fire Service', 'FIRE', 4.8974, -1.7562, 'AVAILABLE', NOW() - INTERVAL '23 days', NOW()),
('Sekondi Fire Team', 'FIRE', 4.9305, -1.7110, 'AVAILABLE', NOW() - INTERVAL '17 days', NOW()),
-- Eastern - FIRE
('Koforidua Fire HQ', 'FIRE', 6.0938, -0.2598, 'AVAILABLE', NOW() - INTERVAL '24 days', NOW()),
('Fire Crew Koforidua', 'FIRE', 6.0812, -0.2723, 'AVAILABLE', NOW() - INTERVAL '15 days', NOW()),
-- Volta - FIRE
('Ho Fire Station', 'FIRE', 6.6109, 0.4714, 'AVAILABLE', NOW() - INTERVAL '28 days', NOW()),
('Fire Team Ho Regional', 'FIRE', 6.6031, 0.4802, 'AVAILABLE', NOW() - INTERVAL '14 days', NOW()),
-- Bono - FIRE
('Sunyani Fire Service', 'FIRE', 7.3391, -2.3267, 'AVAILABLE', NOW() - INTERVAL '21 days', NOW()),
-- Upper East - FIRE
('Bolgatanga Fire HQ', 'FIRE', 10.7858, -0.8515, 'AVAILABLE', NOW() - INTERVAL '19 days', NOW()),
-- Upper West - FIRE
('Wa Fire Command', 'FIRE', 10.0605, -2.5091, 'AVAILABLE', NOW() - INTERVAL '16 days', NOW());

ANALYZE responders;
