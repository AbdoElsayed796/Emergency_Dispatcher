package smartemergencydispatcher.dto.vehicledto;


import lombok.*;
import smartemergencydispatcher.dto.locationDTO.LocationDTO;
import smartemergencydispatcher.model.enums.VehicleStatus;
import smartemergencydispatcher.model.enums.VehicleType;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AvailableVehicleDTO {
    private Integer id;
    private VehicleType type;
    private Integer capacity;
    private LocationDTO location;
    private Integer stationId;
    private String stationName;
    private Integer responderId;
    private String responderName;
}
