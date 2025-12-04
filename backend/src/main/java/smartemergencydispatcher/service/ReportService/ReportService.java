package smartemergencydispatcher.service.ReportService;



import smartemergencydispatcher.dto.statsdto.ResponseTimeDTO;
import smartemergencydispatcher.dto.vehicledto.VehiclePerformanceDTO;
import smartemergencydispatcher.dto.vehicledto.VehicleUtilizationDTO;

import java.time.LocalDate;
import java.util.List;

public interface ReportService {
    List<ResponseTimeDTO> getResponseTime(String type, LocalDate from, LocalDate to);
    List<VehicleUtilizationDTO> getVehicleUtilization(String vehicleType, LocalDate from, LocalDate to);
    public List<VehiclePerformanceDTO> getTopPerformingVehicles(String typeStr, LocalDate from, LocalDate to);
}

