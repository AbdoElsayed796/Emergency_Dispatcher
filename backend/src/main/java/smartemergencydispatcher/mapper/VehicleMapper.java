package smartemergencydispatcher.mapper;


import org.locationtech.jts.geom.*;
import org.springframework.stereotype.Component;
import smartemergencydispatcher.dto.locationDTO.LocationDTO;
import smartemergencydispatcher.dto.vehicledto.AvailableVehicleDTO;
import smartemergencydispatcher.dto.vehicledto.VehicleCreateDTO;
import smartemergencydispatcher.dto.vehicledto.VehicleDTO;
import smartemergencydispatcher.model.Station;
import smartemergencydispatcher.model.User;
import smartemergencydispatcher.model.Vehicle;

@Component
public class VehicleMapper {
    private final GeometryFactory geometryFactory = new GeometryFactory();

    public VehicleDTO toDTO(Vehicle vehicle) {
        return new VehicleDTO(
                vehicle.getId(),
                vehicle.getType(),
                vehicle.getStatus(),
                vehicle.getCapacity(),
                pointToLocation(vehicle.getLocation()),
                vehicle.getStation().getId(),
                vehicle.getStation().getName(),
                vehicle.getResponder().getId(),
                vehicle.getResponder().getName()
        );
    }

    public AvailableVehicleDTO toAvailableDTO(Vehicle vehicle) {
        return new AvailableVehicleDTO(
                vehicle.getId(),
                vehicle.getType(),
                vehicle.getCapacity(),
                pointToLocation(vehicle.getLocation()),
                vehicle.getStation().getId(),
                vehicle.getStation().getName(),
                vehicle.getResponder().getId(),
                vehicle.getResponder().getName()
        );
    }

    public Vehicle toEntity(VehicleCreateDTO dto, Station station, User responder) {
        Vehicle vehicle = new Vehicle();
        vehicle.setType(dto.getType());
        vehicle.setStatus(dto.getStatus());
        vehicle.setCapacity(dto.getCapacity());
        vehicle.setLocation(locationToPoint(dto.getLocation()));
        vehicle.setStation(station);
        vehicle.setResponder(responder);
        return vehicle;
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
