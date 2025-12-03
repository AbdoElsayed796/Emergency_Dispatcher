package smartemergencydispatcher.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import smartemergencydispatcher.dto.incidentdto.IncidentDTO;
import smartemergencydispatcher.service.IncidentService.IncidentService;

import java.util.List;

@RestController
@RequestMapping("/api/admin/incidents")
@RequiredArgsConstructor
public class IncidentController {

    private final IncidentService incidentService;

    @GetMapping("/active")
    public ResponseEntity<List<IncidentDTO>> getActiveIncidents() {
        List<IncidentDTO> activeIncidents = incidentService.getActiveIncidents();
        return ResponseEntity.ok(activeIncidents);
    }
}
