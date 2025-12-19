package smartemergencydispatcher.mapper;


import org.locationtech.jts.geom.*;
import org.springframework.stereotype.Component;
import smartemergencydispatcher.dto.incidentdto.IncidentCreateDTO;
import smartemergencydispatcher.dto.incidentdto.IncidentDTO;
import smartemergencydispatcher.dto.locationDTO.LocationDTO;
import smartemergencydispatcher.model.Incident;
import smartemergencydispatcher.model.enums.IncidentStatus;

@Component
public class IncidentMapper {
    private final GeometryFactory geometryFactory = new GeometryFactory();

    public IncidentDTO toDTO(Incident incident) {
        return new IncidentDTO(
                incident.getId(),
                incident.getType(),
                incident.getSeverityLevel(),
                incident.getStatus(),
                incident.getReportedTime(),
                pointToLocation(incident.getLocation())
        );
    }

    public Incident toEntity(IncidentCreateDTO dto) {
        Incident incident = new Incident();
        incident.setType(dto.getType());
        incident.setSeverityLevel(dto.getSeverityLevel());
        incident.setStatus(IncidentStatus.REPORTED);
        incident.setReportedTime(java.time.LocalDateTime.now());
        incident.setLocation(locationToPoint(dto.getLocation()));
        return incident;
    }

    private LocationDTO pointToLocation(Point point) {
        return new LocationDTO(point.getY(), point.getX());
    }

    private Point locationToPoint(LocationDTO location) {
        return geometryFactory.createPoint(
                new Coordinate(location.getLongitude(), location.getLatitude())
        );
    }

    //! Can add some mappers
}
