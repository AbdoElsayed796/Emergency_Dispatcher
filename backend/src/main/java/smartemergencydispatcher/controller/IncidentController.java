package smartemergencydispatcher.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import smartemergencydispatcher.dto.incidentdto.IncidentCreateDTO;
import smartemergencydispatcher.dto.incidentdto.IncidentDTO;
import smartemergencydispatcher.model.enums.IncidentStatus;
import smartemergencydispatcher.model.enums.IncidentType;
import smartemergencydispatcher.model.enums.SeverityLevel;
import smartemergencydispatcher.service.Incident.IncidentService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/incidents")
@CrossOrigin(origins = "http://localhost:5173")
public class IncidentController {
    private final IncidentService incidentService;
    @Autowired
    public IncidentController(IncidentService incidentService) {
        this.incidentService = incidentService;
    }
    @GetMapping("/get/{id}")
    public IncidentDTO getIncidentById(@PathVariable Integer id) {
        return incidentService.getIncidentById(id);
    }
    @GetMapping("/getByStatus/{status}")
    public List<IncidentDTO> getIncidentByStatus(@PathVariable IncidentStatus status) {
        return incidentService.getIncidentByStatus(status);
    }
    @GetMapping("/getByType/{type}")
    public List<IncidentDTO> getIncidentByType(@PathVariable IncidentType type) {
        return incidentService.getIncidentByType(type);
    }
    @GetMapping("/getBySeverity/{severity}")
    public List<IncidentDTO> getIncidentBySeverity(@PathVariable SeverityLevel severity) {
        return incidentService.getIncidentBySeverity(severity);
    }
    @GetMapping
    public List<IncidentDTO> findAll() {
        return incidentService.findAll();
    }
    @DeleteMapping("/delete/{id}")
    public void deleteById(@PathVariable Integer id) {
        incidentService.deleteById(id);
    }
    @PostMapping("/add")
    public ResponseEntity<?> save(@RequestBody IncidentCreateDTO incidentCreateDTO) {
        IncidentDTO incidentDTO = incidentService.save(incidentCreateDTO);
        if (incidentDTO.getId()!=null){
            return ResponseEntity.ok(Map.of("success", true, "message", "Incident reported successfully"));
        }else {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Failed to report incident"));
        }
    }
    @PutMapping("/update/{id}")
    public IncidentDTO updateIncident(@PathVariable Integer id, @RequestBody IncidentDTO incidentDTO) {
        return incidentService.updateIncident(id, incidentDTO);
    }
}
