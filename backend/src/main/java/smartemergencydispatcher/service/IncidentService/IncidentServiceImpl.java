package smartemergencydispatcher.service.IncidentService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import smartemergencydispatcher.dto.incidentdto.IncidentDTO;
import smartemergencydispatcher.mapper.IncidentMapper;
import smartemergencydispatcher.model.Incident;
import smartemergencydispatcher.repository.IncidentRepository;
import smartemergencydispatcher.service.IncidentService.IncidentService;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class IncidentServiceImpl implements IncidentService {

    private final IncidentRepository incidentRepository;
    IncidentMapper incidentMapper = new IncidentMapper();
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
}
