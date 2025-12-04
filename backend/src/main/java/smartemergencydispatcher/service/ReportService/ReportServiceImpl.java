package smartemergencydispatcher.service.ReportService;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import smartemergencydispatcher.dto.statsdto.ResponseTimeDTO;
import smartemergencydispatcher.dto.vehicledto.VehicleDTO;
import smartemergencydispatcher.dto.vehicledto.VehiclePerformanceDTO;
import smartemergencydispatcher.dto.vehicledto.VehicleUtilizationDTO;
import smartemergencydispatcher.model.Assignment;
import smartemergencydispatcher.model.Vehicle;
import smartemergencydispatcher.model.enums.IncidentType;
import smartemergencydispatcher.model.enums.VehicleType;
import smartemergencydispatcher.repository.AssignmentRepository;
import smartemergencydispatcher.service.ReportService.ReportService;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    private final AssignmentRepository assignmentRepository;

    @Override
    public List<ResponseTimeDTO> getResponseTime(String typeStr, LocalDate from, LocalDate to) {

        IncidentType type = (typeStr == null || typeStr.equalsIgnoreCase("ALL"))
                ? null
                : IncidentType.valueOf(typeStr.toUpperCase());

        List<Object[]> stats = assignmentRepository.getResponseTimeStats(
                type,
                from.atStartOfDay(),
                to.atTime(23, 59, 59)
        );

        return stats.stream().map(row -> {
            IncidentType t = (IncidentType) row[0];
            Number avgNum = (Number) row[1];
            Number minNum = (Number) row[2];
            Number maxNum = (Number) row[3];
            Number totalNum = (Number) row[4];

            Double avg = avgNum != null ? avgNum.doubleValue() : null;
            Double min = minNum != null ? minNum.doubleValue() : null;
            Double max = maxNum != null ? maxNum.doubleValue() : null;
            Long total = totalNum != null ? totalNum.longValue() : 0L;

            String color;
            switch (t) {
                case FIRE -> color = "bg-red-500";
                case MEDICAL -> color = "bg-blue-500";
                case POLICE -> color = "bg-green-500";
                default -> color = "bg-gray-500";
            }

            return new ResponseTimeDTO(
                    t.name(),
                    color,
                    String.format("%.1f min", avg),
                    String.format("%.1f min", min),
                    String.format("%.1f min", max),
                    total
            );
        }).collect(Collectors.toList());
    }

    @Override
    public List<VehicleUtilizationDTO> getVehicleUtilization(String vehicleTypeStr, LocalDate from, LocalDate to) {

        VehicleType vehicleType = (vehicleTypeStr == null || vehicleTypeStr.equalsIgnoreCase("ALL"))
                ? null
                : VehicleType.valueOf(vehicleTypeStr.toUpperCase());

        List<Assignment> assignments = (vehicleType != null)
                ? assignmentRepository.findByVehicleTypeAndTimeAssignedBetween(vehicleType, from.atStartOfDay(), to.atTime(23, 59, 59))
                : assignmentRepository.findByTimeAssignedBetween(from.atStartOfDay(), to.atTime(23, 59, 59));

        // Group by vehicle type
        Map<VehicleType, List<Assignment>> assignmentsByType = assignments.stream()
                .collect(Collectors.groupingBy(a -> a.getVehicle().getType()));

        return assignmentsByType.entrySet().stream().map(entry -> {
            VehicleType type = entry.getKey();
            List<Assignment> typeAssignments = entry.getValue();

            long totalMinutes = typeAssignments.stream()
                    .mapToLong(a -> {
                        LocalDateTime start = a.getTimeAssigned();
                        LocalDateTime end = (a.getTimeFinished() != null) ? a.getTimeFinished() : LocalDateTime.now();
                        return Duration.between(start, end).toMinutes();
                    })
                    .sum();

            long hoursActive = totalMinutes / 60;
            long totalTasks = typeAssignments.size();

            long days = Duration.between(from.atStartOfDay(), to.atTime(23, 59, 59)).toDays() + 1;
            double utilizationRate = (double) hoursActive / (days * 24) * 100; // should be changed

            return new VehicleUtilizationDTO(
                    type.name(),
                    Math.round(utilizationRate * 10.0) / 10.0,
                    hoursActive,
                    totalTasks
            );
        }).collect(Collectors.toList());
    }

    @Override
    public List<VehiclePerformanceDTO> getTopPerformingVehicles(String typeStr, LocalDate from, LocalDate to) {
        VehicleType type = (typeStr == null || typeStr.equalsIgnoreCase("ALL"))
                ? null
                : VehicleType.valueOf(typeStr.toUpperCase());

        List<Object[]> results = assignmentRepository.getTopPerformersByVehicle(
                type,
                from.atStartOfDay(),
                to.atTime(23, 59, 59)
        );

        return results.stream()
                .limit(10)
                .map(row -> {
                    VehicleDTO vehicleDTO = new VehicleDTO();
                    vehicleDTO.setId((Integer) row[0]);
                    vehicleDTO.setType((VehicleType) row[1]);
                    vehicleDTO.setResponderId((Integer) row[2]);
                    vehicleDTO.setResponderName((String) row[3]);

                    double minResponse = ((Number) row[4]).doubleValue();
                    double avgResponse = ((Number) row[5]).doubleValue();
                    long totalTasks = ((Number) row[6]).longValue();

                    return new VehiclePerformanceDTO(vehicleDTO, minResponse, avgResponse, totalTasks);
                }).collect(Collectors.toList());
    }

}
