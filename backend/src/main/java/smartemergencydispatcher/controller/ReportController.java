package smartemergencydispatcher.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import smartemergencydispatcher.dto.statsdto.ResponseTimeDTO;
import smartemergencydispatcher.dto.vehicledto.VehiclePerformanceDTO;
import smartemergencydispatcher.dto.vehicledto.VehicleUtilizationDTO;
import smartemergencydispatcher.service.ReportService.ReportService;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/response-time")
    public ResponseEntity<List<ResponseTimeDTO>> getResponseTime(
            @RequestParam(required = false) String type,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to
    ) {
        List<ResponseTimeDTO> report = reportService.getResponseTime(type, from, to);
        return ResponseEntity.ok(report);
    }

    @GetMapping("/utilization")
    public ResponseEntity<List<VehicleUtilizationDTO>> getVehicleUtilization(
            @RequestParam(required = false) String vehicle,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to
    ) {
        List<VehicleUtilizationDTO> report = reportService.getVehicleUtilization(vehicle, from, to);
        return ResponseEntity.ok(report);
    }


    @GetMapping("/top-performing")
    public ResponseEntity<List<VehiclePerformanceDTO>> getTopPerformingVehicles(
            @RequestParam(required = false) String type,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to
    ) {
        List<VehiclePerformanceDTO> report = reportService.getTopPerformingVehicles(type, from, to);
        return ResponseEntity.ok(report);
    }


}
