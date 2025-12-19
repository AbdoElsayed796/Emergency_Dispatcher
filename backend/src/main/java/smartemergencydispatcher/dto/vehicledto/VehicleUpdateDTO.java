package smartemergencydispatcher.dto.vehicledto;

import lombok.*;
import smartemergencydispatcher.dto.locationDTO.LocationDTO;
import smartemergencydispatcher.model.enums.VehicleStatus;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class VehicleUpdateDTO {
    private VehicleStatus status;
    private Integer capacity;
    private LocationDTO location;
    private Integer responderId;
}
