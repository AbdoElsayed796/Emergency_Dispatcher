package smartemergencydispatcher.dto.incidentdto;


import lombok.*;
import smartemergencydispatcher.model.enums.IncidentStatus;
import smartemergencydispatcher.model.enums.SeverityLevel;


@Data
@NoArgsConstructor
@AllArgsConstructor
class IncidentUpdateDTO {
    private SeverityLevel severityLevel;
    private IncidentStatus status;
}
