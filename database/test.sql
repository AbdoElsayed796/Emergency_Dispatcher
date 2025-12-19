-- ====================================================
-- Smart Emergency Dispatcher - Clear and Insert Data
-- ====================================================

USE smart_emergency_dispatcher;

-- Disable foreign key checks to allow data deletion
SET FOREIGN_KEY_CHECKS = 0;

-- ====================================================
-- CLEAR ALL EXISTING DATA
-- ====================================================

TRUNCATE TABLE assignment;
TRUNCATE TABLE vehicle;
TRUNCATE TABLE incident;
TRUNCATE TABLE station;
TRUNCATE TABLE user;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- ====================================================
-- INSERT USERS
-- ====================================================

INSERT INTO user (name, email, password, phone, role) VALUES
-- Dispatchers
('Sarah Johnson', 'sarah.johnson@dispatcher.com', 'hashed_pwd_001', '+1234567001', 'DISPATCHER'),
('Michael Chen', 'michael.chen@dispatcher.com', 'hashed_pwd_002', '+1234567002', 'DISPATCHER'),
('Emily Rodriguez', 'emily.rodriguez@dispatcher.com', 'hashed_pwd_003', '+1234567003', 'DISPATCHER'),
('David Kim', 'david.kim@dispatcher.com', 'hashed_pwd_004', '+1234567004', 'DISPATCHER'),
('Jessica Brown', 'jessica.brown@dispatcher.com', 'hashed_pwd_005', '+1234567005', 'DISPATCHER'),
('Robert Taylor', 'robert.taylor@dispatcher.com', 'hashed_pwd_006', '+1234567006', 'DISPATCHER'),
('Amanda White', 'amanda.white@dispatcher.com', 'hashed_pwd_007', '+1234567007', 'DISPATCHER'),
('James Martinez', 'james.martinez@dispatcher.com', 'hashed_pwd_008', '+1234567008', 'DISPATCHER'),

-- Fire Responders
('John FireFighter', 'john.ff@fire.com', 'hashed_pwd_101', '+1234567101', 'RESPONDER'),
('Maria Blaze', 'maria.blaze@fire.com', 'hashed_pwd_102', '+1234567102', 'RESPONDER'),
('Tom Rescue', 'tom.rescue@fire.com', 'hashed_pwd_103', '+1234567103', 'RESPONDER'),
('Linda Smoke', 'linda.smoke@fire.com', 'hashed_pwd_104', '+1234567104', 'RESPONDER'),
('Carlos Flame', 'carlos.flame@fire.com', 'hashed_pwd_105', '+1234567105', 'RESPONDER'),
('Sophie Ember', 'sophie.ember@fire.com', 'hashed_pwd_106', '+1234567106', 'RESPONDER'),
('Daniel Torch', 'daniel.torch@fire.com', 'hashed_pwd_107', '+1234567107', 'RESPONDER'),
('Nina Spark', 'nina.spark@fire.com', 'hashed_pwd_108', '+1234567108', 'RESPONDER'),
('Eric Heat', 'eric.heat@fire.com', 'hashed_pwd_109', '+1234567109', 'RESPONDER'),
('Rachel Ash', 'rachel.ash@fire.com', 'hashed_pwd_110', '+1234567110', 'RESPONDER'),

-- Police Responders
('Officer Mike Shield', 'mike.shield@police.com', 'hashed_pwd_201', '+1234567201', 'RESPONDER'),
('Officer Lisa Guard', 'lisa.guard@police.com', 'hashed_pwd_202', '+1234567202', 'RESPONDER'),
('Officer Kevin Justice', 'kevin.justice@police.com', 'hashed_pwd_203', '+1234567203', 'RESPONDER'),
('Officer Anna Law', 'anna.law@police.com', 'hashed_pwd_204', '+1234567204', 'RESPONDER'),
('Officer Chris Badge', 'chris.badge@police.com', 'hashed_pwd_205', '+1234567205', 'RESPONDER'),
('Officer Megan Force', 'megan.force@police.com', 'hashed_pwd_206', '+1234567206', 'RESPONDER'),
('Officer Ryan Order', 'ryan.order@police.com', 'hashed_pwd_207', '+1234567207', 'RESPONDER'),
('Officer Patricia Peace', 'patricia.peace@police.com', 'hashed_pwd_208', '+1234567208', 'RESPONDER'),
('Officer Brian Patrol', 'brian.patrol@police.com', 'hashed_pwd_209', '+1234567209', 'RESPONDER'),
('Officer Sandra Protect', 'sandra.protect@police.com', 'hashed_pwd_210', '+1234567210', 'RESPONDER'),

