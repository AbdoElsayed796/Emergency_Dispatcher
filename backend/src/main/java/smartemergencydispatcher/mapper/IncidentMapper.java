package smartemergencydispatcher.mapper;

import org.mapstruct.*;
import smartemergencydispatcher.dto.incidentdto.IncidentDTO;
import smartemergencydispatcher.model.Incident;

@Mapper(componentModel = "spring", uses = LocationMapper.class)
public interface IncidentMapper {
    IncidentDTO toDTO(Incident incident);
}
