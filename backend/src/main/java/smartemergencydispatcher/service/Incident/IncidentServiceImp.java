package smartemergencydispatcher.service.Incident;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import smartemergencydispatcher.dto.assignmentdto.AssignmentCreateDTO;
import smartemergencydispatcher.dto.incidentdto.IncidentCreateDTO;
import smartemergencydispatcher.dto.incidentdto.IncidentDTO;
import smartemergencydispatcher.dto.incidentdto.IncidentStatusUpdateDTO;
import smartemergencydispatcher.dto.notification.CreateNotificationRequest;
import smartemergencydispatcher.mapper.AssignmentMapper;
import smartemergencydispatcher.mapper.IncidentMapper;
import smartemergencydispatcher.model.Assignment;
import smartemergencydispatcher.model.Incident;
import smartemergencydispatcher.model.User;
import smartemergencydispatcher.model.Vehicle;
import smartemergencydispatcher.model.enums.*;
import smartemergencydispatcher.repository.AssignmentRepository;
import smartemergencydispatcher.repository.IncidentRepository;
import smartemergencydispatcher.repository.UserRepository;
import smartemergencydispatcher.repository.VehicleRepository;
import smartemergencydispatcher.service.AssignmentService;
import smartemergencydispatcher.service.notification.NotificationService;



// Add this:
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.annotation.Propagation;


