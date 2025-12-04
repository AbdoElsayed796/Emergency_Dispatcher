package smartemergencydispatcher.dto.assignmentdto;

import lombok.*;
import smartemergencydispatcher.dto.incidentdto.IncidentDTO;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssignmentDTO {
    private Integer id;
    private IncidentDTO incident;
    private LocalDateTime timeAssigned;
    private LocalDateTime timeAccepted;
    private LocalDateTime timeFinished;
}
