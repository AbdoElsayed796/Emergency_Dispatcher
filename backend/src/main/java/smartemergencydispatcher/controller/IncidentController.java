package smartemergencydispatcher.controller;


import lombok.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import smartemergencydispatcher.dto.incidentdto.IncidentDTO;
import smartemergencydispatcher.dto.incidentdto.IncidentStatusUpdateDTO;
import smartemergencydispatcher.service.IncidentService;

import java.util.List;

@RestController
@RequestMapping("/incidents")
@RequiredArgsConstructor
@CrossOrigin("*")
public class IncidentController {

    private final IncidentService incidentService;

    @GetMapping("/all")
    public ResponseEntity<List<IncidentDTO>> getAllIncidents(){
        System.out.println("Here#######################");
        List<IncidentDTO> incidents = incidentService.getAllIncidents();
        return ResponseEntity.ok(incidents);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<IncidentDTO> updateIncidentStatus(@PathVariable Integer id,
                                                            @RequestBody IncidentStatusUpdateDTO statusUpdateDTO){
        IncidentDTO updatedIncident = incidentService.updateIncidentStatus(id, statusUpdateDTO);
        return ResponseEntity.ok(updatedIncident);
    }
}
