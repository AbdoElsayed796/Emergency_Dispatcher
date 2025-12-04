package smartemergencydispatcher.service.Incident;

import smartemergencydispatcher.dto.incidentdto.IncidentCreateDTO;
import smartemergencydispatcher.dto.incidentdto.IncidentDTO;
import smartemergencydispatcher.model.enums.IncidentStatus;
import smartemergencydispatcher.model.enums.IncidentType;
import smartemergencydispatcher.model.enums.SeverityLevel;

import java.util.List;
public interface IncidentService {
    IncidentDTO getIncidentById(Integer id);
    List<IncidentDTO> getIncidentByStatus(IncidentStatus status);
    List<IncidentDTO> getIncidentByType( IncidentType type);
    List<IncidentDTO> getIncidentBySeverity( SeverityLevel severity);
    List<IncidentDTO> findAll();
    void deleteById(Integer id);
    IncidentDTO save(IncidentCreateDTO incidentCreateDTO);
    IncidentDTO updateIncident( Integer id, IncidentDTO incidentDTO);
}