-- Medical Responders
('Dr. Alex Medic', 'alex.medic@medical.com', 'hashed_pwd_301', '+1234567301', 'RESPONDER'),
('Paramedic Sam Life', 'sam.life@medical.com', 'hashed_pwd_302', '+1234567302', 'RESPONDER'),
('Dr. Helen Care', 'helen.care@medical.com', 'hashed_pwd_303', '+1234567303', 'RESPONDER'),
('Paramedic Mark Save', 'mark.save@medical.com', 'hashed_pwd_304', '+1234567304', 'RESPONDER'),
('Dr. Emma Health', 'emma.health@medical.com', 'hashed_pwd_305', '+1234567305', 'RESPONDER'),
('Paramedic Paul Rescue', 'paul.rescue@medical.com', 'hashed_pwd_306', '+1234567306', 'RESPONDER'),
('Dr. Grace Heal', 'grace.heal@medical.com', 'hashed_pwd_307', '+1234567307', 'RESPONDER'),
('Paramedic Steve Aid', 'steve.aid@medical.com', 'hashed_pwd_308', '+1234567308', 'RESPONDER'),
('Dr. Julia Pulse', 'julia.pulse@medical.com', 'hashed_pwd_309', '+1234567309', 'RESPONDER'),
('Paramedic Tony Vital', 'tony.vital@medical.com', 'hashed_pwd_310', '+1234567310', 'RESPONDER'),

-- Admins
('Admin Alice', 'alice.admin@system.com', 'hashed_pwd_901', '+1234567901', 'ADMIN'),
('Admin Bob', 'bob.admin@system.com', 'hashed_pwd_902', '+1234567902', 'ADMIN'),
('Admin Carol', 'carol.admin@system.com', 'hashed_pwd_903', '+1234567903', 'ADMIN');

-- ====================================================
-- INSERT STATIONS
-- ====================================================

INSERT INTO station (type, name, phone, location) VALUES
-- Fire Stations
('FIRE', 'Central Fire Station', '+1555-FIRE-001', POINT(40.7580, -73.9855)),
('FIRE', 'North Fire Station', '+1555-FIRE-002', POINT(40.7780, -73.9655)),
('FIRE', 'South Fire Station', '+1555-FIRE-003', POINT(40.7380, -74.0055)),
('FIRE', 'East Fire Station', '+1555-FIRE-004', POINT(40.7480, -73.9555)),
('FIRE', 'West Fire Station', '+1555-FIRE-005', POINT(40.7680, -74.0255)),

-- Police Stations
('POLICE', 'Downtown Police Precinct', '+1555-POLICE-01', POINT(40.7589, -73.9851)),
('POLICE', 'Northside Police Precinct', '+1555-POLICE-02', POINT(40.7789, -73.9651)),
('POLICE', 'Southside Police Precinct', '+1555-POLICE-03', POINT(40.7389, -74.0051)),
('POLICE', 'Eastside Police Precinct', '+1555-POLICE-04', POINT(40.7489, -73.9551)),
('POLICE', 'Westside Police Precinct', '+1555-POLICE-05', POINT(40.7689, -74.0251)),

