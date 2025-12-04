package smartemergencydispatcher.dto.vehicledto;



import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import smartemergencydispatcher.dto.vehicledto.VehicleDTO;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VehiclePerformanceDTO {

    private VehicleDTO vehicle;
    private double minResponseTime;
    private double avgResponseTime;
    private long totalAssignments;
}
