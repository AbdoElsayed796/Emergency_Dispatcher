package smartemergencydispatcher.dto.vehicledto;

import lombok.*;
import smartemergencydispatcher.dto.locationDTO.LocationDTO;
import smartemergencydispatcher.model.enums.VehicleStatus;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class VehicleDataDTO {
    private Integer id ;
    private VehicleStatus status ;
    private LocationDTO locationDTO;
}
