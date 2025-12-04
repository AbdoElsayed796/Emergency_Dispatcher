package smartemergencydispatcher.service.assignment;

import smartemergencydispatcher.dto.assignmentdto.AssignmentDTO;

import java.util.List;

public interface AssignmentService {
    List<AssignmentDTO> getAssignmentsByVehicleId(Integer vehicleId);
    AssignmentDTO accept(Integer assignmentId);
    AssignmentDTO resolve(Integer assignmentId);
}
