package smartemergencydispatcher.service.ResponderService;

import smartemergencydispatcher.dto.incidentdto.IncidentDTO;
import smartemergencydispatcher.dto.vehicledto.VehicleDTO;
import smartemergencydispatcher.model.enums.IncidentStatus;
import smartemergencydispatcher.model.enums.VehicleStatus;

public interface ResponderService {
    VehicleDTO getVehicle(Integer responderUserId);
    VehicleDTO updateVehicleLocation(Integer vehicleId, Double longitude, Double latitude);
    VehicleDTO updateVehicleStatus(Integer vehicleId, VehicleStatus status);
    IncidentDTO updateIncidentStatus(Integer incidentId, IncidentStatus status);
}
