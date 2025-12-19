package smartemergencydispatcher.dto.vehicledto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import smartemergencydispatcher.model.enums.VehicleType;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VehicleUtilizationDTO {
    private String type;
    private double utilizationRate;
    private long hoursActive;
    private long totalTasks;

}
