package smartemergencydispatcher.dto.statsdto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StatsDTO {
    private long totalUsers;
    private long activeVehicles;
    private long availableVehicles;
    private long stations;
    private long activeIncidents;
    private long pendingRequests;
}
