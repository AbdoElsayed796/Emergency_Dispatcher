package smartemergencydispatcher.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import smartemergencydispatcher.dto.stationdto.StationDTO;
import smartemergencydispatcher.dto.stationdto.StationCreateDTO;
import smartemergencydispatcher.dto.stationdto.StationUpdateDTO;
import smartemergencydispatcher.service.StationService.StationService;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/stations")
@CrossOrigin(origins = "http://localhost:5173")
public class StationController {

    private final StationService stationService;

    @GetMapping
    public List<StationDTO> getAllStations() {
        return stationService.getAllStations();
    }

    @PostMapping
    public StationDTO createStation(@RequestBody StationCreateDTO dto) {
        return stationService.createStation(dto);
    }

    @PutMapping("/{id}")
    public StationDTO updateStation(@PathVariable Integer id, @RequestBody StationUpdateDTO dto) {
        return stationService.updateStation(id, dto);
    }

    @DeleteMapping("/{id}")
    public void deleteStation(@PathVariable Integer id) {
        stationService.deleteStation(id);
    }
}
