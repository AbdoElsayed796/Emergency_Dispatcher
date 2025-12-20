package smartemergencydispatcher.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import smartemergencydispatcher.dto.vehicledto.VehicleDataDTO;
import smartemergencydispatcher.service.RedisService.RedisService;

import java.util.Map;

@RestController
@RequestMapping("/redis")
public class RedisController {
    private final RedisService redisServiceImp;
    @Autowired
    public RedisController (RedisService redisServiceImp){
        this.redisServiceImp = redisServiceImp;
    }
    @PostMapping("/add")
    public ResponseEntity<?> save(@RequestBody VehicleDataDTO vehicleDataDTO) {
        boolean saved = redisServiceImp.setVehicleData(vehicleDataDTO);
        if (saved) {
            return ResponseEntity.ok(Map.of("success", true, "message", "vehicle data saved successfully"));
        }else {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Failed to save vehicle data"));
        }
    }
    @GetMapping("/{id}")
    public ResponseEntity<?> getVehicleData(@PathVariable Integer id) {
        VehicleDataDTO ans = redisServiceImp.getVehicleData(id);
        if (ans.getId()!=-1){
            return ResponseEntity.ok(Map.of("success", true, "message", "vehicle data is found successfully", "data" , ans));
        }else {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "cannot get vehicle data" , "data" , ans));
        }
    }
}
