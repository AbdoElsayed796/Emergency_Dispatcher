package smartemergencydispatcher.service.VehicleService;

import smartemergencydispatcher.dto.vehicledto.VehicleDTO;
import smartemergencydispatcher.dto.vehicledto.VehicleCreateDTO;
import smartemergencydispatcher.dto.vehicledto.VehicleUpdateDTO;

import java.util.List;

public interface VehicleService {
    List<VehicleDTO> getAllVehicles();
    VehicleDTO createVehicle(VehicleCreateDTO dto);
    VehicleDTO updateVehicle(Integer id, VehicleUpdateDTO dto);
    void deleteVehicle(Integer id);
}
