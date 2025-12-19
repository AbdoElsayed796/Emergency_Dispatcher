package smartemergencydispatcher.dto.vehicledto;

import lombok.*;
import smartemergencydispatcher.model.enums.VehicleStatus;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VehicleStatusUpdateDTO {
    private VehicleStatus status;
}
