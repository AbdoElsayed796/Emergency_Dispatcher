package smartemergencydispatcher.service.VehicleService;

import smartemergencydispatcher.dto.vehicledto.VehicleDTO;

import java.util.List;
import java.util.Scanner;
import java.util.stream.Collectors;

public class VehicleServiceImp implements VehicleService{
    public List<VehicleDTO> getAllVehicles() {
        Scanner vehicleRepository;
        return vehicleRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
}
