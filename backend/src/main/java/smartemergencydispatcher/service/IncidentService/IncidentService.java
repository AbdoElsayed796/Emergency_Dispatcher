package smartemergencydispatcher.service.IncidentService;


import smartemergencydispatcher.dto.incidentdto.IncidentDTO;
import java.util.List;

public interface IncidentService {
    List<IncidentDTO> getActiveIncidents();
}
