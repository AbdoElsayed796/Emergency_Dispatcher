package smartemergencydispatcher.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import smartemergencydispatcher.dto.statsdto.StatsDTO;
import smartemergencydispatcher.service.StatsService.AdminStatsService;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AdminStatsController {

    private final AdminStatsService adminStatsService;

    @GetMapping("/stats")
    public ResponseEntity<StatsDTO> getStats() {
        StatsDTO stats = adminStatsService.getStats();
        return ResponseEntity.ok(stats);
    }
}
