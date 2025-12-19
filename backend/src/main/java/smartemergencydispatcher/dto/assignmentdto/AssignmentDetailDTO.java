package smartemergencydispatcher.dto.assignmentdto;


import lombok.*;
import smartemergencydispatcher.dto.incidentdto.IncidentDTO;
import smartemergencydispatcher.dto.userdto.UserDTO;
import smartemergencydispatcher.dto.vehicledto.VehicleDTO;
import java.time.LocalDateTime;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssignmentDetailDTO {
    private Integer assignmentId;
    private IncidentDTO incident;
    private VehicleDTO vehicle;
    private UserDTO dispatcher;
    private LocalDateTime timeAssigned;
    private LocalDateTime timeAccepted;
    private LocalDateTime timeFinished;
}
