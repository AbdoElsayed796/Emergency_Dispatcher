package smartemergencydispatcher.service.RedisService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import smartemergencydispatcher.dto.locationDTO.LocationDTO;
import smartemergencydispatcher.dto.vehicledto.VehicleDataDTO;
import smartemergencydispatcher.model.enums.VehicleStatus;
import smartemergencydispatcher.redis.Redis;

import java.util.Map;

@Service
public class RedisServiceImp implements RedisService{
    private final Redis redis;
    @Autowired
    public RedisServiceImp (Redis redis){
        this.redis = redis ;
    }

    @Override
    public boolean setVehicleData(VehicleDataDTO vehicleDataDTO) {
        long res = redis.setItems(vehicleDataDTO.getId() ,vehicleDataDTO.getStatus() , vehicleDataDTO.getLocationDTO().getLongitude().toString() ,vehicleDataDTO.getLocationDTO().getLatitude().toString());
        return (res!=-1);
    }
    @Override
    public VehicleDataDTO getVehicleData(Integer id) {
        Map<String, String> ans= redis.getItems(id);
        VehicleDataDTO vehicleDataDTO = new VehicleDataDTO();
        if (ans.isEmpty()) {
            vehicleDataDTO.setId(-1);
            return vehicleDataDTO;
        }
        vehicleDataDTO.setId(id);
        double longitude = Double.parseDouble(ans.get("long"));
        double latitude = Double.parseDouble(ans.get("lat"));
        vehicleDataDTO.setLocationDTO(new LocationDTO( latitude, longitude));
        String stautsStr = ans.get("status");
        if (stautsStr.equals(VehicleStatus.AVAILABLE.toString())){
            vehicleDataDTO.setStatus(VehicleStatus.AVAILABLE);
        }
        else if (stautsStr.equals(VehicleStatus.BUSY.toString())){
            vehicleDataDTO.setStatus(VehicleStatus.BUSY);
        }
        else if (stautsStr.equals(VehicleStatus.MAINTENANCE.toString())) {
            vehicleDataDTO.setStatus(VehicleStatus.MAINTENANCE);
        }
        else if (stautsStr.equals(VehicleStatus.ON_ROUTE.toString())) {
            vehicleDataDTO.setStatus(VehicleStatus.ON_ROUTE);
        }
        return vehicleDataDTO ;
    }
}
