package smartemergencydispatcher.dto.vehicledto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VehicleLiveDTO {
    private Integer id;
    private double latitude;
    private double longitude;
    private String status;
    private String type;
}
