package smartemergencydispatcher.service.assignment;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import smartemergencydispatcher.dto.assignmentdto.AssignmentDTO;
import smartemergencydispatcher.mapper.AssignmentMapper;
import smartemergencydispatcher.model.Assignment;
import smartemergencydispatcher.model.enums.IncidentStatus;
import smartemergencydispatcher.repository.AssignmentRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AssignmentServiceImpl implements AssignmentService {

    private final AssignmentRepository assignmentRepository;
    private final AssignmentMapper assignmentMapper;

    @Override
    public List<AssignmentDTO> getAssignmentsByVehicleId(Integer vehicleId) {
        return assignmentRepository.findAllAssignmentsByVehicleId(vehicleId)
                .stream()
                .map(assignmentMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public AssignmentDTO accept(Integer assignmentId) {
        Assignment assignment = assignmentRepository.findById(assignmentId).orElseThrow();
        assignment.setTimeAccepted(LocalDateTime.now());
        return assignmentMapper.toDTO(assignmentRepository.save(assignment));
    }

    @Override
    public AssignmentDTO resolve(Integer assignmentId) {
        Assignment assignment = assignmentRepository.findById(assignmentId).orElseThrow();
        assignment.setTimeFinished(LocalDateTime.now());
        assignment.getIncident().setStatus(IncidentStatus.RESOLVED);
        return assignmentMapper.toDTO(assignmentRepository.save(assignment));
    }
}
