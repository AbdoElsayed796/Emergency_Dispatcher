package smartemergencydispatcher.service.SimulationService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import smartemergencydispatcher.dto.simulation.SimulationRequestDTO;

@Service
@RequiredArgsConstructor
public class SimulationService {

    private final RestTemplate restTemplate = new RestTemplate();
    private static final String SIMULATION_SERVICE_URL = "http://localhost:5000/simulate";

    public void startSimulation(SimulationRequestDTO request) {
        try {
            restTemplate.postForEntity(SIMULATION_SERVICE_URL, request, String.class);
            System.out.println("✅ Simulation triggered for vehicle: " + request.getVehicleId());
        } catch (Exception e) {
            System.err.println("❌ Failed to trigger simulation: " + e.getMessage());
            // Don't throw exception - assignment should succeed even if simulation fails
        }
    }
}