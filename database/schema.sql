CREATE DATABASE IF NOT EXISTS smart_emergency_dispatcher;
USE smart_emergency_dispatcher;


-- Drop tables in reverse order of dependencies (child tables first)
DROP TABLE IF EXISTS assignment;
DROP TABLE IF EXISTS vehicle;
DROP TABLE IF EXISTS incident;
DROP TABLE IF EXISTS station;
DROP TABLE IF EXISTS user;


CREATE TABLE IF NOT EXISTS user (
	id INT PRIMARY KEY AUTO_INCREMENT,
	name VARCHAR(64) NOT NULL,
	email VARCHAR(64) UNIQUE NOT NULL,
	password VARCHAR(64) NOT NULL,
	phone VARCHAR(16) UNIQUE,
	role ENUM('DISPATCHER', 'RESPONDER', 'ADMIN') NOT NULL
);

CREATE TABLE IF NOT EXISTS station (
	id INT PRIMARY KEY AUTO_INCREMENT,
	type ENUM('FIRE', 'POLICE', 'MEDICAL') NOT NULL,
	name VARCHAR(64) NOT NULL,
	phone VARCHAR(16) UNIQUE NOT NULL,
	location POINT NOT NULL
);

CREATE TABLE IF NOT EXISTS vehicle (
	id INT PRIMARY KEY AUTO_INCREMENT,
	type ENUM('FIRE', 'POLICE', 'MEDICAL') NOT NULL,
	status ENUM('AVAILABLE', 'ON_ROUTE', 'BUSY', 'MAINTENANCE') NOT NULL,
	capacity INT NOT NULL,
	location POINT NOT NULL,
	station_id INT NOT NULL,
	responder_user_id INT NOT NULL,
	FOREIGN KEY (station_id) REFERENCES station(id),
	FOREIGN KEY (responder_user_id) REFERENCES user(id)
);

CREATE TABLE IF NOT EXISTS incident (
	id INT PRIMARY KEY AUTO_INCREMENT,
	type ENUM('FIRE', 'POLICE', 'MEDICAL') NOT NULL,
	severity_level ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL') NOT NULL,
    status ENUM('REPORTED', 'ASSIGNED', 'RESOLVED') NOT NULL,
	reported_time TIMESTAMP NOT NULL,
	location POINT NOT NULL
);

CREATE TABLE IF NOT EXISTS assignment (
	assignment_id INT PRIMARY KEY AUTO_INCREMENT,
	incident_id INT NOT NULL,
	vehicle_id INT NOT NULL,
	dispatcher_user_id INT NOT NULL,
	time_assigned TIMESTAMP NOT NULL,
	time_accepted TIMESTAMP,
	time_finished TIMESTAMP,
	FOREIGN KEY (incident_id) REFERENCES incident(id),
	FOREIGN KEY (vehicle_id) REFERENCES vehicle(id),
	FOREIGN KEY (dispatcher_user_id) REFERENCES user(id)
);


-- 1. Users first
INSERT INTO user (name, email, password, phone, role)
VALUES 
('Fire Captain Tom', 'tom.fire@emergency.com', 'responder123', '+1444444444', 'RESPONDER'),
('Paramedic Lisa', 'lisa.medical@emergency.com', 'responder123', '+1555555555', 'RESPONDER'),
('Officer Rodriguez', 'rodriguez.police@emergency.com', 'responder123', '+1666666666', 'RESPONDER'),
('Dispatcher Sarah', 'sarah@emergency.com', 'dispatcher123', '+1777777777', 'DISPATCHER');

-- 2. Stations second
INSERT INTO station (type, name, phone, location)
VALUES 
('FIRE', 'Central Fire Station', '+1999111001', POINT(40.7128, -74.0060)),
('MEDICAL', 'City Medical Center', '+1999111002', POINT(40.7580, -73.9855)),
('POLICE', 'Downtown Police Station', '+1999111003', POINT(40.7489, -73.9680));

-- 3. Vehicles third (after users and stations exist)
INSERT INTO vehicle (type, status, capacity, location, station_id, responder_user_id)
VALUES 
('FIRE', 'AVAILABLE', 6, POINT(40.7128, -74.0060), 1, 1),
('MEDICAL', 'AVAILABLE', 2, POINT(40.7580, -73.9855), 2, 2),
('POLICE', 'AVAILABLE', 2, POINT(40.7489, -73.9680), 3, 3),
('POLICE', 'AVAILABLE', 6, POINT(40.7489, 73.9680), 2, 3);

-- 4. Incidents (independent, can be inserted anytime)
INSERT INTO incident (type, severity_level, status, reported_time, location)
VALUES 
('FIRE', 'HIGH', 'ASSIGNED', NOW(), POINT(40.7489, -73.9680)),
('MEDICAL', 'CRITICAL', 'RESOLVED', NOW(), POINT(40.7580, -73.9855)),
('POLICE', 'MEDIUM', 'REPORTED', NOW(), POINT(40.7614, -73.9776));