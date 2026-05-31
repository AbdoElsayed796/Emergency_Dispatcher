package smartemergencydispatcher.service.RedisService;
import smartemergencydispatcher.dto.vehicledto.VehicleDataDTO;

public interface RedisService {
    boolean setVehicleData (VehicleDataDTO vehicleDataDTO);
    VehicleDataDTO getVehicleData(Integer id);
    void publish(String channel, String message);
    void subscribe(String channel);
}
