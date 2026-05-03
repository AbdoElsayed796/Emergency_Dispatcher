CREATE DATABASE IF NOT EXISTS smart_emergency_dispatcher;
USE smart_emergency_dispatcher;

-- Drop tables in reverse order of dependencies
DROP TABLE IF EXISTS assignment;
DROP TABLE IF EXISTS vehicle;
DROP TABLE IF EXISTS notifications;
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
	dispatcher_user_id INT,
	time_assigned TIMESTAMP NOT NULL,
	time_accepted TIMESTAMP,
	time_finished TIMESTAMP,
	FOREIGN KEY (incident_id) REFERENCES incident(id) ON DELETE CASCADE,
	FOREIGN KEY (vehicle_id) REFERENCES vehicle(id) ON DELETE CASCADE,
	FOREIGN KEY (dispatcher_user_id) REFERENCES user(id) ON DELETE CASCADE,
	UNIQUE KEY unique_incident_assignment (incident_id)  -- ✅ ADDED THIS
);

CREATE TABLE notifications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  role ENUM('ADMIN', 'DISPATCHER') NOT NULL,
  type ENUM(
    'NON_AVAILABLE_VEHICLE',
    'NEW_INCIDENT',
    'INCIDENT_RESOLVED'
  ) NOT NULL,
  incident_id INT NULL, 
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (incident_id) REFERENCES incident(id) ON DELETE SET NULL 
);

-- Sample data
INSERT INTO user (name, email, password, phone, role)
VALUES 
('Fire Captain Tom', 'tom.fire@emergency.com', 'responder123', '+1444444444', 'RESPONDER'),
('Paramedic Lisa', 'lisa.medical@emergency.com', 'responder123', '+1555555555', 'RESPONDER'),
('Officer Rodriguez', 'rodriguez.police@emergency.com', 'responder123', '+1666666666', 'RESPONDER'),
('Dispatcher Sarah', 'sarah@emergency.com', 'dispatcher123', '+1777777777', 'DISPATCHER');

INSERT INTO station (type, name, phone, location)
VALUES 
('FIRE', 'Central Fire Station', '+1999111001', POINT(40.7128, -74.0060)),
('MEDICAL', 'City Medical Center', '+1999111002', POINT(40.7580, -73.9855)),
('POLICE', 'Downtown Police Station', '+1999111003', POINT(40.7489, -73.9680));