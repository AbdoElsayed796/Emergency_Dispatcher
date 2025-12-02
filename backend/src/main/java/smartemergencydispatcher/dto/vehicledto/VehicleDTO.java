package smartemergencydispatcher.dto.vehicledto;

import lombok.*;
import smartemergencydispatcher.dto.locationDTO.LocationDTO;
import smartemergencydispatcher.model.enums.VehicleType;
import smartemergencydispatcher.model.enums.VehicleStatus;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VehicleDTO {
    private Integer id;
    private VehicleType type;
    private VehicleStatus status;
    private Integer capacity;
    private LocationDTO location;
    private Integer stationId;
    private String stationName;
    private Integer responderId;
    private String responderName;
}