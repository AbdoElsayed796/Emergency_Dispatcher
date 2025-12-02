package smartemergencydispatcher.mapper;


import org.locationtech.jts.geom.*;
import org.springframework.stereotype.Component;
import smartemergencydispatcher.dto.locationDTO.LocationDTO;
import smartemergencydispatcher.dto.stationdto.StationCreateDTO;
import smartemergencydispatcher.dto.stationdto.StationDTO;
import smartemergencydispatcher.model.Station;

@Component
public class StationMapper {
    private final GeometryFactory geometryFactory = new GeometryFactory();

    public StationDTO toDTO(Station station) {
        return new StationDTO(
                station.getId(),
                station.getType(),
                station.getName(),
                station.getPhone(),
                pointToLocation(station.getLocation())
        );
    }

    public Station toEntity(StationCreateDTO dto) {
        Station station = new Station();
        station.setType(dto.getType());
        station.setName(dto.getName());
        station.setPhone(dto.getPhone());
        station.setLocation(locationToPoint(dto.getLocation()));
        return station;
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
