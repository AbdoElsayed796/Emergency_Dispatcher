package smartemergencydispatcher.controller;


import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.w3c.dom.ls.LSInput;
import smartemergencydispatcher.dto.vehicledto.AvailableVehicleDTO;
import smartemergencydispatcher.dto.vehicledto.VehicleDTO;
import smartemergencydispatcher.service.VehicleService;

import java.util.List;

@RestController
@RequestMapping("/vehicles")
@RequiredArgsConstructor
@CrossOrigin("*")
public class VehicleController {

    private final VehicleService vehicleService;

    @GetMapping("/all")
    public ResponseEntity<List<VehicleDTO>> getAllVehicles(){
        List<VehicleDTO> vehicles = vehicleService.getAllVehicles();
        return ResponseEntity.ok(vehicles);
    }

    @GetMapping("/available")
    public ResponseEntity<List<AvailableVehicleDTO>> getAllAvailableVehicles(){
        List<AvailableVehicleDTO> availableVehicles = vehicleService.getAllAvailableVehicles();
        return ResponseEntity.ok(availableVehicles);
    }
}
