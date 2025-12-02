package smartemergencydispatcher.dto.assignmentdto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
class AssignmentStatusDTO {
    private Integer assignmentId;
    private Long durationMinutes;
}
