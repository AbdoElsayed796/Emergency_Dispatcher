package smartemergencydispatcher.mapper;

import org.locationtech.jts.geom.Point;
import org.mapstruct.Mapper;
import smartemergencydispatcher.dto.locationDTO.LocationDTO;

@Mapper(componentModel = "spring")
public interface LocationMapper {
    default LocationDTO toDTO(Point location) {
        if (location == null)
            return null;
        return new LocationDTO(location.getY(), location.getX());
    }
}
