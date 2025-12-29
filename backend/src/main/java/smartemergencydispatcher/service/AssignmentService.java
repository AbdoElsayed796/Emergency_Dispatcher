package smartemergencydispatcher.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
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

import java.time.LocalDateTime;

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
    public Assignment assignVehicleToIncident(AssignmentCreateDTO assignmentCreateDTO){
        Incident incident = incidentRepository.getIncidentById(assignmentCreateDTO.getIncidentId())
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

        Assignment savedAssignment = assignmentRepository.save(assignment);

        // 🚀 TRIGGER SIMULATION
        triggerVehicleSimulation(vehicle, incident);

        return savedAssignment;
    }

    private void triggerVehicleSimulation(Vehicle vehicle, Incident incident) {
        try {
            Point vehicleLocation = vehicle.getLocation();
            Point incidentLocation = incident.getLocation();

            SimulationRequestDTO simulationRequest = new SimulationRequestDTO();
            simulationRequest.setVehicleId(vehicle.getId());
            simulationRequest.setIncidentId(incident.getId());
            simulationRequest.setStartLatitude(vehicleLocation.getY());
            simulationRequest.setStartLongitude(vehicleLocation.getX());
            simulationRequest.setEndLatitude(incidentLocation.getY());
            simulationRequest.setEndLongitude(incidentLocation.getX());
            simulationRequest.setInterval(0.2); // Update every 0.5 seconds

            simulationService.startSimulation(simulationRequest);

            System.out.println("🎯 Simulation triggered: Vehicle " + vehicle.getId()
                    + " → Incident at (" + incidentLocation.getY() + ", " + incidentLocation.getX() + ")");

        } catch (Exception e) {
            System.err.println("⚠️ Failed to trigger simulation: " + e.getMessage());
            // Don't fail the assignment if simulation fails
        }
    }
}