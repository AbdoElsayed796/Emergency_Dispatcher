package smartemergencydispatcher.service;

import lombok.*;
import org.springframework.stereotype.Service;
import smartemergencydispatcher.dto.vehicledto.AvailableVehicleDTO;
import smartemergencydispatcher.dto.vehicledto.VehicleDTO;
import smartemergencydispatcher.mapper.VehicleMapper;
import smartemergencydispatcher.model.Vehicle;
import smartemergencydispatcher.repository.StationRepository;
import smartemergencydispatcher.repository.UserRepository;
import smartemergencydispatcher.repository.VehicleRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VehicleService {

    private final VehicleRepository vehicleRepository;
    private final StationRepository stationRepository;
    private final UserRepository userRepository;
    private final VehicleMapper vehicleMapper;

    public List<VehicleDTO> getAllVehicles(){
        List<Vehicle> vehicles = vehicleRepository.findAllVehicles();
        return vehicles.stream().map(vehicleMapper::toDTO).collect(Collectors.toList());
    }


    public List<AvailableVehicleDTO> getAllAvailableVehicles(){
        List<Vehicle> availableVehicles = vehicleRepository.findAllAvailableVehicles();
        return availableVehicles.stream().map(vehicleMapper::toAvailableDTO).collect(Collectors.toList());
    }


}
