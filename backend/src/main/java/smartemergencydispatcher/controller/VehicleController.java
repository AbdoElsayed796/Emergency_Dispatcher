package smartemergencydispatcher.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
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

    @GetMapping
    public List<VehicleDTO> getAllVehicles() {
        return vehicleService.getAllVehicles();
    }

    @PostMapping
    public VehicleDTO createVehicle(@RequestBody VehicleCreateDTO dto) {
        return vehicleService.createVehicle(dto);
    }

    @PutMapping("/{id}")
    public VehicleDTO updateVehicle(@PathVariable Integer id, @RequestBody VehicleUpdateDTO dto) {
        return vehicleService.updateVehicle(id, dto);
    }

    @DeleteMapping("/{id}")
    public void deleteVehicle(@PathVariable Integer id) {
        vehicleService.deleteVehicle(id);
    }
}
