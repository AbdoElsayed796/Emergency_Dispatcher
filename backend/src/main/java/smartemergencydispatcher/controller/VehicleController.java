package smartemergencydispatcher.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import smartemergencydispatcher.dto.vehicledto.AvailableVehicleDTO;
import smartemergencydispatcher.dto.vehicledto.VehicleDTO;
import smartemergencydispatcher.dto.vehicledto.VehicleCreateDTO;
import smartemergencydispatcher.dto.vehicledto.VehicleUpdateDTO;
import smartemergencydispatcher.service.VehicleService.VehicleService;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/vehicles")
@CrossOrigin(origins = "http://localhost:5173")
public class VehicleController {

    private final VehicleService vehicleService;

    // Get all vehicles
    @GetMapping
    public ResponseEntity<List<VehicleDTO>> getAllVehicles() {
        List<VehicleDTO> vehicles = vehicleService.getAllVehicles();
        return ResponseEntity.ok(vehicles);
    }

    // Get all available vehicles
    @GetMapping("/available")
    public ResponseEntity<List<AvailableVehicleDTO>> getAllAvailableVehicles() {
        List<AvailableVehicleDTO> availableVehicles = vehicleService.getAllAvailableVehicles();
        return ResponseEntity.ok(availableVehicles);
    }

    // Create vehicle
    @PostMapping
    public ResponseEntity<VehicleDTO> createVehicle(@RequestBody VehicleCreateDTO dto) {
        VehicleDTO vehicle = vehicleService.createVehicle(dto);
        return ResponseEntity.ok(vehicle);
    }

    // Update vehicle
    @PutMapping("/{id}")
    public ResponseEntity<VehicleDTO> updateVehicle(@PathVariable Integer id, @RequestBody VehicleUpdateDTO dto) {
        VehicleDTO updatedVehicle = vehicleService.updateVehicle(id, dto);
        return ResponseEntity.ok(updatedVehicle);
    }

    // Delete vehicle
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVehicle(@PathVariable Integer id) {
        vehicleService.deleteVehicle(id);
        return ResponseEntity.noContent().build();
    }
}
