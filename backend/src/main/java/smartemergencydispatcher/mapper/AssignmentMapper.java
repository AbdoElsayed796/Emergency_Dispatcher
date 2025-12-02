package smartemergencydispatcher.mapper;


import org.springframework.stereotype.Component;
import smartemergencydispatcher.dto.assignmentdto.AssignmentCreateDTO;
import smartemergencydispatcher.dto.assignmentdto.AssignmentDTO;
import smartemergencydispatcher.dto.assignmentdto.AssignmentDetailDTO;
import smartemergencydispatcher.model.Assignment;
import smartemergencydispatcher.model.Incident;
import smartemergencydispatcher.model.User;
import smartemergencydispatcher.model.Vehicle;

@Component
public class AssignmentMapper {
    private final IncidentMapper incidentMapper;
    private final VehicleMapper vehicleMapper;
    private final UserMapper userMapper;


    public AssignmentMapper(IncidentMapper incidentMapper, VehicleMapper vehicleMapper, UserMapper userMapper) {
        this.incidentMapper = incidentMapper;
        this.vehicleMapper = vehicleMapper;
        this.userMapper = userMapper;
    }

    public AssignmentDTO toDTO(Assignment assignment) {
        return new AssignmentDTO(
                assignment.getAssignmentId(),
                assignment.getIncident().getId(),
                assignment.getVehicle().getId(),
                assignment.getDispatcher().getId(),
                assignment.getTimeAssigned(),
                assignment.getTimeAccepted(),
                assignment.getTimeFinished()
        );
    }

    public AssignmentDetailDTO toDetailDTO(Assignment assignment) {
        return new AssignmentDetailDTO(
                assignment.getAssignmentId(),
                incidentMapper.toDTO(assignment.getIncident()),
                vehicleMapper.toDTO(assignment.getVehicle()),
                userMapper.toDTO(assignment.getDispatcher()),
                assignment.getTimeAssigned(),
                assignment.getTimeAccepted(),
                assignment.getTimeFinished()
        );
    }

    public Assignment toEntity(AssignmentCreateDTO dto, Incident incident, Vehicle vehicle, User dispatcher) {
        Assignment assignment = new Assignment();
        assignment.setIncident(incident);
        assignment.setVehicle(vehicle);
        assignment.setDispatcher(dispatcher);
        assignment.setTimeAssigned(java.time.LocalDateTime.now());
        return assignment;
    }


    //! Can add some mappers

}
