package smartemergencydispatcher.service.VehicleService;

import lombok.RequiredArgsConstructor;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.springframework.stereotype.Service;
import smartemergencydispatcher.dto.locationDTO.LocationDTO;
import smartemergencydispatcher.dto.vehicledto.AvailableVehicleDTO;
import smartemergencydispatcher.dto.vehicledto.VehicleDTO;
import smartemergencydispatcher.dto.vehicledto.VehicleCreateDTO;
import smartemergencydispatcher.dto.vehicledto.VehicleUpdateDTO;
import smartemergencydispatcher.mapper.VehicleMapper;
import smartemergencydispatcher.model.Station;
import smartemergencydispatcher.model.User;
import smartemergencydispatcher.model.Vehicle;
import smartemergencydispatcher.repository.StationRepository;
import smartemergencydispatcher.repository.UserRepository;
import smartemergencydispatcher.repository.VehicleRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VehicleServiceImpl implements VehicleService {

    private final VehicleRepository vehicleRepository;
    private final StationRepository stationRepository;
    private final UserRepository userRepository;
    private final VehicleMapper vehicleMapper; // Injected mapper
    private final GeometryFactory geometryFactory = new GeometryFactory();

    @Override
    public List<VehicleDTO> getAllVehicles() {
        return vehicleRepository.findAllVehicles()
                .stream()
                .map(vehicleMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public VehicleDTO createVehicle(VehicleCreateDTO dto) {
        Station station = stationRepository.findById(dto.getStationId())
                .orElseThrow(() -> new RuntimeException("Station not found"));

        User responder = userRepository.findById(dto.getResponderId())
                .orElseThrow(() -> new RuntimeException("Responder user not found"));

        Vehicle vehicle = new Vehicle();
        vehicle.setType(dto.getType());
        vehicle.setStatus(dto.getStatus());
        vehicle.setCapacity(dto.getCapacity());
        vehicle.setLocation(convertToPoint(dto.getLocation()));
        vehicle.setStation(station);
        vehicle.setResponder(responder);

        return vehicleMapper.toDTO(vehicleRepository.save(vehicle));
    }

    @Override
    public VehicleDTO updateVehicle(Integer id, VehicleUpdateDTO dto) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));

        User responder = userRepository.findById(dto.getResponderId())
                .orElseThrow(() -> new RuntimeException("Responder user not found"));

        vehicle.setStatus(dto.getStatus());
        vehicle.setCapacity(dto.getCapacity());
        vehicle.setLocation(convertToPoint(dto.getLocation()));
        vehicle.setResponder(responder);

        return vehicleMapper.toDTO(vehicleRepository.save(vehicle));
    }

    @Override
    public void deleteVehicle(Integer id) {
        vehicleRepository.deleteById(id);
    }

    @Override
    public List<AvailableVehicleDTO> getAllAvailableVehicles() {
        List<Vehicle> availableVehicles = vehicleRepository.findAllAvailableVehicles();
        return availableVehicles.stream()
                .map(vehicleMapper::toAvailableDTO)
                .collect(Collectors.toList());
    }

    private Point convertToPoint(LocationDTO dto) {
        return geometryFactory.createPoint(new Coordinate(dto.getLongitude(), dto.getLatitude()));
    }
}