-- Medical Stations
('MEDICAL', 'General Hospital Emergency', '+1555-MED-0001', POINT(40.7585, -73.9845)),
('MEDICAL', 'North Medical Center', '+1555-MED-0002', POINT(40.7785, -73.9645)),
('MEDICAL', 'South Medical Center', '+1555-MED-0003', POINT(40.7385, -74.0045)),
('MEDICAL', 'East Medical Center', '+1555-MED-0004', POINT(40.7485, -73.9545)),
('MEDICAL', 'West Medical Center', '+1555-MED-0005', POINT(40.7685, -74.0245));

-- ====================================================
-- INSERT VEHICLES
-- ====================================================

INSERT INTO vehicle (type, status, capacity, location, station_id, responder_user_id) VALUES
-- Fire Vehicles (station_id 1-5, responder_user_id 9-18)
-- All initially AVAILABLE - status will change after assignments
('FIRE', 'AVAILABLE', 6, POINT(40.7580, -73.9855), 1, 9),
('FIRE', 'AVAILABLE', 6, POINT(40.7581, -73.9856), 1, 10),
('FIRE', 'AVAILABLE', 4, POINT(40.7650, -73.9800), 2, 11),
('FIRE', 'AVAILABLE', 6, POINT(40.7780, -73.9655), 2, 12),
('FIRE', 'AVAILABLE', 5, POINT(40.7400, -74.0070), 3, 13),
('FIRE', 'AVAILABLE', 6, POINT(40.7380, -74.0055), 3, 14),
('FIRE', 'AVAILABLE', 4, POINT(40.7480, -73.9555), 4, 15),
('FIRE', 'AVAILABLE', 6, POINT(40.7481, -73.9556), 4, 16),
('FIRE', 'AVAILABLE', 5, POINT(40.7680, -74.0255), 5, 17),
('FIRE', 'AVAILABLE', 6, POINT(40.7681, -74.0256), 5, 18),

-- Police Vehicles (station_id 6-10, responder_user_id 19-28)
-- All initially AVAILABLE - status will change after assignments
('POLICE', 'AVAILABLE', 4, POINT(40.7589, -73.9851), 6, 19),
('POLICE', 'AVAILABLE', 4, POINT(40.7590, -73.9852), 6, 20),
('POLICE', 'AVAILABLE', 4, POINT(40.7700, -73.9700), 7, 21),
('POLICE', 'AVAILABLE', 4, POINT(40.7789, -73.9651), 7, 22),
('POLICE', 'AVAILABLE', 4, POINT(40.7389, -74.0051), 8, 23),
('POLICE', 'AVAILABLE', 4, POINT(40.7350, -74.0100), 8, 24),
('POLICE', 'AVAILABLE', 4, POINT(40.7489, -73.9551), 9, 25),
('POLICE', 'AVAILABLE', 4, POINT(40.7490, -73.9552), 9, 26),
('POLICE', 'AVAILABLE', 4, POINT(40.7689, -74.0251), 10, 27),
('POLICE', 'AVAILABLE', 4, POINT(40.7690, -74.0252), 10, 28),

-- Medical Vehicles (station_id 11-15, responder_user_id 29-38)
-- All initially AVAILABLE - status will change after assignments
('MEDICAL', 'AVAILABLE', 3, POINT(40.7585, -73.9845), 11, 29),
('MEDICAL', 'AVAILABLE', 3, POINT(40.7586, -73.9846), 11, 30),
('MEDICAL', 'AVAILABLE', 3, POINT(40.7720, -73.9680), 12, 31),
('MEDICAL', 'AVAILABLE', 3, POINT(40.7785, -73.9645), 12, 32),
('MEDICAL', 'AVAILABLE', 3, POINT(40.7385, -74.0045), 13, 33),
('MEDICAL', 'AVAILABLE', 3, POINT(40.7360, -74.0080), 13, 34),
('MEDICAL', 'AVAILABLE', 3, POINT(40.7485, -73.9545), 14, 35),
('MEDICAL', 'AVAILABLE', 3, POINT(40.7486, -73.9546), 14, 36),
('MEDICAL', 'AVAILABLE', 3, POINT(40.7685, -74.0245), 15, 37),
('MEDICAL', 'AVAILABLE', 3, POINT(40.7686, -74.0246), 15, 38);

