package smartemergencydispatcher.dto.assignmentdto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
class AssignmentAcceptDTO {
    private LocalDateTime timeAccepted;
}