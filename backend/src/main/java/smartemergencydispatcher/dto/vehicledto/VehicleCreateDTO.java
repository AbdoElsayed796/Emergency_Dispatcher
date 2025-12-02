package smartemergencydispatcher.dto.vehicledto;

import lombok.*;
import smartemergencydispatcher.dto.locationDTO.LocationDTO;
import smartemergencydispatcher.model.enums.VehicleType;
import smartemergencydispatcher.model.enums.VehicleStatus;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VehicleCreateDTO {
    private VehicleType type;
    private VehicleStatus status;
    private Integer capacity;
    private LocationDTO location;
    private Integer stationId;
    private Integer responderId;
}
