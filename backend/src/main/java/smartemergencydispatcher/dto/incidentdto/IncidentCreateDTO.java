package smartemergencydispatcher.dto.incidentdto;

import lombok.*;
import smartemergencydispatcher.dto.locationDTO.LocationDTO;
import smartemergencydispatcher.model.enums.IncidentStatus;
import smartemergencydispatcher.model.enums.IncidentType;
import smartemergencydispatcher.model.enums.SeverityLevel;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class IncidentCreateDTO {
    private IncidentType type;
    private SeverityLevel severityLevel;
    private IncidentStatus incidentStatus;
    private LocationDTO location;
}
