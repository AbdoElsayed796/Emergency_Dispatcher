package smartemergencydispatcher.service.Incident;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import smartemergencydispatcher.dto.incidentdto.IncidentCreateDTO;
import smartemergencydispatcher.dto.incidentdto.IncidentDTO;
import smartemergencydispatcher.mapper.IncidentMapper;
import smartemergencydispatcher.model.Incident;
import smartemergencydispatcher.model.enums.IncidentStatus;
import smartemergencydispatcher.model.enums.IncidentType;
import smartemergencydispatcher.model.enums.SeverityLevel;
import smartemergencydispatcher.repository.IncidentRepository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
@Service
public class IncidentServiceImp implements IncidentService{
    private final IncidentRepository incidentRepository;
    private final IncidentMapper incidentMapper;
    @Autowired
    public IncidentServiceImp(IncidentRepository incidentRepository) {
        this.incidentMapper = new IncidentMapper();
        this.incidentRepository = incidentRepository;
    }
    @Override
    public IncidentDTO getIncidentById(Integer id) {
        Incident incident = incidentRepository.getIncidentById(id);
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
        Incident incident = incidentRepository.getIncidentById(id);
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
}