-- ====================================================
-- INSERT INCIDENTS
-- ====================================================

INSERT INTO incident (type, severity_level, status, reported_time, location) VALUES
-- Fire Incidents
('FIRE', 'CRITICAL', 'ASSIGNED', '2024-12-03 08:15:00', POINT(40.7650, -73.9800)),
('FIRE', 'HIGH', 'ASSIGNED', '2024-12-03 09:30:00', POINT(40.7400, -74.0070)),
('FIRE', 'MEDIUM', 'REPORTED', '2024-12-03 10:45:00', POINT(40.7520, -73.9920)),
('FIRE', 'LOW', 'RESOLVED', '2024-12-02 14:20:00', POINT(40.7600, -73.9700)),
('FIRE', 'HIGH', 'REPORTED', '2024-12-03 11:00:00', POINT(40.7750, -73.9600)),
('FIRE', 'MEDIUM', 'RESOLVED', '2024-12-02 16:30:00', POINT(40.7450, -74.0100)),
('FIRE', 'CRITICAL', 'REPORTED', '2024-12-03 07:00:00', POINT(40.7700, -74.0300)),
('FIRE', 'LOW', 'RESOLVED', '2024-12-01 13:45:00', POINT(40.7550, -73.9750)),

-- Police Incidents
('POLICE', 'HIGH', 'ASSIGNED', '2024-12-03 08:45:00', POINT(40.7700, -73.9700)),
('POLICE', 'CRITICAL', 'ASSIGNED', '2024-12-03 09:15:00', POINT(40.7350, -74.0100)),
('POLICE', 'MEDIUM', 'REPORTED', '2024-12-03 10:30:00', POINT(40.7550, -73.9850)),
('POLICE', 'LOW', 'RESOLVED', '2024-12-02 15:00:00', POINT(40.7620, -73.9750)),
('POLICE', 'HIGH', 'REPORTED', '2024-12-03 11:20:00', POINT(40.7800, -73.9600)),
('POLICE', 'MEDIUM', 'RESOLVED', '2024-12-02 17:00:00', POINT(40.7400, -74.0000)),
('POLICE', 'CRITICAL', 'REPORTED', '2024-12-03 06:30:00', POINT(40.7650, -74.0200)),
('POLICE', 'LOW', 'RESOLVED', '2024-12-01 12:00:00', POINT(40.7500, -73.9800)),

-- Medical Incidents
('MEDICAL', 'CRITICAL', 'ASSIGNED', '2024-12-03 08:30:00', POINT(40.7720, -73.9680)),
('MEDICAL', 'HIGH', 'ASSIGNED', '2024-12-03 09:45:00', POINT(40.7360, -74.0080)),
('MEDICAL', 'MEDIUM', 'REPORTED', '2024-12-03 10:15:00', POINT(40.7580, -73.9900)),
('MEDICAL', 'LOW', 'RESOLVED', '2024-12-02 14:45:00', POINT(40.7610, -73.9720)),
('MEDICAL', 'HIGH', 'REPORTED', '2024-12-03 11:30:00', POINT(40.7790, -73.9620)),
('MEDICAL', 'MEDIUM', 'RESOLVED', '2024-12-02 16:45:00', POINT(40.7420, -74.0060)),
('MEDICAL', 'CRITICAL', 'REPORTED', '2024-12-03 07:15:00', POINT(40.7680, -74.0280)),
('MEDICAL', 'LOW', 'RESOLVED', '2024-12-01 13:00:00', POINT(40.7540, -73.9770)),

