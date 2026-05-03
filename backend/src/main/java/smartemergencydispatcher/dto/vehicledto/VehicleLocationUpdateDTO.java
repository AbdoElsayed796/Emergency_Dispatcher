package smartemergencydispatcher.dto.vehicledto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VehicleLocationUpdateDTO {
    private Integer vehicleId;
    private Double latitude;
    private Double longitude;
    private String status; // "BUSY", "AVAILABLE", etc.
}