package smartemergencydispatcher.service;


import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import smartemergencydispatcher.dto.assignmentdto.AssignmentCreateDTO;
import smartemergencydispatcher.mapper.AssignmentMapper;
import smartemergencydispatcher.model.Assignment;
import smartemergencydispatcher.model.Incident;
import smartemergencydispatcher.model.User;
import smartemergencydispatcher.model.Vehicle;
import smartemergencydispatcher.repository.AssignmentRepository;
import smartemergencydispatcher.repository.IncidentRepository;
import smartemergencydispatcher.repository.UserRepository;
import smartemergencydispatcher.repository.VehicleRepository;
import smartemergencydispatcher.model.enums.IncidentStatus;
import smartemergencydispatcher.model.enums.VehicleStatus;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AssignmentService {

    private final AssignmentRepository assignmentRepository;
    private final IncidentRepository incidentRepository;
    private final VehicleRepository vehicleRepository;
    private final UserRepository userRepository;
    private final AssignmentMapper assignmentMapper;

    @Transactional
    public Assignment assignVehicleToIncident(AssignmentCreateDTO assignmentCreateDTO){
        Incident incident = incidentRepository.findIncidentById(assignmentCreateDTO.getIncidentId())
                .orElseThrow(() -> new RuntimeException("Incident not found with id: "
                        + assignmentCreateDTO.getIncidentId()));

        Vehicle vehicle = vehicleRepository.findVehicleByID(assignmentCreateDTO.getVehicleId())
                .orElseThrow(() -> new RuntimeException("Vehicle not found with id: "
                        + assignmentCreateDTO.getVehicleId()));

        User dispatcher = userRepository.findUserByID(assignmentCreateDTO.getDispatcherId())
                .orElseThrow(() -> new RuntimeException("Dispatcher not found with id: "
                        + assignmentCreateDTO.getDispatcherId()));

        // Check if incident is assignable
        if (!IncidentStatus.REPORTED.equals(incident.getStatus()) && !IncidentStatus.ASSIGNED.equals(incident.getStatus())) {
            throw new RuntimeException("Incident cannot be assigned. Current status: " + incident.getStatus());
        }

        Assignment assignment = assignmentMapper.toEntity(incident, vehicle, dispatcher);
        assignment.setTimeAssigned(LocalDateTime.now());

        vehicle.setStatus(VehicleStatus.BUSY);
        vehicleRepository.save(vehicle);

        incident.setStatus(IncidentStatus.ASSIGNED);
        incidentRepository.save(incident);

        return assignmentRepository.save(assignment);
    }
}
