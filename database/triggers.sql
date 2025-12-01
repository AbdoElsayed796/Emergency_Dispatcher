DELIMITER $$

USE smart_emergency_dispatcher $$

DROP TRIGGER IF EXISTS vehicle_before_insert $$
DROP TRIGGER IF EXISTS assignment_before_insert $$

CREATE TRIGGER vehicle_before_insert
BEFORE INSERT ON vehicle
FOR EACH ROW
BEGIN
    DECLARE station_type ENUM('FIRE','POLICE','MEDICAL','RESCUE','HAZMAT');
    SELECT type INTO station_type FROM station WHERE id = NEW.station_id;
    IF NEW.type != station_type THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Vehicle type must match station type';
    END IF;
END$$

CREATE TRIGGER assignment_before_insert
BEFORE INSERT ON assignment
FOR EACH ROW
BEGIN
    DECLARE vehicle_status ENUM('AVAILABLE','ASSIGNED');
    DECLARE vehicle_type ENUM('FIRE','POLICE','MEDICAL','RESCUE','HAZMAT');
	DECLARE incident_type ENUM('FIRE','POLICE','MEDICAL','RESCUE','HAZMAT');
    
    SELECT type, status INTO vehicle_type, vehicle_status FROM vehicle WHERE id = NEW.vehicle_id;
    IF vehicle_status != 'AVAILABLE' THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Vehicle must be available to assign';
    END IF;
    
    SELECT type INTO incident_type FROM incident WHERE id = NEW.incident_id;
    IF vehicle_type != incident_type THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Incident type must match vehicle type';
    END IF;
END$$

DELIMITER ;