import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class IncidentServiceImp implements IncidentService {

    private final IncidentRepository incidentRepository;
    private final IncidentMapper incidentMapper;
    private final AssignmentRepository assignmentRepository;
    private final VehicleRepository vehicleRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final NotificationService notificationService;
    private final AssignmentService assignmentService;
    private final UserRepository userRepository;
    private final AssignmentMapper assignmentMapper;

    @Autowired
    public IncidentServiceImp(IncidentRepository incidentRepository,
                              AssignmentRepository assignmentRepository,
                              VehicleRepository vehicleRepository,
                              SimpMessagingTemplate messagingTemplate,
                              NotificationService notificationService,
                              AssignmentService assignmentService,
                              UserRepository userRepository,
                              AssignmentMapper assignmentMapper) {
        this.incidentRepository = incidentRepository;
        this.assignmentRepository = assignmentRepository;
        this.vehicleRepository = vehicleRepository;
        this.messagingTemplate = messagingTemplate;
        this.notificationService = notificationService;
        this.assignmentService = assignmentService;
        this.userRepository = userRepository;
        this.assignmentMapper = assignmentMapper;
        this.incidentMapper = new IncidentMapper();
    }

    @Override
    public IncidentDTO getIncidentById(Integer id) {
        Incident incident = incidentRepository.getIncidentById(id)
                .orElseThrow(() -> new RuntimeException("Incident not found with id: " + id));
        return incidentMapper.toDTO(incident);
    }

    @Override
    public List<IncidentDTO> getIncidentByStatus(IncidentStatus status) {
        List<Incident> incidents = incidentRepository.getIncidentByStatus(status);
        List<IncidentDTO> incidentDTOs = new ArrayList<>();
        for (Incident i : incidents) {
            incidentDTOs.add(incidentMapper.toDTO(i));
        }
        return incidentDTOs;
    }

    @Override
    public List<IncidentDTO> getIncidentByType(IncidentType type) {
        List<Incident> incidents = incidentRepository.getIncidentByType(type);
        List<IncidentDTO> incidentDTOs = new ArrayList<>();
        for (Incident i : incidents) {
            incidentDTOs.add(incidentMapper.toDTO(i));
        }
        return incidentDTOs;
    }

    @Override
    public List<IncidentDTO> getIncidentBySeverity(SeverityLevel severityLevel) {
        List<Incident> incidents = incidentRepository.getIncidentBySeverity(severityLevel);
        List<IncidentDTO> incidentDTOs = new ArrayList<>();
        for (Incident i : incidents) {
            incidentDTOs.add(incidentMapper.toDTO(i));
        }
        return incidentDTOs;
    }

    @Override
    public List<IncidentDTO> findAll() {
        List<Incident> incidents = incidentRepository.findAll();
        List<IncidentDTO> incidentDTOs = new ArrayList<>();
        for (Incident i : incidents) {
            incidentDTOs.add(incidentMapper.toDTO(i));
        }
        messagingTemplate.convertAndSend("/topic/incidents", incidentDTOs);
        return incidentDTOs;
    }

    @Override
    public void deleteById(Integer id) {
        incidentRepository.deleteById(id);
        findAll();
    }

    @Override
    public IncidentDTO save(IncidentCreateDTO incidentCreateDTO) {
        Incident incident = incidentMapper.toEntity(incidentCreateDTO);
        incident.setReportedTime(LocalDateTime.now());
        incident.setStatus(IncidentStatus.REPORTED);

        Incident saved = incidentRepository.saveAndFlush(incident);
        findAll();

        // Notification for dispatcher
        CreateNotificationRequest createNotificationRequest = new CreateNotificationRequest(
                Role.DISPATCHER, NotificationType.NEW_INCIDENT, saved.getId());
        notificationService.createNotification(createNotificationRequest);

        // Assign nearest vehicle
        Optional<Vehicle> nearestVehicleOpt = vehicleRepository.findNearestVehicle(
                incidentCreateDTO.getType().toString(),
                VehicleStatus.AVAILABLE.toString(),
                incidentCreateDTO.getLocation().getLatitude(),
                incidentCreateDTO.getLocation().getLongitude()
        );

        if (nearestVehicleOpt.isPresent()) {
            Vehicle nearestVehicle = nearestVehicleOpt.get();
            AssignmentCreateDTO assignmentCreateDTO = new AssignmentCreateDTO();
            assignmentCreateDTO.setIncidentId(saved.getId());
            assignmentCreateDTO.setVehicleId(nearestVehicle.getId());
            assignmentCreateDTO.setDispatcherId(1);

            try {
                assign(assignmentCreateDTO);
            } catch (Exception e) {
                System.err.println("Assignment failed: " + e.getMessage());
            }
        } else {
            CreateNotificationRequest createNotificationRequest1 =
                    new CreateNotificationRequest(Role.ADMIN, NotificationType.NON_AVAILABLE_VEHICLE, incident.getId());
            notificationService.createNotification(createNotificationRequest1);
            System.out.println("No available vehicle found for incident " + saved.getId());
        }

        return incidentMapper.toDTO(saved);
    }

    @Override
    public IncidentDTO updateIncident(Integer id, IncidentDTO incidentDTO) {
        Incident incident = incidentRepository.getIncidentById(id)
                .orElseThrow(() -> new RuntimeException("Incident not found with id: " + id));

        if (!incidentDTO.getSeverityLevel().equals(incident.getSeverityLevel())) {
            incident.setSeverityLevel(incidentDTO.getSeverityLevel());
        }
        if (!incidentDTO.getStatus().equals(incident.getStatus())) {
            incident.setStatus(incidentDTO.getStatus());
            if (incidentDTO.getStatus().equals(IncidentStatus.RESOLVED)) {
                notificationService.updateNotificationStatus(incidentDTO.getId());
            }
        }

        Incident updated = incidentRepository.saveAndFlush(incident);
        findAll();
        return incidentMapper.toDTO(updated);
    }

    @Override
    public List<IncidentDTO> getActiveIncidents() {
        return incidentRepository.findByStatusActive().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private IncidentDTO convertToDTO(Incident incident) {
        return incidentMapper.toDTO(incident);
    }

    public List<IncidentDTO> getAllIncidents() {
        return incidentRepository.findAllIncidents().stream()
                .map(incidentMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public IncidentDTO updateIncidentStatus(Integer id, IncidentStatusUpdateDTO statusUpdateDTO) {
        System.out.println("updateIncidentStatus called");

        // 1️⃣ Fetch the incident
        Incident incident = incidentRepository.getIncidentById(id)
                .orElseThrow(() -> new RuntimeException("Incident not found"));

        // 2️⃣ Fetch assigned vehicle
        Vehicle detachedVehicle = assignmentRepository.findVehicleByIncidentId(id)
                .orElseThrow(() -> new RuntimeException("Vehicle not found for incident"));
        Vehicle vehicle = vehicleRepository.findById(detachedVehicle.getId())
                .orElseThrow(() -> new RuntimeException("Vehicle not found in repository"));

        // 3️⃣ Release the vehicle
        vehicle.setStatus(VehicleStatus.AVAILABLE);
        vehicleRepository.saveAndFlush(vehicle);
        System.out.println("Vehicle released: " + vehicle.getId());

        // 4️⃣ Update incident status
        incident.setStatus(statusUpdateDTO.getStatus());
        Incident updatedIncident = incidentRepository.saveAndFlush(incident);

        // 5️⃣ Update notification if resolved
        if (statusUpdateDTO.getStatus().equals(IncidentStatus.RESOLVED)) {
            notificationService.updateNotificationStatus(id);
        }

        Assignment assignment = assignmentRepository.findByIncidentId(id.longValue())
                .orElseThrow(() -> new RuntimeException("Assignment not found for incident"));
        assignmentRepository.updateTimeAcceptedAndFinished(assignment.getAssignmentId());
        System.out.println("Assignment finished time updated for incident: " + id);

        // 6️⃣ Assign vehicle to oldest reported incident
        Optional<Incident> oldestOpt = incidentRepository.findFirstByStatusOrderByReportedTimeAsc(IncidentStatus.REPORTED);
        oldestOpt.ifPresent(oldestIncident -> {
            VehicleType requiredType = mapIncidentToVehicleType(oldestIncident.getType());
            List<Vehicle> availableVehicles = vehicleRepository.findAvailableVehiclesForType(VehicleStatus.AVAILABLE, requiredType);

            if (!availableVehicles.isEmpty()) {
                Vehicle vehicleToAssign = availableVehicles.get(0);
                int retries = 5;
                while (retries-- > 0) {
                    AssignmentCreateDTO assignmentDTO = new AssignmentCreateDTO();
                    assignmentDTO.setIncidentId(oldestIncident.getId());
                    assignmentDTO.setVehicleId(vehicleToAssign.getId());
                    assignmentDTO.setDispatcherId(1);

                    try {
                        assign(assignmentDTO);
                        System.out.println("Assigned vehicle " + vehicleToAssign.getId() + " to incident " + oldestIncident.getId());
                        break;
                    } catch (Exception e) {
                        System.out.println("Retry failed, " + retries + " attempts left: " + e.getMessage());
                        try { Thread.sleep(500); } catch (InterruptedException ie) { Thread.currentThread().interrupt(); }
                    }
                }
            }
        });

        return incidentMapper.toDTO(updatedIncident);
    }

    private VehicleType mapIncidentToVehicleType(IncidentType incidentType) {
        return switch (incidentType) {
            case POLICE -> VehicleType.POLICE;
            case FIRE -> VehicleType.FIRE;
            case MEDICAL -> VehicleType.MEDICAL;
            default -> throw new IllegalArgumentException("Unknown incident type: " + incidentType);
        };
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public Object assign(AssignmentCreateDTO assignmentCreateDTO) {
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
        vehicleRepository.saveAndFlush(vehicle);

        incident.setStatus(IncidentStatus.ASSIGNED);
        incidentRepository.saveAndFlush(incident);

        // Save assignment safely
        try {
            Assignment saved = assignmentRepository.saveAndFlush(assignment);
            assignmentService.triggerVehicleSimulation(vehicle, incident);
            return saved;
        } catch (DataIntegrityViolationException e) {
            return null;
        }
    }
}
