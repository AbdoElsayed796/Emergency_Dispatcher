package smartemergencydispatcher.service.StationService;


import smartemergencydispatcher.dto.stationdto.StationDTO;
import smartemergencydispatcher.dto.stationdto.StationCreateDTO;
import smartemergencydispatcher.dto.stationdto.StationUpdateDTO;

import java.util.List;

public interface StationService {
    List<StationDTO> getAllStations();
    StationDTO createStation(StationCreateDTO dto);
    StationDTO updateStation(Integer id, StationUpdateDTO dto);
    void deleteStation(Integer id);
}
