package smartemergencydispatcher.service;


import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import smartemergencydispatcher.dto.incidentdto.IncidentDTO;
import smartemergencydispatcher.dto.incidentdto.IncidentStatusUpdateDTO;
import smartemergencydispatcher.mapper.IncidentMapper;
import smartemergencydispatcher.model.Incident;
import smartemergencydispatcher.repository.IncidentRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class IncidentService {

    private final IncidentRepository incidentRepository;
    private final IncidentMapper incidentMapper;


    public List<IncidentDTO> getAllIncidents(){
        List<Incident> incidents = incidentRepository.findAllIncidents();
        return incidents.stream().map(incidentMapper::toDTO).collect(Collectors.toList());
    }


    @Transactional
    public IncidentDTO updateIncidentStatus(Integer id, IncidentStatusUpdateDTO statusUpdateDTO){
        Incident incident = incidentRepository.findIncidentById(id)
                .orElseThrow(() -> new RuntimeException("Incident not found with id: " + id));

        incident.setStatus(statusUpdateDTO.getStatus());
        Incident updatedIncident = incidentRepository.save(incident);

        return incidentMapper.toDTO(updatedIncident);
    }
}