-- Additional Mixed Incidents
('FIRE', 'MEDIUM', 'REPORTED', '2024-12-03 12:00:00', POINT(40.7500, -73.9950)),
('POLICE', 'HIGH', 'REPORTED', '2024-12-03 12:15:00', POINT(40.7600, -73.9650)),
('MEDICAL', 'CRITICAL', 'REPORTED', '2024-12-03 12:30:00', POINT(40.7450, -74.0150)),
('FIRE', 'LOW', 'RESOLVED', '2024-12-01 10:00:00', POINT(40.7650, -73.9900)),
('POLICE', 'MEDIUM', 'RESOLVED', '2024-12-01 11:30:00', POINT(40.7550, -74.0050)),
('MEDICAL', 'HIGH', 'RESOLVED', '2024-12-01 14:00:00', POINT(40.7700, -73.9800));

-- ====================================================
-- INSERT ASSIGNMENTS
-- ====================================================

INSERT INTO assignment (incident_id, vehicle_id, dispatcher_user_id, time_assigned, time_accepted, time_finished) VALUES
-- Completed assignments (vehicles are AVAILABLE now, were used in past)
(4, 1, 1, '2024-12-02 14:20:00', '2024-12-02 14:22:00', '2024-12-02 15:30:00'),
(6, 2, 2, '2024-12-02 16:30:00', '2024-12-02 16:32:00', '2024-12-02 17:45:00'),
(12, 11, 3, '2024-12-02 15:00:00', '2024-12-02 15:03:00', '2024-12-02 16:15:00'),
(14, 12, 4, '2024-12-02 17:00:00', '2024-12-02 17:02:00', '2024-12-02 18:30:00'),
(20, 21, 5, '2024-12-02 14:45:00', '2024-12-02 14:48:00', '2024-12-02 16:00:00'),
(22, 22, 6, '2024-12-02 16:45:00', '2024-12-02 16:47:00', '2024-12-02 18:00:00'),
(28, 4, 7, '2024-12-01 10:00:00', '2024-12-01 10:05:00', '2024-12-01 11:30:00'),
(29, 14, 8, '2024-12-01 11:30:00', '2024-12-01 11:33:00', '2024-12-01 13:00:00'),
(30, 24, 1, '2024-12-01 14:00:00', '2024-12-01 14:02:00', '2024-12-01 15:45:00'),
(16, 15, 2, '2024-12-01 12:00:00', '2024-12-01 12:05:00', '2024-12-01 13:30:00'),
(24, 25, 3, '2024-12-01 13:00:00', '2024-12-01 13:03:00', '2024-12-01 14:45:00'),

-- Active assignments (in progress - accepted but not finished)
(1, 3, 1, '2024-12-03 08:15:00', '2024-12-03 08:17:00', NULL),
(2, 5, 2, '2024-12-03 09:30:00', '2024-12-03 09:33:00', NULL),
(9, 13, 3, '2024-12-03 08:45:00', '2024-12-03 08:48:00', NULL),
(10, 16, 4, '2024-12-03 09:15:00', '2024-12-03 09:18:00', NULL),
(17, 23, 5, '2024-12-03 08:30:00', '2024-12-03 08:33:00', NULL),
(18, 26, 6, '2024-12-03 09:45:00', '2024-12-03 09:48:00', NULL);

-- Update vehicle statuses to reflect current assignments
-- Vehicles on active assignments should be ON_ROUTE or BUSY
UPDATE vehicle SET status = 'ON_ROUTE' WHERE id IN (3, 13, 23);
UPDATE vehicle SET status = 'BUSY' WHERE id IN (5, 16, 26);

-- Some vehicles can be in MAINTENANCE (not assigned)
UPDATE vehicle SET status = 'MAINTENANCE' WHERE id IN (8, 28, 30);

-- ====================================================
-- VERIFICATION QUERIES
-- ====================================================

SELECT '=== DATA INSERTION COMPLETE ===' AS status;
SELECT 'Users' AS table_name, COUNT(*) AS record_count FROM user
UNION ALL
SELECT 'Stations', COUNT(*) FROM station
UNION ALL
SELECT 'Vehicles', COUNT(*) FROM vehicle
UNION ALL
SELECT 'Incidents', COUNT(*) FROM incident
UNION ALL
SELECT 'Assignments', COUNT(*) FROM assignment;