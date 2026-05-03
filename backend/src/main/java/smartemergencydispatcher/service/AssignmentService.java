package smartemergencydispatcher.service;

import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import smartemergencydispatcher.dto.assignmentdto.AssignmentCreateDTO;
import smartemergencydispatcher.dto.simulation.SimulationRequestDTO;
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
import org.locationtech.jts.geom.Point;
import smartemergencydispatcher.service.SimulationService.SimulationService;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AssignmentService {

    private final AssignmentRepository assignmentRepository;
    private final IncidentRepository incidentRepository;
    private final VehicleRepository vehicleRepository;
    private final UserRepository userRepository;
    private final AssignmentMapper assignmentMapper;
    private final SimulationService simulationService;

    @Transactional
    public Assignment assignVehicleToIncident(AssignmentCreateDTO assignmentCreateDTO) {
        Long incidentId = Long.valueOf(assignmentCreateDTO.getIncidentId());
        Long vehicleId = Long.valueOf(assignmentCreateDTO.getVehicleId());
        Long dispatcherId = Long.valueOf(assignmentCreateDTO.getDispatcherId());

        // Check if incident already has assignment
        if (assignmentRepository.findByIncidentId(incidentId).isPresent()) {
            return null; // already assigned
        }

        // Fetch entities
        Incident incident = incidentRepository.getIncidentById(Math.toIntExact(incidentId))
                .orElseThrow(() -> new RuntimeException("Incident not found"));
        Vehicle vehicle = vehicleRepository.findVehicleByID(Math.toIntExact(vehicleId))
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));
        User dispatcher = userRepository.findUserByID(Math.toIntExact(dispatcherId))
                .orElseThrow(() -> new RuntimeException("Dispatcher not found"));

        // Check incident status
        if (!incident.getStatus().equals(IncidentStatus.REPORTED) &&
                !incident.getStatus().equals(IncidentStatus.ASSIGNED)) {
            throw new RuntimeException("Incident not assignable");
        }

        // Create assignment
        Assignment assignment = assignmentMapper.toEntity(incident, vehicle, dispatcher);
        assignment.setTimeAssigned(LocalDateTime.now());

        // Update vehicle and incident
        vehicle.setStatus(VehicleStatus.BUSY);
        vehicleRepository.save(vehicle);

        incident.setStatus(IncidentStatus.ASSIGNED);
        incidentRepository.save(incident);

        // Save assignment safely
        try {
            Assignment saved = assignmentRepository.save(assignment);
            triggerVehicleSimulation(vehicle, incident);
            return saved;
        } catch (DataIntegrityViolationException e) {
            return null;
        }
    }

    public void triggerVehicleSimulation(Vehicle vehicle, Incident incident) {
        try {
            SimulationRequestDTO simulationRequest = new SimulationRequestDTO();
            simulationRequest.setVehicleId(vehicle.getId());
            simulationRequest.setIncidentId(incident.getId());
            simulationRequest.setStartLatitude(vehicle.getLocation().getY());
            simulationRequest.setStartLongitude(vehicle.getLocation().getX());
            simulationRequest.setEndLatitude(incident.getLocation().getY());
            simulationRequest.setEndLongitude(incident.getLocation().getX());
            simulationRequest.setInterval(0.2);
            simulationService.startSimulation(simulationRequest);
        } catch (Exception e) {
            System.err.println("⚠️ Simulation failed: " + e.getMessage());
        }
    }
}
