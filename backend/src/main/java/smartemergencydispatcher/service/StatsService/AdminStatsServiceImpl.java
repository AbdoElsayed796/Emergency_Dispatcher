package smartemergencydispatcher.service.StatsService;




import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import smartemergencydispatcher.dto.statsdto.StatsDTO;
import smartemergencydispatcher.model.enums.VehicleStatus;
import smartemergencydispatcher.repository.UserRepository;
import smartemergencydispatcher.repository.VehicleRepository;
import smartemergencydispatcher.repository.StationRepository;
import smartemergencydispatcher.repository.IncidentRepository;
import smartemergencydispatcher.model.enums.IncidentStatus;
import smartemergencydispatcher.service.StatsService.AdminStatsService;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminStatsServiceImpl implements AdminStatsService {

    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;
    private final StationRepository stationRepository;
    private final IncidentRepository incidentRepository;

    @Override
    public StatsDTO getStats() {
        long totalUsers = userRepository.count();
        long activeVehicles = vehicleRepository.countByStatusIn(List.of(VehicleStatus.ON_ROUTE, VehicleStatus.AVAILABLE));
        long availableVehicles = vehicleRepository.countByStatus(VehicleStatus.AVAILABLE);
        long stations = stationRepository.count();
        long activeIncidents = incidentRepository.countByStatusIn(List.of(IncidentStatus.ASSIGNED, IncidentStatus.REPORTED));
        long pendingRequests = incidentRepository.countByStatusIn(List.of(IncidentStatus.REPORTED));
        return new StatsDTO(totalUsers, activeVehicles, availableVehicles, stations, activeIncidents , pendingRequests);
    }
}
