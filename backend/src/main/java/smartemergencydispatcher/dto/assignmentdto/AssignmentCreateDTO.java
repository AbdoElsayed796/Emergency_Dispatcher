package smartemergencydispatcher.dto.assignmentdto;


import lombok.*;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class AssignmentCreateDTO {
    private Integer incidentId;
    private Integer vehicleId;
    private Integer dispatcherId;
}