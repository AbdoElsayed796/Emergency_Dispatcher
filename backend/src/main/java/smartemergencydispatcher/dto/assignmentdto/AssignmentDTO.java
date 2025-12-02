package smartemergencydispatcher.dto.assignmentdto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssignmentDTO {
    private Integer assignmentId;
    private Integer incidentId;
    private Integer vehicleId;
    private Integer dispatcherId;
    private LocalDateTime timeAssigned;
    private LocalDateTime timeAccepted;
    private LocalDateTime timeFinished;
}
