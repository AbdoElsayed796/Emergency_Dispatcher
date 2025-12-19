package smartemergencydispatcher.service.Incident;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import smartemergencydispatcher.dto.incidentdto.IncidentCreateDTO;
import smartemergencydispatcher.dto.incidentdto.IncidentDTO;
import smartemergencydispatcher.dto.incidentdto.IncidentStatusUpdateDTO;
import smartemergencydispatcher.mapper.IncidentMapper;
import smartemergencydispatcher.model.Incident;
import smartemergencydispatcher.model.Vehicle;
import smartemergencydispatcher.model.enums.IncidentStatus;
import smartemergencydispatcher.model.enums.IncidentType;
import smartemergencydispatcher.model.enums.SeverityLevel;
import smartemergencydispatcher.model.enums.VehicleStatus;
import smartemergencydispatcher.repository.AssignmentRepository;
import smartemergencydispatcher.repository.IncidentRepository;
import smartemergencydispatcher.repository.VehicleRepository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;



@Service
public class IncidentServiceImp implements IncidentService{
    private final IncidentRepository incidentRepository;
    private final IncidentMapper incidentMapper;
    private final AssignmentRepository assignmentRepository;
    private final VehicleRepository vehicleRepository ;
    @Autowired
    public IncidentServiceImp(IncidentRepository incidentRepository,
                              AssignmentRepository assignmentRepository, VehicleRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
        this.incidentMapper = new IncidentMapper();
        this.incidentRepository = incidentRepository;
        this.assignmentRepository = assignmentRepository;
    }

    @Override
    public IncidentDTO getIncidentById(Integer id) {
        Incident incident = incidentRepository.getIncidentById(id).orElseThrow(() -> new RuntimeException("Incident not found with id: " + id));;
        return incidentMapper.toDTO(incident);
    }

    @Override
    public List<IncidentDTO> getIncidentByStatus(IncidentStatus status) {
        List<Incident> incident = incidentRepository.getIncidentByStatus(status);
        List<IncidentDTO> incidentDTOs = new ArrayList<>();
        if(incident.isEmpty()){
            return incidentDTOs;
        }
        for (Incident i : incident) {
            incidentDTOs.add(incidentMapper.toDTO(i));
        }
        return incidentDTOs;
    }

    @Override
    public List<IncidentDTO> getIncidentByType(IncidentType type) {

        List<Incident> incident = incidentRepository.getIncidentByType(type);
        List<IncidentDTO> incidentDTOs = new ArrayList<>();
        if(incident.isEmpty()){
            return incidentDTOs;
        }
        for (Incident i : incident) {
            incidentDTOs.add(incidentMapper.toDTO(i));
        }
        return incidentDTOs;
    }

    @Override
    public List<IncidentDTO> getIncidentBySeverity(SeverityLevel severityLevel) {
        List<Incident> incident = incidentRepository.getIncidentBySeverity(severityLevel);
        List<IncidentDTO> incidentDTOs = new ArrayList<>();
        if(incident.isEmpty()){
            return incidentDTOs;
        }
        for (Incident i : incident) {
            incidentDTOs.add(incidentMapper.toDTO(i));
        }
        return incidentDTOs;
    }

    @Override
    public List<IncidentDTO> findAll() {
        List<Incident> incidents = incidentRepository.findAll();
        List<IncidentDTO> incidentDTOs = new ArrayList<>();
        if(!incidents.isEmpty()){
            for (Incident i : incidents) {

                incidentDTOs.add(incidentMapper.toDTO(i));
            }
        }
        return incidentDTOs;
    }
    @Override
    public void deleteById(Integer id) {
        incidentRepository.deleteById(id);
    }

    @Override
    public IncidentDTO save(IncidentCreateDTO incidentCreateDTO) {
        Incident incident = incidentMapper.toEntity(incidentCreateDTO);
        incident.setReportedTime(LocalDateTime.now());
        incident.setStatus(IncidentStatus.REPORTED);
        System.out.println("Incident = " + incident);
        System.out.println("POINT = " + incident.getLocation());
        Incident saved = incidentRepository.save(incident);
        return incidentMapper.toDTO(saved);
    }

    @Override
    public IncidentDTO updateIncident(Integer id, IncidentDTO incidentDTO) {
        Incident incident = incidentRepository.getIncidentById(id).orElseThrow(() -> new RuntimeException("Incident not found with id: " + id));;
        if (incident == null) {
            return new IncidentDTO();
        }
        if (!incidentDTO.getSeverityLevel().equals(incident.getSeverityLevel())){
            incident.setSeverityLevel(incidentDTO.getSeverityLevel());
        }
        if (!incidentDTO.getStatus().equals(incident.getStatus())){
            incident.setStatus(incidentDTO.getStatus());
        }
        Incident updated = incidentRepository.updateIncident(id, incident.getStatus(), incident.getSeverityLevel());
        return incidentMapper.toDTO(updated);

    }
    @Override
    public List<IncidentDTO> getActiveIncidents() {
        return incidentRepository.findByStatusActive()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private IncidentDTO convertToDTO(Incident incident) {
       return incidentMapper.toDTO(incident);
    }
    public List<IncidentDTO> getAllIncidents(){
        List<Incident> incidents = incidentRepository.findAllIncidents();
        return incidents.stream().map(incidentMapper::toDTO).collect(Collectors.toList());
    }


    @Transactional
    public IncidentDTO updateIncidentStatus(Integer id, IncidentStatusUpdateDTO statusUpdateDTO){
        Incident incident = incidentRepository.getIncidentById(id)
                .orElseThrow(() -> new RuntimeException("Incident not found with id: " + id));

        incident.setStatus(statusUpdateDTO.getStatus());
        Incident updatedIncident = incidentRepository.save(incident);

        return incidentMapper.toDTO(updatedIncident);
    }
}
