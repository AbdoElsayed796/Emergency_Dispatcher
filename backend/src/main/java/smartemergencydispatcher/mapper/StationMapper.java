package smartemergencydispatcher.mapper;

import org.mapstruct.Mapper;
import smartemergencydispatcher.dto.stationdto.StationDTO;
import smartemergencydispatcher.model.Station;


@Mapper(componentModel = "spring", uses = LocationMapper.class)
public interface StationMapper {
    StationDTO toDTO(Station station);
}