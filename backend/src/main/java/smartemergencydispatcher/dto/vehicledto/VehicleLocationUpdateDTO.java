package smartemergencydispatcher.dto.vehicledto;


import lombok.*;
import smartemergencydispatcher.dto.locationDTO.LocationDTO;


@Data
@NoArgsConstructor
@AllArgsConstructor
class VehicleLocationUpdateDTO {
    private LocationDTO location;
}
