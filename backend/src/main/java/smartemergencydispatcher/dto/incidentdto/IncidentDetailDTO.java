package smartemergencydispatcher.dto.incidentdto;

import lombok.*;
import smartemergencydispatcher.dto.locationDTO.LocationDTO;
import smartemergencydispatcher.model.enums.IncidentStatus;
import smartemergencydispatcher.model.enums.IncidentType;
import smartemergencydispatcher.model.enums.SeverityLevel;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
class IncidentDetailDTO {
    private Integer id;
    private IncidentType type;
    private SeverityLevel severityLevel;
    private IncidentStatus status;
    private LocalDateTime reportedTime;
    private LocationDTO location;
    private Integer assignedVehiclesCount;
}
