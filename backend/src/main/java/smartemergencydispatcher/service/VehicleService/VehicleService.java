package smartemergencydispatcher.service.VehicleService;

import smartemergencydispatcher.dto.vehicledto.*;

import java.util.List;

public interface VehicleService {
    List<VehicleDTO> getAllVehicles();
    VehicleDTO createVehicle(VehicleCreateDTO dto);
    VehicleDTO updateVehicle(Integer id, VehicleUpdateDTO dto);
    void deleteVehicle(Integer id);

    List<AvailableVehicleDTO> getAllAvailableVehicles();
    void updateVehicleLocation(VehicleLocationUpdateDTO dto);
}
