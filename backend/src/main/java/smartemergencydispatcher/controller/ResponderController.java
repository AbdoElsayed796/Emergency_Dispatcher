package smartemergencydispatcher.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import smartemergencydispatcher.dto.incidentdto.IncidentDTO;
import smartemergencydispatcher.dto.vehicledto.VehicleDTO;
import smartemergencydispatcher.model.enums.IncidentStatus;
import smartemergencydispatcher.model.enums.VehicleStatus;
import smartemergencydispatcher.service.ResponderService.ResponderService;

@RestController
@RequestMapping("/api/responder")
@RequiredArgsConstructor
public class ResponderController {

    private final ResponderService responderService;

    @GetMapping("/vehicle")
    VehicleDTO getVehicle(@RequestParam Integer responderUserId) {
        return responderService.getVehicle(responderUserId);
    }

    @PutMapping("/update-vehicle-location")
    VehicleDTO updateVehicleLocation(@RequestParam Integer vehicleId,
                                     @RequestParam Double longitude,
                                     @RequestParam Double latitude) {
        return responderService.updateVehicleLocation(vehicleId, longitude, latitude);
    }

    @PutMapping("/update-vehicle-status")
    VehicleDTO updateVehicleStatus(@RequestParam Integer vehicleId,
                                   @RequestParam VehicleStatus status) {
        return responderService.updateVehicleStatus(vehicleId, status);
    }

    @PutMapping("/update-incident-status")
    IncidentDTO updateIncidentStatus(@RequestParam Integer incidentId,
                                     @RequestParam IncidentStatus status) {
        return responderService.updateIncidentStatus(incidentId, status);
    }
}
