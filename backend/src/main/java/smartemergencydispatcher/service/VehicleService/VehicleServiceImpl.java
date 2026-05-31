package smartemergencydispatcher.service.VehicleService;

import lombok.RequiredArgsConstructor;
import org.locationtech.jts.geom.Coordinate;
import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.Point;
import org.springframework.stereotype.Service;
import smartemergencydispatcher.dto.locationDTO.LocationDTO;
import smartemergencydispatcher.dto.vehicledto.*;
import smartemergencydispatcher.mapper.VehicleMapper;
import smartemergencydispatcher.model.Station;
import smartemergencydispatcher.model.User;
import smartemergencydispatcher.model.Vehicle;
import smartemergencydispatcher.model.enums.VehicleStatus;
import smartemergencydispatcher.repository.StationRepository;
import smartemergencydispatcher.repository.UserRepository;
import smartemergencydispatcher.repository.VehicleRepository;
import smartemergencydispatcher.service.RedisService.RedisService;
import com.fasterxml.jackson.databind.ObjectMapper;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.JedisPoolConfig;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VehicleServiceImpl implements VehicleService {

    private final VehicleRepository vehicleRepository;
    private final StationRepository stationRepository;
    private final UserRepository userRepository;
    private final VehicleMapper vehicleMapper;
    private final RedisService redisService;
    private final GeometryFactory geometryFactory = new GeometryFactory();
    private final ObjectMapper objectMapper = new ObjectMapper();

    // Lazy initialization of JedisPool
    private JedisPool getJedisPool() {
        if (jedisPool == null) {
            synchronized (this) {
                if (jedisPool == null) {
                    JedisPoolConfig poolConfig = new JedisPoolConfig();
                    poolConfig.setMaxTotal(30);
                    jedisPool = new JedisPool(poolConfig, "localhost", 6379);
                }
            }
        }
        return jedisPool;
    }
    private JedisPool jedisPool;

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

        Vehicle savedVehicle = vehicleRepository.save(vehicle);

        // Update Redis and trigger WebSocket broadcast
        updateRedisAndBroadcast(savedVehicle);

        return vehicleMapper.toDTO(savedVehicle);
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

        Vehicle updatedVehicle = vehicleRepository.save(vehicle);

        // Update Redis and trigger WebSocket broadcast
        updateRedisAndBroadcast(updatedVehicle);

        return vehicleMapper.toDTO(updatedVehicle);
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

    /**
     * Updates vehicle data in Redis and broadcasts to WebSocket
     * Broadcasts both location AND status changes
     */
    private void updateRedisAndBroadcast(Vehicle vehicle) {
        try (Jedis jedis = getJedisPool().getResource()) {
            Point location = vehicle.getLocation();

            // Update Redis with vehicle data
            VehicleDataDTO vehicleDataDTO = new VehicleDataDTO();
            vehicleDataDTO.setId(vehicle.getId());
            vehicleDataDTO.setStatus(vehicle.getStatus());

            LocationDTO locationDTO = new LocationDTO(
                    location.getY(), // latitude
                    location.getX()  // longitude
            );
            vehicleDataDTO.setLocationDTO(locationDTO);

            // Store in Redis
            redisService.setVehicleData(vehicleDataDTO);

            // Publish complete vehicle info (location + status + type) to WebSocket
            VehicleLiveDTO liveDTO = new VehicleLiveDTO();
            liveDTO.setId(vehicle.getId());
            liveDTO.setStatus(vehicle.getStatus().toString());
            liveDTO.setLatitude(location.getY());
            liveDTO.setLongitude(location.getX());
            liveDTO.setType(vehicle.getType().toString());
            System.out.println("type is "+liveDTO.getType());
            String json = objectMapper.writeValueAsString(liveDTO);
            jedis.publish("vehicle-updates", json);

            System.out.println("📡 Broadcasted vehicle update: ID=" + vehicle.getId() + ", Status=" + vehicle.getStatus());

        } catch (Exception e) {
            System.err.println("❌ Error updating Redis and broadcasting: " + e.getMessage());
            e.printStackTrace();
        }
    }

    @Override
    public void updateVehicleLocation(VehicleLocationUpdateDTO dto) {
        Vehicle vehicle = vehicleRepository.findById(dto.getVehicleId())
                .orElseThrow(() -> new RuntimeException("Vehicle not found with id: " + dto.getVehicleId()));

        // Update location
        Point newLocation = geometryFactory.createPoint(
                new Coordinate(dto.getLongitude(), dto.getLatitude())
        );
        vehicle.setLocation(newLocation);

        // Update status if provided
        if (dto.getStatus() != null && !dto.getStatus().isEmpty()) {
            try {
                vehicle.setStatus(VehicleStatus.valueOf(dto.getStatus()));
            } catch (IllegalArgumentException e) {
                System.err.println("⚠️ Invalid status: " + dto.getStatus());
            }
        }

        // Save to database
        vehicleRepository.save(vehicle);

        // This will update Redis and broadcast via WebSocket
        updateRedisAndBroadcast(vehicle);
    }
}