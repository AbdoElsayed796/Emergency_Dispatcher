package smartemergencydispatcher.mapper;


import org.mapstruct.Mapper;
import smartemergencydispatcher.dto.assignmentdto.AssignmentDTO;
import smartemergencydispatcher.model.Assignment;

@Mapper(componentModel = "spring", uses = IncidentMapper.class)
public interface AssignmentMapper {
    AssignmentDTO toDTO(Assignment assignment);
}
