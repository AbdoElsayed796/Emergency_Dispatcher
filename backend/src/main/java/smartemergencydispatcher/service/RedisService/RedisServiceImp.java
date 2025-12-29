package smartemergencydispatcher.service.RedisService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.ObjectMapper;

import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.JedisPoolConfig;
import smartemergencydispatcher.dto.locationDTO.LocationDTO;
import smartemergencydispatcher.dto.vehicledto.VehicleDataDTO;
import smartemergencydispatcher.dto.vehicledto.VehicleLiveDTO;
import smartemergencydispatcher.model.enums.VehicleStatus;
import smartemergencydispatcher.redis.Redis;
import redis.clients.jedis.JedisPubSub;

import java.util.Map;

@Service
public class RedisServiceImp implements RedisService{
    private final Redis redis;
    private final JedisPool jedisPool;
    private final ObjectMapper objectMapper;
    private Thread subscriberThread;

    @Autowired
    public RedisServiceImp(Redis redis){
        this.redis = redis;

        JedisPoolConfig poolConfig = new JedisPoolConfig();
        poolConfig.setMaxTotal(30);
        poolConfig.setMaxIdle(15);
        poolConfig.setMinIdle(5);
        this.jedisPool = new JedisPool(poolConfig, "localhost", 6379);

        this.objectMapper = new ObjectMapper();
    }

    @Override
    public boolean setVehicleData(VehicleDataDTO vehicleDataDTO) {
        long res = redis.setItems(
                vehicleDataDTO.getId(),
                vehicleDataDTO.getStatus(),
                vehicleDataDTO.getLocationDTO().getLongitude().toString(),
                vehicleDataDTO.getLocationDTO().getLatitude().toString()
        );

        // Publish to Redis channel after successfully storing
        if (res != -1) {
            publishVehicleUpdate(vehicleDataDTO);
        }

        return (res != -1);
    }

    @Override
    public VehicleDataDTO getVehicleData(Integer id) {
        Map<String, String> ans = redis.getItems(id);
        VehicleDataDTO vehicleDataDTO = new VehicleDataDTO();

        if (ans.isEmpty()) {
            vehicleDataDTO.setId(-1);
            return vehicleDataDTO;
        }

        vehicleDataDTO.setId(id);
        double longitude = Double.parseDouble(ans.get("long"));
        double latitude = Double.parseDouble(ans.get("lat"));
        vehicleDataDTO.setLocationDTO(new LocationDTO(latitude, longitude));

        String statusStr = ans.get("status");
        if (statusStr.equals(VehicleStatus.AVAILABLE.toString())){
            vehicleDataDTO.setStatus(VehicleStatus.AVAILABLE);
        }
        else if (statusStr.equals(VehicleStatus.BUSY.toString())){
            vehicleDataDTO.setStatus(VehicleStatus.BUSY);
        }
        else if (statusStr.equals(VehicleStatus.MAINTENANCE.toString())) {
            vehicleDataDTO.setStatus(VehicleStatus.MAINTENANCE);
        }
        else if (statusStr.equals(VehicleStatus.ON_ROUTE.toString())) {
            vehicleDataDTO.setStatus(VehicleStatus.ON_ROUTE);
        }

        return vehicleDataDTO;
    }

    @Override
    public void publish(String channel, String message) {
        try (Jedis jedis = jedisPool.getResource()) {
            jedis.publish(channel, message);
        } catch (Exception e) {
            System.err.println("Error publishing to channel " + channel + ": " + e.getMessage());
        }
    }

    @Override
    public void subscribe(String channel) {
        if (subscriberThread != null && subscriberThread.isAlive()) {
            System.out.println("Subscriber already running for channel: " + channel);
            return;
        }

        subscriberThread = new Thread(() -> {
            try (Jedis jedis = jedisPool.getResource()) {
                jedis.subscribe(new JedisPubSub() {
                    @Override
                    public void onMessage(String channel, String message) {
                        System.out.println("Received message: " + message + " from channel: " + channel);
                    }
                }, channel);
            } catch (Exception e) {
                System.err.println("Error in subscriber: " + e.getMessage());
            }
        });
        subscriberThread.start();
    }

    /**
     * Publishes vehicle updates to Redis channel for WebSocket broadcasting
     */
    private void publishVehicleUpdate(VehicleDataDTO vehicleDataDTO) {
        try (Jedis jedis = jedisPool.getResource()) {
            // Convert to VehicleLiveDTO for WebSocket
            VehicleLiveDTO liveDTO = new VehicleLiveDTO();
            liveDTO.setId(vehicleDataDTO.getId());
            liveDTO.setStatus(vehicleDataDTO.getStatus().toString());
            liveDTO.setLatitude(vehicleDataDTO.getLocationDTO().getLatitude());
            liveDTO.setLongitude(vehicleDataDTO.getLocationDTO().getLongitude());

            String json = objectMapper.writeValueAsString(liveDTO);
            jedis.publish("vehicle-updates", json);

            System.out.println("📡 Published vehicle update: " + liveDTO.getId());
        } catch (Exception e) {
            System.err.println("Error publishing vehicle update: " + e.getMessage());
            e.printStackTrace();
        }
    }
}