package smartemergencydispatcher.dto.assignmentdto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
class AssignmentCompleteDTO {
    private LocalDateTime timeFinished;
}
