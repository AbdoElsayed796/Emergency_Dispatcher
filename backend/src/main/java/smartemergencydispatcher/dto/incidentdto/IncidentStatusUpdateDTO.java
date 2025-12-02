package smartemergencydispatcher.dto.incidentdto;

import lombok.*;
import smartemergencydispatcher.model.enums.IncidentStatus;


@Data
@NoArgsConstructor
@AllArgsConstructor
class IncidentStatusUpdateDTO {
    private IncidentStatus status;
}
