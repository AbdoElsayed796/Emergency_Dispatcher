package smartemergencydispatcher.dto.stationdto;


import lombok.*;
import smartemergencydispatcher.dto.locationDTO.LocationDTO;
import smartemergencydispatcher.model.enums.StationType;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class StationDTO {
    private Integer id;
    private StationType type;
    private String name;
    private String phone;
    private LocationDTO location;
}
