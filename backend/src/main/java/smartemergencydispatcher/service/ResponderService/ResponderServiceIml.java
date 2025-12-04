package smartemergencydispatcher.service.ResponderService;

import lombok.RequiredArgsConstructor;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.springframework.stereotype.Service;
import smartemergencydispatcher.dto.incidentdto.IncidentDTO;
import smartemergencydispatcher.dto.vehicledto.VehicleDTO;
import smartemergencydispatcher.mapper.IncidentMapper;
import smartemergencydispatcher.mapper.VehicleMapper;
import smartemergencydispatcher.model.Incident;
import smartemergencydispatcher.model.Vehicle;
import smartemergencydispatcher.model.enums.IncidentStatus;
import smartemergencydispatcher.model.enums.VehicleStatus;
import smartemergencydispatcher.repository.IncidentRepository;
import smartemergencydispatcher.repository.VehicleRepository;

@Service
@RequiredArgsConstructor
public class ResponderServiceIml implements ResponderService {

    private final VehicleRepository vehicleRepository;
    private final IncidentRepository incidentRepository;
    private final VehicleMapper vehicleMapper;
    private final IncidentMapper incidentMapper;
    private final GeometryFactory geometryFactory = new GeometryFactory();

    @Override
    public VehicleDTO getVehicle(Integer responderUserId) {
        return vehicleMapper.toDTO(vehicleRepository.findByResponderId(responderUserId).orElseThrow());
    }

    @Override
    public VehicleDTO updateVehicleLocation(Integer vehicleId, Double longitude, Double latitude) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId).orElseThrow();
        vehicle.setLocation(geometryFactory.createPoint(new Coordinate(longitude, latitude)));
        return vehicleMapper.toDTO(vehicleRepository.save(vehicle));
    }

    @Override
    public VehicleDTO updateVehicleStatus(Integer vehicleId, VehicleStatus status) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId).orElseThrow();
        vehicle.setStatus(status);
        return vehicleMapper.toDTO(vehicleRepository.save(vehicle));
    }

    @Override
    public IncidentDTO updateIncidentStatus(Integer incidentId, IncidentStatus status) {
        Incident incident = incidentRepository.findById(incidentId).orElseThrow();
        incident.setStatus(status);
        return incidentMapper.toDTO(incidentRepository.save(incident));
    }
}
